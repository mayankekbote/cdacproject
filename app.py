from flask import Flask, render_template, request, jsonify
import mysql.connector

app = Flask(__name__)


def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='soham@305',
        database='notepad_db'
    )


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/create')
def create_note():
    return render_template('create.html')


@app.route('/edit')
def edit_note_page():
    return render_template('edit.html')


@app.route('/delete')
def delete_note_page():
    return render_template('delete.html')


@app.route('/view')
def view_notes_page():
    return render_template('view.html')


@app.route('/save_note', methods=['POST'])
def save_note():
    data = request.get_json()
    title = data['title']
    content = data['content']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO notes (title, content) VALUES (%s, %s)", (title, content))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"success": True})


@app.route('/api/notes', methods=['GET'])
def get_all_notes():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, content FROM notes")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    notes = [{"id": row[0], "title": row[1], "content": row[2]} for row in rows]
    return jsonify(notes)


@app.route('/delete_note/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM notes WHERE id = %s", (note_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"success": True})


@app.route('/api/notes/<int:id>', methods=['GET'])
def get_note(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, content FROM notes WHERE id = %s", (id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if not row:
        return jsonify({"error": "Note not found"}), 404

    note = {"id": row[0], "title": row[1], "content": row[2]}
    return jsonify(note)


@app.route('/api/notes/<int:id>', methods=['PUT'])
def update_note(id):
    data = request.get_json()
    new_content = data.get('content')

    if not new_content:
        return jsonify({"error": "Content is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE notes SET content = %s WHERE id = %s", (new_content, id))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Note updated successfully"})


@app.route('/api/notes/title/<string:title>', methods=['GET'])
def get_notes_by_title(title):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, content FROM notes WHERE title LIKE %s", (f"%{title}%",))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    notes = [{"id": row[0], "title": row[1], "content": row[2]} for row in rows]
    return jsonify(notes)


if __name__ == '__main__':
    app.run(debug=True)