import { supabase } from '../lib/supabase';

export interface ChapterProgress {
  chapter_id: number;
  is_read: boolean;
  read_at: string | null;
}

export interface TalasalitaanAnswer {
  chapter_id: number;
  quiz_type: string;
  answers: Record<string, unknown>;
  score: number;
}

export interface ActivityAnswer {
  activity_id: string;
  question_index: number;
  answer: string | null;
  is_correct: boolean | null;
}

export const markChapterAsRead = async (userId: string, chapterId: number): Promise<void> => {
  const { error } = await supabase.from('chapter_progress').upsert(
    {
      user_id: userId,
      chapter_id: chapterId,
      is_read: true,
      read_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,chapter_id' }
  );

  if (error) throw error;
};

export const getChapterProgress = async (userId: string): Promise<ChapterProgress[]> => {
  const { data, error } = await supabase
    .from('chapter_progress')
    .select('chapter_id, is_read, read_at')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
};

export const getChapterReadingStatus = async (
  userId: string,
  chapterId: number
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('chapter_progress')
    .select('is_read')
    .eq('user_id', userId)
    .eq('chapter_id', chapterId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.is_read || false;
};

export const saveTalasalitaanAnswers = async (
  userId: string,
  chapterId: number,
  quizType: string,
  answers: Record<string, unknown>,
  score: number = 0
): Promise<void> => {
  const { error } = await supabase.from('talasalitaan_answers').upsert(
    {
      user_id: userId,
      chapter_id: chapterId,
      quiz_type: quizType,
      answers: answers,
      score: score,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,chapter_id,quiz_type' }
  );

  if (error) throw error;
};

export const getTalasalitaanAnswers = async (
  userId: string,
  chapterId: number,
  quizType: string
): Promise<TalasalitaanAnswer | null> => {
  const { data, error } = await supabase
    .from('talasalitaan_answers')
    .select('chapter_id, quiz_type, answers, score')
    .eq('user_id', userId)
    .eq('chapter_id', chapterId)
    .eq('quiz_type', quizType)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const getAllTalasalitaanAnswers = async (
  userId: string,
  chapterId?: number
): Promise<TalasalitaanAnswer[]> => {
  let query = supabase
    .from('talasalitaan_answers')
    .select('chapter_id, quiz_type, answers, score')
    .eq('user_id', userId);

  if (chapterId) {
    query = query.eq('chapter_id', chapterId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

export const saveActivityAnswer = async (
  userId: string,
  activityId: string,
  questionIndex: number,
  answer: string,
  isCorrect: boolean
): Promise<void> => {
  const parts = activityId.split('-');
  const activityType = parts[0];
  // Correctly extract range (e.g. "01-03") by joining parts after the first "-"
  const chapterRange = parts.slice(1).join('-') || '';


  const { error } = await supabase.from('4p_answers').upsert({
    user_id: userId,
    activity_type: activityType,
    chapter_range: chapterRange,
    question_index: questionIndex.toString(),
    answer: answer,
  }, { onConflict: 'user_id,activity_type,chapter_range,question_index' });

  if (error) throw error;
};

export const getActivityAnswersFrom4p = async (
  userId: string,
  activityType: string,
  chapterRange: string
): Promise<{ question_index: string; answer: string }[]> => {
  const { data, error } = await supabase
    .from('4p_answers')
    .select('question_index, answer')
    .eq('user_id', userId)
    .eq('activity_type', activityType)
    .eq('chapter_range', chapterRange);

  if (error) throw error;
  return data || [];
};

export const getActivityAnswers = async (
  userId: string,
  activityId: string
): Promise<ActivityAnswer[]> => {
  const { data, error } = await supabase
    .from('activity_answers')
    .select('activity_id, question_index, answer, is_correct')
    .eq('user_id', userId)
    .eq('activity_id', activityId)
    .order('question_index');

  if (error) throw error;
  return data || [];
};

export const getAllActivityAnswers = async (userId: string): Promise<ActivityAnswer[]> => {
  const { data, error } = await supabase
    .from('activity_answers')
    .select('activity_id, question_index, answer, is_correct')
    .eq('user_id', userId)
    .order('activity_id')
    .order('question_index');

  if (error) throw error;
  return data || [];
};

export const joinClass = async (userId: string, inviteCode: string): Promise<void> => {
  const { data: classData, error: classError } = await supabase
    .from('classes')
    .select('id')
    .eq('invite_code', inviteCode)
    .single();

  if (classError || !classData) {
    throw new Error('Invalid invite code');
  }

  const { error } = await supabase.from('class_enrollments').insert({
    class_id: classData.id,
    student_id: userId,
  });

  if (error) throw error;
};

export const getUserClasses = async (userId: string) => {
  const { data, error } = await supabase
    .from('class_enrollments')
    .select(
      `
      class_id,
      classes!inner(
        id,
        name,
        invite_code,
        description,
        teacher_id,
        created_at
      )
    `
    )
    .eq('student_id', userId);

  if (error) throw error;
  return data || [];
};

export const getTeacherClasses = async (teacherId: string) => {
  const { data, error } = await supabase
    .from('classes')
    .select('id, name, invite_code, description, created_at')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createClass = async (
  teacherId: string,
  name: string,
  description?: string
): Promise<string> => {
  const inviteCode = generateInviteCode();

  const { data, error } = await supabase
    .from('classes')
    .insert({
      teacher_id: teacherId,
      name: name,
      invite_code: inviteCode,
      description: description,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
};

export const getClassStudents = async (classId: string) => {
  const { data, error } = await supabase
    .from('class_enrollments')
    .select(
      `
      student_id,
      enrolled_at,
      profiles!inner(
        name,
        grade,
        section,
        role
      )
    `
    )
    .eq('class_id', classId);

  if (error) throw error;
  return data || [];
};

const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const createProfile = async (
  userId: string,
  name: string,
  role: 'student' | 'teacher' = 'student',
  grade?: string,
  section?: string
): Promise<void> => {
  const { error } = await supabase.from('profiles').insert({
    id: userId,
    name,
    role,
    grade: grade || null,
    section: section || null,
  });

  if (error) throw error;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

  if (error) throw error;
  return data;
};

export const updateProfile = async (
  userId: string,
  updates: {
    name?: string;
    grade?: string;
    section?: string;
    avatar_url?: string;
  }
): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) throw error;
};
