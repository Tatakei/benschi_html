from flask import Blueprint, request, redirect, url_for, render_template, jsonify
import helpers.sqlite3 as db

databank_bp = Blueprint('databank', __name__)

@databank_bp.route('/')
def databank():
    return render_template('dashboard.html')

# /databank/get/${uid}/notes/${category}/${content}
# localhost:5000/databank/add/123/notes/NOTIZ/ABCDEF

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

@databank_bp.route('/add/<int:uid>/<table_name>/<block>/<type>/<frequency>/<label>', methods=['POST'])
def db_add_frequency(uid, table_name, block, type, frequency, label):
    success = db.addEntryDimStorage(uid=uid, table_name=table_name, block=block, type=type, frequency=frequency, label=label)
    if success:
        return {
            "status": "Successfully added.",
            "message": f"Entry added by {uid} to {table_name}. {block} | {type} | {frequency} | {label}"
        }, 200
    else:
        return {
            "status": "Error",
            "message": f"User {uid} failed adding {table_name}. {block} | {type} | {frequency} | {label}"
        }, 404

@databank_bp.route('/delete/<table_name>/<int:entry_id>', methods=['DELETE'])
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

@databank_bp.route('/get/<table_name>/<category>')
def databank_get(table_name, category):
    results = db.getEntry(table_name=table_name, category=category)
    if results is None:
        return jsonify([])

    return jsonify(results)

@databank_bp.route('/dims/get/<table_name>/<block>/<type>')
def db_dims_get(table_name, block, type):
    results = db.getEntryDimStorage(table_name=table_name, block=block, type=type)
    if results is None:
        return jsonify([])

    return jsonify(results)