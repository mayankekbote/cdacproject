console.log("Script loaded");

document.addEventListener("DOMContentLoaded", function () {
    console.log("Page loaded");

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
                    <p>${note.content}</p>
                    <button id= "delete" onclick="deleteNote(${note.id})">Delete</button>
                `;
                container.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Fetch error:", err);
            document.getElementById('notesContainer').innerHTML =
                "<p>Error loading notes.</p>";
        });
});

function deleteNote(id) {
    if (!confirm("Delete this note?")) return;

    fetch(`/delete_note/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Note deleted!");
            location.reload();
        } else {
            alert("Failed to delete note.");
        }
    })
    .catch(err => {
        console.error("Error deleting note:", err);
        alert("An error occurred.");
    });
}