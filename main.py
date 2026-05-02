from flask import Flask, jsonify, render_template, redirect, url_for, request, make_response, flash, session
from routes.notes_logic import notes_bp
from routes.db_logic import databank_bp
from routes.dimstorage_logic import dimstorage_bp
from werkzeug.security import check_password_hash, generate_password_hash
import helpers.sqlite3 as db

app = Flask(__name__)
app.secret_key = 'N%WtHRhmW93l0wWhg$JzPN&lj!^TZve^yDmlCLD8y40kGLcb%sGKq8t8SsD1xTT#XmH$4Kpap4LlQAC*!q3XYUJlmwL91Y!8E5^RFfXM*sOksWVgB$Qob5o72Zc30Jj#'

USERS = {
    "kitten@benschi": {
        "name": "Kitten<3",
        "pw_hash": generate_password_hash('7@4r*vvla@B1dfZ2FXs&lEJuWk9N7C0q')
    },
    "pookie@benschi": {
        "name": "Pookie<3",
        "pw_hash": generate_password_hash('VC@$E3gMY$9YEvprr#y8ix78uXB1Qp^&')
    }
}

db.Initialize()

app.register_blueprint(notes_bp, url_prefix='/notes')
app.register_blueprint(dimstorage_bp, url_prefix='/dimstorage')
app.register_blueprint(databank_bp, url_prefix='/databank')

#     return render_template('html', data=data, todos=todos, foods=foods, cat_counts=cat_counts)

@app.before_request
def global_auth_check():
    guest_routes = ['login', 'static']

    if request.endpoint in guest_routes:
        return None

    if 'user_email' not in session:
        return redirect(url_for('login'))
    return None

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_email' in session:
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        email = request.form.get('email').lower().strip()
        password = request.form.get('password')

        user_data = USERS.get(email)

        if user_data and check_password_hash(user_data['pw_hash'], password):
            session['user_email'] = email
            session['user_name'] = user_data['name']

            return redirect(url_for('dashboard'))

        flash('Invalid User, Email or Password.', 'danger')

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user_email', None)
    session.pop('user_name', None)

    return redirect(url_for('login'))

@app.route('/dashboard')
def dashboard():
    if 'user_email' not in session:
        return redirect(url_for('login'))

    return render_template('dashboard.html')

if __name__ == '__main__':
    app.run(debug=True)