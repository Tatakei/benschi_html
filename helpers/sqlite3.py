import sqlite3

dbs3 = "benschi.db"

ALLOWED_TABLES = ['notes']

def Initialize():
    with sqlite3.connect(dbs3) as conn:
        cursor = conn.cursor()
        cursor.execute('''
                       CREATE TABLE IF NOT EXISTS notes (
                                                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                            uid INTEGER,
                                                            category TEXT NOT NULL,
                                                            content TEXT NOT NULL
                       )
                       ''')

def addEntry(uid, table_name, category, content):
    try:
        if table_name not in ALLOWED_TABLES:
            return False

        with sqlite3.connect(dbs3) as conn:
            cursor = conn.cursor()
            query = f"INSERT INTO {table_name} (uid, category, content) VALUES (?, ?, ?)"
            cursor.execute(query, (uid, category, content))
            conn.commit()
            return True
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return False

def deleteEntry(table_name, entry_id):
    try:
        if table_name not in ALLOWED_TABLES:
            return False

        with sqlite3.connect(dbs3) as conn:
            cursor = conn.cursor()

            query = f"DELETE FROM {table_name} WHERE id = ?"

            cursor.execute(query, (entry_id,))
            conn.commit()

            if conn.total_changes > 0:
                print(f"ID {entry_id} deleted successfully.")
                return True
            else:
                print("No record found with that ID.")
                return False

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return False

def grabEntriesByCategory(table_name, category_value):
    try:
        if table_name not in ALLOWED_TABLES: return False

        with sqlite3.connect('benschi.db') as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()

            query = f"SELECT * FROM {table_name} WHERE category = ?"

            cursor.execute(query, (category_value,))
            rows = cursor.fetchall()

            return [dict(row) for row in rows]

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return []
