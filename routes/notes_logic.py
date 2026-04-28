from flask import Blueprint, request, redirect, url_for, render_template

notes_bp = Blueprint('notes', __name__)

@notes_bp.route('/dashboard')
def nbp_dashboard():
    return render_template('notes.html')