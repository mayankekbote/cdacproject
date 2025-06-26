let currentId = null;

function loadNoteById() {
    const id = parseInt(document.getElementById('noteId').value);
    if (!id) return alert("Please enter a valid ID.");

    fetch(`/api/notes/${id}`)
        .then(res => res.json())
        .then(note => {
            if (!note || note.error) {
                alert("Note not found!");
                return;
            }
            document.getElementById('editContent').value = note.content;
            document.getElementById('editForm').style.display = 'block';
            currentId = note.id;
        })
        .catch(err => {
            console.error("Error fetching note:", err);
            alert("Failed to load note.");
        });
}

function loadNoteByTitle() {
    const title = document.getElementById('noteTitle').value.trim();
    if (!title) return alert("Please enter a title.");

    fetch(`/api/notes/title/${encodeURIComponent(title)}`)
        .then(res => res.json())
        .then(notes => {
            if (!notes.length) {
                alert("No notes found with that title.");
                return;
            }

            // If multiple notes with same title, pick first
            const note = notes[0];
            document.getElementById('editContent').value = note.content;
            document.getElementById('editForm').style.display = 'block';
            currentId = note.id;
        })
        .catch(err => {
            console.error("Error fetching note:", err);
            alert("Failed to load note.");
        });
}

document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const content = document.getElementById('editContent').value;

    fetch(`/api/notes/${currentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('status').textContent = data.message;
    })
    .catch(err => {
        console.error("Error updating note:", err);
        document.getElementById('status').textContent = "An error occurred while updating.";
    });
});