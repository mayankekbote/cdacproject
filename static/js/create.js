document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("noteForm");
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // ✅ Correctly get values from input fields
        const title = document.getElementById("noteTitle").value.trim();
        const content = document.getElementById("noteContent").value.trim();

        if (!title || !content) {
            alert("Please fill in both title and content.");
            return;
        }

        fetch('/save_note', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Note saved successfully!");
                window.location.href = "/";
            }
        })
        .catch(err => {
            console.error("Fetch error:", err);
            alert("Error saving note.");
        });
    });
});