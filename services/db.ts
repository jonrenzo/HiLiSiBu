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

// --- INITIALIZATION ---
export const initDatabase = async () => {
  try {
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

    // Create Progress Table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS chapter_progress (
        chapter_id INTEGER PRIMARY KEY,
        is_read INTEGER DEFAULT 0
      );
    `);

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Database initialization failed:', error);
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
  const firstUser = await db.getFirstAsync<{ name: string; grade: string; section: string }>(
    'SELECT * FROM users LIMIT 1'
  );
  return firstUser;
};

export const clearUser = async () => {
  const db = await getDB();
  await db.runAsync('DELETE FROM users');
  await db.runAsync('DELETE FROM chapter_progress'); // Clear progress too
};

// --- PROGRESS FUNCTIONS ---

// 1. Mark a chapter as read
export const markChapterAsRead = async (chapterId: number) => {
  try {
    const db = await getDB();
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
  // If no chapters to check, consider it "unlocked"
  if (!chapterIds || chapterIds.length === 0) return true;

  try {
    const db = await getDB();
    const idsString = chapterIds.join(',');

    // Use getFirstAsync to safely retrieve the count
    const result = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM chapter_progress WHERE is_read = 1 AND chapter_id IN (${idsString})`
    );

    // If result is null, something went wrong, treat as 0
    const count = result?.count ?? 0;

    return count === chapterIds.length;
  } catch (error) {
    console.error('Error checking chapters:', error);
    // In case of error, return false (locked) to be safe, or true to allow access if you prefer
    return false;
  }
};
