document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/notes')
        .then(res => res.json())
        .then(notes => {
            const container = document.getElementById('notesContainer');
            if (!notes.length) {
                container.innerHTML = "<p>No notes found.</p>";
                return;
            }

            notes.forEach(note => {
                const card = document.createElement('div');
                card.className = 'note-card';
                card.innerHTML = `
                    <h3>${note.title}</h3>
                    <button id ="view"onclick="viewNote(${note.id}, '${note.title.replace(/'/g, "\\'")}', '${note.content.replace(/'/g, "\\'")}')">View</button>
                `;
                container.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Error fetching notes:", err);
            document.getElementById('notesContainer').innerHTML =
                "<p>Error loading notes.</p>";
        });
});

function viewNote(id, title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalContent').textContent = content;
    document.getElementById('noteModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('noteModal').style.display = 'none';
}