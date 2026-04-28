from flask import Blueprint, request, redirect, url_for, render_template
import helpers.sqlite3 as db

databank_bp = Blueprint('databank', __name__)

@databank_bp.route('/')
def databank():
    return render_template('db_test.html')

@databank_bp.route('/test')
def databank_test():
    db.NotesEntry(123, 'test_category', 'test_content')
    return {"status": "Added."}

# /databank/get/${uid}/notes/${category}/${content}

@databank_bp.route('/add/<int:uid>/<table_name>/<category>/<content>', methods=['POST'])
def databank_add(uid, table_name, category, content):
    success = db.addEntry(uid=uid, table_name=table_name, category=category, content=content)
    if success:
        return {
            "status": "Successfully added.",
            "message": f"Entry added by {uid} to {table_name} with Content: '{content}'"
        }, 200
    else:
        return {
            "status": "error",
            "message": f"Could not add Item to {table_name} with Content: '{content}' by {uid}."
        }, 404

@databank_bp.route('/remove/<table_name>/<int:entry_id>', methods=['DELETE'])
def databank_remove(table_name, entry_id):
    success = db.deleteEntry(table_name=table_name, entry_id=entry_id)
    if success:
        return {
            "status": "success",
            "message": f"Entry {entry_id} removed from {table_name}."
        }, 200
    else:
        return {
            "status": "error",
            "message": f"Could not find ID {entry_id} in {table_name}, or table is invalid."
        }, 404

@databank_bp.route('/get')
def databank_get():
    results = db.grabEntriesByCategory('notes', 'test_category')
    content = [row['content'] for row in results]
    return content