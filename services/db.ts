import * as SQLite from 'expo-sqlite';

const DB_NAME = 'hilisibu.db';

// SINGLETON: Store the database instance here so we don't open it repeatedly
let dbInstance: SQLite.SQLiteDatabase | null = null;

// --- DATABASE CONNECTION ---
export const getDB = async () => {
  if (dbInstance) {
    return dbInstance;
  }
  // Open and cache the connection
  dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
  return dbInstance;
};

const DB_VERSION = 3;

// --- INITIALIZATION ---
export const initDatabase = async () => {
  try {
    const db = await getDB();

    // Get current DB version
    const [{ user_version: currentVersion }] = await db.getAllAsync('PRAGMA user_version');

    if (currentVersion < DB_VERSION) {
      console.log(`Upgrading database from version ${currentVersion} to ${DB_VERSION}...`);
      // Drop old tables if they exist
      await db.execAsync(`
        DROP TABLE IF EXISTS activity_answers;
        DROP TABLE IF EXISTS scores;
        DROP TABLE IF EXISTS talasalitaan_answers;
      `);
      console.log('Old tables dropped.');
    }

    // Create Users Table
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        grade TEXT NOT NULL,
        section TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Progress Table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS chapter_progress (
        chapter_id INTEGER PRIMARY KEY,
        is_read INTEGER DEFAULT 0
      );
    `);

    // Create ActivityAnswers Table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS activity_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        activity_id TEXT NOT NULL,
        question_index INTEGER NOT NULL,
        selected_answer TEXT NOT NULL,
        is_correct INTEGER NOT NULL,
        UNIQUE(activity_id, question_index)
      );
    `);

    // Create Scores Table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        activity_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, activity_id)
      );
    `);

    // Create TalasalitaanAnswers Table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS talasalitaan_answers (
        chapter_id INTEGER NOT NULL,
        quiz_type TEXT NOT NULL,
        answers TEXT NOT NULL,
        PRIMARY KEY (chapter_id, quiz_type)
      );
    `);

    if (currentVersion < DB_VERSION) {
      await db.execAsync(`PRAGMA user_version = ${DB_VERSION}`);
      console.log('Database upgrade complete.');
    }

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

// --- TALASALITAAN ---

export const saveTalasalitaanAnswers = async (
  chapterId: number,
  quizType: string,
  answers: any
) => {
  try {
    const db = await getDB();
    const answersJSON = JSON.stringify(answers);
    await db.runAsync(
      'INSERT OR REPLACE INTO talasalitaan_answers (chapter_id, quiz_type, answers) VALUES (?, ?, ?)',
      chapterId,
      quizType,
      answersJSON
    );
    console.log(`Talasalitaan answers for Chapter ${chapterId} (${quizType}) saved.`);
  } catch (error) {
    console.error('Error saving talasalitaan answers:', error);
  }
};

export const getTalasalitaanAnswers = async (chapterId: number, quizType: string) => {
  try {
    const db = await getDB();
    const result = await db.getFirstAsync<{ answers: string }>(
      'SELECT answers FROM talasalitaan_answers WHERE chapter_id = ? AND quiz_type = ?',
      chapterId,
      quizType
    );
    if (result) {
      return JSON.parse(result.answers);
    }
    return null;
  } catch (error) {
    console.error('Error getting talasalitaan answers:', error);
    return null;
  }
};

export const getAllTalasalitaanAnswers = async () => {
  try {
    const db = await getDB();
    const results = await db.getAllAsync<{
      chapter_id: number;
      quiz_type: string;
      answers: string;
    }>('SELECT chapter_id, quiz_type, answers FROM talasalitaan_answers');
    return results.map((row) => ({
      ...row,
      answers: JSON.parse(row.answers),
    }));
  } catch (error) {
    console.error('Error getting all talasalitaan answers:', error);
    return [];
  }
};

// --- ACTIVITY & SCORE FUNCTIONS ---

export const saveAnswer = async (
  activityId: string,
  questionIndex: number,
  selectedAnswer: string,
  isCorrect: boolean
) => {
  try {
    if (!activityId || typeof questionIndex !== 'number' || !selectedAnswer) {
      console.error('Invalid input for saveAnswer:', { activityId, questionIndex, selectedAnswer });
      return;
    }
    const db = await getDB();
    await db.runAsync(
      `INSERT OR REPLACE INTO activity_answers (activity_id, question_index, selected_answer, is_correct)
       VALUES (?, ?, ?, ?)`,
      activityId,
      questionIndex,
      selectedAnswer,
      isCorrect ? 1 : 0
    );
  } catch (error) {
    console.error('Error saving answer:', error);
  }
};

export const saveScore = async (userId: number, activityId: string, score: number) => {
  try {
    const db = await getDB();
    await db.runAsync(
      'INSERT OR REPLACE INTO scores (user_id, activity_id, score) VALUES (?, ?, ?)',
      userId,
      activityId,
      score
    );
    console.log(`Score for activity ${activityId} saved for user ${userId}.`);
  } catch (error) {
    console.error('Error saving score:', error);
  }
};

// --- USER FUNCTIONS ---

export const saveUser = async (name: string, grade: string, section: string) => {
  const db = await getDB();
  const result = await db.runAsync(
    'INSERT INTO users (name, grade, section) VALUES (?, ?, ?)',
    name,
    grade,
    section
  );
  return result.lastInsertRowId;
};

export const getUser = async () => {
  const db = await getDB();
  const firstUser = await db.getFirstAsync<{
    id: number;
    name: string;
    grade: string;
    section: string;
  }>('SELECT * FROM users LIMIT 1');
  return firstUser;
};

export const clearAllData = async () => {
  const db = await getDB();
  await db.runAsync('DELETE FROM users');
  await db.runAsync('DELETE FROM activity_answers');
  await db.runAsync('DELETE FROM scores');
  await db.runAsync('DELETE FROM chapter_progress');
  console.log('All user data has been cleared.');
};

// --- PROGRESS & ANSWER FUNCTIONS ---

export const getAllAnswers = async () => {
  const db = await getDB();
  return await db.getAllAsync<{
    activity_id: string;
    question_index: number;
    selected_answer: string;
  }>('SELECT activity_id, question_index, selected_answer FROM activity_answers');
};

export const getAnswers = async (activityId: string) => {
  const db = await getDB();
  return await db.getAllAsync<{ question_index: number; selected_answer: string }>(
    'SELECT question_index, selected_answer FROM activity_answers WHERE activity_id = ?',
    activityId
  );
};

// --- PROGRESS FUNCTIONS ---

// 1. Mark a chapter as read
export const markChapterAsRead = async (chapterId: number) => {
  try {
    console.log(`[db] Attempting to mark Chapter ${chapterId} as read.`);
    if (typeof chapterId !== 'number' || !Number.isInteger(chapterId)) {
      console.error('[db] Invalid chapterId provided:', chapterId);
      return;
    }
    const db = await getDB();
    await db.runAsync(
      'INSERT OR REPLACE INTO chapter_progress (chapter_id, is_read) VALUES (?, 1)',
      chapterId
    );
    console.log(`Chapter ${chapterId} marked as read successfully.`);
  } catch (error) {
    console.error('Error marking chapter read:', error);
  }
};

// 2. Check if specific chapters are read
export const areChaptersRead = async (chapterIds: number[]): Promise<boolean> => {
  // If no chapters to check, consider it "unlocked"
  if (!chapterIds || chapterIds.length === 0) return true;

  try {
    const db = await getDB();
    const placeholders = chapterIds.map(() => '?').join(',');
    const result = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM chapter_progress WHERE is_read = 1 AND chapter_id IN (${placeholders})`,
      ...chapterIds
    );

    const count = result?.count ?? 0;

    return count === chapterIds.length;
  } catch (error) {
    console.error('Error checking chapters:', error);
    // In case of error, return false (locked) to be safe
    return false;
  }
};
