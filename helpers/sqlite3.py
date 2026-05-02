import sqlite3

dbs3 = "benschi.db"

ALLOWED_TABLES = ['notes', 'dimensional_storage']
ALLOWED_CATEGORIES = ['NOTIZ', 'TODO', 'VORSCHLAG', 'GLOSSAR']
ALLOWED_BLOCKS = ['Dimensional Fluid Tank', 'Dimensional Chest']
ALLOWED_TYPES = ['Import', 'Export', 'Transfer', 'ME2_Request']

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
        if table_name not in ALLOWED_TABLES: return False
        if category not in ALLOWED_CATEGORIES: return False

        with sqlite3.connect(dbs3) as conn:
            cursor = conn.cursor()
            query = f"INSERT INTO {table_name} (uid, category, content) VALUES (?, ?, ?)"
            cursor.execute(query, (uid, category, content))
            conn.commit()
            return True
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return False

def addEntryDimStorage(uid, table_name, block, type, frequency, label):
    try:
        ALLOWED_BLOCKS = ['dimensional_fluid_tank', 'dimensional_chest']

        if table_name not in ALLOWED_TABLES: return False
        if block not in ALLOWED_BLOCKS: return False

        with sqlite3.connect(dbs3) as conn:
            cursor = conn.cursor()
            query = f"INSERT INTO {table_name} (uid, table_name, block, type, frequency, label) VALUES (?, ?, ?, ?, ?, ?)"
            cursor.execute(query, (uid, table_name, block, type, frequency, label))
            conn.commit()
            return True
    except sqlite3.Error as e:
        print(f"Database Error: {e}")
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

def getEntry(table_name, category):
    try:
        if table_name not in ALLOWED_TABLES: return False
        if category not in ALLOWED_CATEGORIES: return False

        with sqlite3.connect(dbs3) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()

            query = f"SELECT * FROM {table_name} WHERE category = ?"

            cursor.execute(query, (category,))
            rows = cursor.fetchall()

            results = [dict(row) for row in rows]

            return results

    except sqlite3.Error as e:
        print(f"Database Error: {e}")
        return []

def getEntryDimStorage(table_name, block, type):
    try:
        if table_name not in ALLOWED_TABLES: return False
        if block not in ALLOWED_BLOCKS: return False
        if type not in ALLOWED_TYPES: return False

        with sqlite3.connect(dbs3) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()

            query = f"SELECT * FROM {table_name} WHERE block = ? AND type = ?"

            cursor.execute(query, (block, type))

            rows = cursor.fetchall()
            results = [dict(row) for row in rows]

            return results

    except sqlite3.Error as e:
        print(f"Database Error: {e}")
        return []