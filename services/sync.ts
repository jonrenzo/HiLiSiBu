import { getAnswers, getAllAnswers, getTalasalitaanAnswers, getAllTalasalitaanAnswers, getReadChapters, markChapterAsRead } from './db';
import { supabase } from '../src/lib/supabase';
import { saveActivityAnswer, getActivityAnswersFrom4p, saveTalasalitaanAnswers as saveTalasalitaanToSupabase, getTalasalitaanAnswers as getTalasalitaanFromSupabase, markChapterAsRead as markChapterToSupabase, getChapterProgress as getChapterProgressFromSupabase } from '../src/services/supabase';

let isOnline = true;

export const checkConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    isOnline = !error;
    return isOnline;
  } catch {
    isOnline = false;
    return false;
  }
};

export const isConnected = (): boolean => isOnline;

const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

export const syncAnswer = async (
  activityId: string,
  questionIndex: number | string,
  answer: string
): Promise<boolean> => {
  if (!await checkConnection()) {
    console.log('[Sync] Offline - skipping sync for answer');
    return false;
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    console.log('[Sync] No user logged in - skipping sync');
    return false;
  }

  try {
    const parts = activityId.split('-');
    const activityType = parts[0];
    const chapterRange = parts[1] || '';

    const { error } = await supabase.from('4p_answers').upsert({
      user_id: userId,
      activity_type: activityType,
      chapter_range: chapterRange,
      question_index: questionIndex.toString(),
      answer: answer,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,activity_type,chapter_range,question_index' });

    if (error) {
      console.error('[Sync] Error syncing answer:', error);
      return false;
    }

    console.log('[Sync] Answer synced:', activityId, questionIndex);
    return true;
  } catch (error) {
    console.error('[Sync] Sync failed:', error);
    return false;
  }
};

export const syncAllAnswers = async (): Promise<boolean> => {
  if (!await checkConnection()) {
    console.log('[Sync] Offline - skipping full sync');
    return false;
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return false;
  }

  try {
    const savedAnswers = await getAllAnswers();
    console.log('[Sync] Syncing', savedAnswers.length, 'answers...');

    for (const ans of savedAnswers) {
      const parts = ans.activity_id.split('-');
      const activityType = parts[0];
      const chapterRange = parts[1] || '';

      await supabase.from('4p_answers').upsert({
        user_id: userId,
        activity_type: activityType,
        chapter_range: chapterRange,
        question_index: ans.question_index,
        answer: ans.selected_answer,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,activity_type,chapter_range,question_index' });
    }

    console.log('[Sync] All answers synced');
    return true;
  } catch (error) {
    console.error('[Sync] Full sync failed:', error);
    return false;
  }
};

export const syncTalasalitaanAnswers = async (
  chapterId: number,
  quizType: string,
  answers: Record<string, unknown>
): Promise<boolean> => {
  if (!await checkConnection()) {
    console.log('[Sync] Offline - skipping sync for talasalitaan');
    return false;
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return false;
  }

  try {
    const { error } = await supabase.from('talasalitaan_answers').upsert({
      user_id: userId,
      chapter_id: chapterId,
      quiz_type: quizType,
      answers: answers,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,chapter_id,quiz_type' });

    if (error) {
      console.error('[Sync] Error syncing talasalitaan:', error);
      return false;
    }

    console.log('[Sync] Talasalitaan synced:', chapterId, quizType);
    return true;
  } catch (error) {
    console.error('[Sync] Talasalitaan sync failed:', error);
    return false;
  }
};

export const syncChapterRead = async (chapterId: number): Promise<boolean> => {
  if (!await checkConnection()) {
    console.log('[Sync] Offline - skipping sync for chapter read');
    return false;
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return false;
  }

  try {
    const { error } = await supabase.from('chapter_progress').upsert({
      user_id: userId,
      chapter_id: chapterId,
      is_read: true,
      read_at: new Date().toISOString(),
    }, { onConflict: 'user_id,chapter_id' });

    if (error) {
      console.error('[Sync] Error syncing chapter read:', error);
      return false;
    }

    console.log('[Sync] Chapter read synced:', chapterId);
    return true;
  } catch (error) {
    console.error('[Sync] Chapter read sync failed:', error);
    return false;
  }
};

export const syncChapterProgress = async (): Promise<boolean> => {
  if (!await checkConnection()) {
    return false;
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return false;
  }

  try {
    const readChapters = await getReadChapters();
    for (const chapterId of readChapters) {
      await supabase.from('chapter_progress').upsert({
        user_id: userId,
        chapter_id: chapterId,
        is_read: true,
        read_at: new Date().toISOString(),
      }, { onConflict: 'user_id,chapter_id' });
    }

    console.log('[Sync] Chapter progress synced:', readChapters.length, 'chapters');
    return true;
  } catch (error) {
    console.error('[Sync] Chapter progress sync failed:', error);
    return false;
  }
};

export const loadFromRemote = async (): Promise<void> => {
  if (!await checkConnection()) {
    console.log('[Sync] Offline - cannot load from remote');
    return;
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return;
  }

  try {
    const { data: answers } = await supabase
      .from('4p_answers')
      .select('activity_type, chapter_range, question_index, answer, updated_at')
      .eq('user_id', userId);

    console.log('[Sync] Loaded', answers?.length || 0, 'answers from remote');
  } catch (error) {
    console.error('[Sync] Load from remote failed:', error);
  }
};

export const syncAll = async (): Promise<boolean> => {
  const connected = await checkConnection();
  if (!connected) {
    console.log('[Sync] Cannot sync - offline');
    return false;
  }

  await syncChapterProgress();
  await syncAllAnswers();

  console.log('[Sync] Full sync complete');
  return true;
};