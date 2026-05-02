from flask import Blueprint, request, redirect, url_for, render_template

dimstorage_bp = Blueprint('dimstorage', __name__)

@dimstorage_bp.route('/')
def dimstorage():
    return render_template('dimstorage.html')