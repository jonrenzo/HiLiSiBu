import * as SQLite from 'expo-sqlite';

const DB_NAME = 'hilisibu.db';

export const getDB = async () => {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    return db;
};

export const initDatabase = async () => {
    const db = await getDB();
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
};

export const saveUser = async (name: string, grade: string, section: string) => {
    const db = await getDB();
    // Optional: Delete existing users to strictly ensure only 1 row exists
    // await db.runAsync('DELETE FROM users');

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
    // Get the first user found
    const firstUser = await db.getFirstAsync<{ name: string; grade: string; section: string }>('SELECT * FROM users LIMIT 1');
    return firstUser;
};

export const clearUser = async () => {
    const db = await getDB();
    await db.runAsync('DELETE FROM users'); // Deletes all rows
};
