async function deleteFromDB() {
    const tableName = document.getElementById('db_table_name').value;
    const entryId = document.getElementById('db_id').value;

    if (!tableName || !entryId) { alert('Falsch'); return; }

    try {
        const response = await fetch(`/databank/remove/${tableName}/${entryId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Success: ${result.status}`);
            document.getElementById('db_id').value = "";
        } else {
            alert("Error: Could not remove entry.");
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Network error. Is the server running?");
    }
}