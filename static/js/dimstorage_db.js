radios = document.querySelectorAll('input[name="category"]');

document.addEventListener('DOMContentLoaded', () => {
    const cookies = document.cookie.replace(/; /g, '&');
    const params = new URLSearchParams(cookies);
    const uid = params.get('UID');

    const element_uid = document.getElementById('uid');

    element_uid.value = uid;
});

const inputField = document.getElementById('frequency');

inputField.addEventListener('input', function() {
   this.value = this.value.replace(/[^0-9]/g, '');
});

async function addEntry() {
    const selectedRadio = document.querySelector('input[name="category"]:checked');
    let category;

    const content = document.getElementById('content_text').value;
    const uid = document.getElementById('uid').value;
    const freq = +document.getElementById('frequency').value;

    /*
    if (!selectedRadio || !content || !uid) {
        alert('Wrong');
        return;
    }
    */

    const block = selectedRadio.value
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    let type;

    if (freq <= 100) {
        type = "Import";
    } else if (freq <= 300) {
        type = "Export";
    } else if (freq <= 400) {
        type = "Transfer";
    } else if (freq <= 500) {
        type = "ME2_Request";
    }

    try {
        const response = await fetch (`/databank/add/${uid}/dimensional_storage/${block}/${type}/${freq}/${content}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();

        if (response.ok) {
            alert(`Success: ${result.status}`);
        } else {
            alert("Error: Could not add entry.");
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Network Error. Is the Server running?");
    }
}

async function deleteEntry(table_name, id, elementToRemove) {
    if (!confirm("Are you sure you want to delete this?")) return;

    try {
        let response = await fetch(`/databank/delete/${table_name}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            elementToRemove.remove();
        } else {
            alert("Failed to delete from database.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while deleting.");
    }
}

const uiImages = {
    "1192020514603": "/static/images/tatakei.png"
};

async function fetchDB(table_name, block, type) {
    try {
        let response = await fetch(`/databank/dims/get/${table_name}/${block}/${type}`);
        if (response.ok) {
            let json = await response.json();

            const container = document.getElementById('grid-card-container');

            container.style.display = 'grid';
            container.style.gridTemplateColumns = 'repeat(3, 1fr)';
            container.style.gap = '25px';
            container.style.padding = '20px';
            container.style.width = '100%';

            const gridContainer = document.getElementById('grid-container');

            const line = document.createElement('div')
            line.innerHTML = `<label>${block}</label>`

            container.appendChild(line);

            json.forEach((item) => {
                let wrapper = document.createElement('div');

                const profileImg = uiImages[item.uid] || "";
                let color = "";
                const typeUpper = (item.type || "").toUpperCase();

                if (typeUpper === "IMPORT") color = "#00d692";
                else if (typeUpper === "EXPORT") color = "#fc0400";
                else if (typeUpper === "TRANSFER") color = "#688cf7";
                else if (typeUpper === "ME2_REQUEST") color = "#559dfb";
                else color = "#ffffff";

                const displayContent = item.label || item.content || "---";

                wrapper.innerHTML = `
    <div style="
    background: #0f0f12;
    border: 1px solid #222;
    border-top: 4px solid ${color};
    border-radius: 12px;
    padding: 24px;
    height: 280px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
">
    <!-- Background Glow Effect -->
    <div style="position: absolute; top: -50px; left: -50px; width: 100px; height: 100px; background: ${color}; filter: blur(80px); opacity: 0.15; pointer-events: none;"></div>

    <!-- Header: Type and Freq -->
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="background: ${color}22; color: ${color}; font-size: 0.75rem; font-weight: 800; padding: 4px 12px; border-radius: 4px; border: 1px solid ${color}44; text-transform: uppercase; letter-spacing: 1px;">
            ${typeUpper}
        </span>
        <span style="color: #444; font-family: monospace; font-size: 0.9rem; font-weight: bold;">
            ${item.frequency || '000'}
        </span>
    </div>

    <!-- Main Content: Auto-scaling font -->
    <div style="
        flex-grow: 1; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        padding: 10px 0;
        overflow: hidden;
    ">
        <h2 style="
            color: #e0e0e0;
            text-align: center;
            margin: 0;
            font-weight: 600;
            line-height: 1.2;
            /* We use 'vw' or 'em' mixed with a percentage to force shrinking as lines wrap */
            font-size: calc(1.1rem + 0.5vw); 
            /* Fallback for extremely long text */
            max-height: 140px; 
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 5;
            -webkit-box-orient: vertical;
            word-break: break-word;
        ">
            ${displayContent}
        </h2>
    </div>

    <!-- Footer: User and Actions -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #222; padding-top: 15px;">
        <div style="display: flex; gap: 15px;">
            <button class="edit-btn" style="background: none; border: none; color: #888; cursor: pointer; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; padding: 0; transition: color 0.2s;">
                Edit
            </button>
            <button class="delete-btn" style="background: none; border: none; color: #555; cursor: pointer; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; padding: 0; transition: color 0.2s;">
                Delete
            </button>
        </div>
        <img src="${profileImg}" style="width: 42px; height: 42px; border-radius: 50%; border: 2px solid #222; object-fit: cover; background: #222;">
    </div>
</div>
    `;

                const delBtn = wrapper.querySelector('.delete-btn');
                delBtn.onmouseover = () => delBtn.style.color = '#ff4444';
                delBtn.onmouseout = () => delBtn.style.color = '#555';
                delBtn.onclick = () => wrapper.remove();

                container.appendChild(wrapper);
            });
        } else {
            alert("HTTP ERROR: " + response.status);
        }
    } catch (error) {
        alert("Fetch Error: " + error);
    }
}

fetchDB('dimensional_storage', 'Dimensional Fluid Tank', 'Import')