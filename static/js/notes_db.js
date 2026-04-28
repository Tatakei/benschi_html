async function updateDB() {
    const selectedRadio = document.querySelector('input[name="notes-category"]:checked');
    let category;

    const content = document.getElementById('notes_content').value;
    const uid = document.getElementById('notes_uid').value;

    if (!selectedRadio || !content || !uid) { alert('Wrong'); return; }

    switch (selectedRadio.value) {
        case "notes-category-opt-1":
            category = "NOTIZ";
            break;
        case "notes-category-opt-2":
            category = "TODO";
            break;
        case "notes-category-opt-3":
            category = "VORSCHLAG";
            break;
        case "notes-category-opt-4":
            category = "GLOSSAR";
            break;
        default:
            category = "NOTIZ";
    }

    try {
        const response = await fetch(`/databank/add/${uid}/notes/${category}/${content}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Success: ${result.status}`);
            document.getElementById('notes_content').value = "";
        } else {
            alert("Error: Could not add entry.");
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Network Error. Is the Server running?");
    }
}