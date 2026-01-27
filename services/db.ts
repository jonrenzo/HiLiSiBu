import * as SQLite from 'expo-sqlite';

const DB_NAME = 'hilisibu.db';

// --- DATABASE CONNECTION ---
export const getDB = async () => {
  // Uses the new modern API
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  return db;
};

// --- INITIALIZATION ---
export const initDatabase = async () => {
  const db = await getDB();

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

  // Create Progress Table (Merged here for simplicity)
  await db.execAsync(`
      CREATE TABLE IF NOT EXISTS chapter_progress (
        chapter_id INTEGER PRIMARY KEY,
        is_read INTEGER DEFAULT 0
      );
    `);
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
  const firstUser = await db.getFirstAsync<{ name: string; grade: string; section: string }>(
    'SELECT * FROM users LIMIT 1'
  );
  return firstUser;
};

export const clearUser = async () => {
  const db = await getDB();
  // Delete user data
  await db.runAsync('DELETE FROM users');
  // Delete progress data (Reset locks)
  await db.runAsync('DELETE FROM chapter_progress');
};
// --- PROGRESS FUNCTIONS (Fixed for Modern API) ---

// 1. Mark a chapter as read
export const markChapterAsRead = async (chapterId: number) => {
  const db = await getDB();
  try {
    await db.runAsync(
      'INSERT OR REPLACE INTO chapter_progress (chapter_id, is_read) VALUES (?, 1)',
      chapterId
    );
    console.log(`Chapter ${chapterId} marked as read.`);
  } catch (error) {
    console.error('Error marking chapter read:', error);
  }
};

// 2. Check if specific chapters are read
export const areChaptersRead = async (chapterIds: number[]): Promise<boolean> => {
  if (chapterIds.length === 0) return true;

  const db = await getDB();
  const idsString = chapterIds.join(',');

  try {
    // In the new API, we use getFirstAsync for single row results (like COUNT)
    const result = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM chapter_progress WHERE is_read = 1 AND chapter_id IN (${idsString})`
    );

    // Check if the count of read chapters matches the number of chapters we asked for
    return (result?.count ?? 0) === chapterIds.length;
  } catch (error) {
    console.error('Error checking chapters:', error);
    return false;
  }
};
