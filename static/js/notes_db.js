radios = document.querySelectorAll('input[name="notes-category"]');

const glossar_word = document.getElementById('glossar_word');
const glossar_explanation = document.getElementById('glossar_explanation');
const glossar_wor_text = document.getElementById('glossar_word_text');
const glossar_exp_text = document.getElementById('glossar_explanation_text');

glossar_word.style.display = 'none';
glossar_explanation.style.display = 'none';
glossar_wor_text.style.display = 'none';
glossar_exp_text.style.display = 'none';

document.addEventListener('DOMContentLoaded', () => {
    const cookies = document.cookie.replace(/; /g, '&');
    const params = new URLSearchParams(cookies);
    const uid = params.get('UID');

    const notes_uid = document.getElementById('notes_uid');

    notes_uid.value = uid;
});

radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        const val = e.target.value;
        const content = document.getElementById('notes_content');
        const content_text = document.getElementById('content_text');

        if (val != 'notes-category-opt-4') {
            content.style.display = 'block';
            content_text.style.display = 'block';
            glossar_word.style.display = 'none';
            glossar_explanation.style.display = 'none';
            glossar_wor_text.style.display = 'none';
            glossar_exp_text.style.display = 'none';
        }

        if (val == 'notes-category-opt-4') {
            content.style.display = 'none';
            content_text.style.display = 'none';
            glossar_word.style.display = 'block';
            glossar_explanation.style.display = 'block';
            glossar_wor_text.style.display = 'block';
            glossar_exp_text.style.display = 'block';
        }
    })
})

async function updateDB() {
    const selectedRadio = document.querySelector('input[name="notes-category"]:checked');
    let category;

    const content = document.getElementById('notes_content').value;
    const uid = document.getElementById('notes_uid').value;

    const glossar_word = document.getElementById('glossar_word').value;
    const glossar_explanation = document.getElementById('glossar_explanation').value;

    if (!selectedRadio || !content || !uid) { alert('Wrong'); return; }

    if (selectedRadio.value == 'notes-category-opt-4') {
        try {
            const response = await fetch (`/databank/add/${uid}/glossar/${glossar_word}/${glossar_explanation}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok) {
                document.getElementById('glossar_word').value = "";
                document.getElementById('glossar_explanation').value = "";
            } else {
                alert("Error adding Glossar");
            }
        } catch (error) {
            console.error("Network Error:", error);
            alert("Network Error. Is the Server running?");
        }
    }

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

async function fetchDB(table_name, category) {
    try {
        let response = await fetch(`/databank/get/${table_name}/${category}`);
        if (response.ok) {
            let json = await response.json();

            let line_text = document.createElement('div');
            let line = document.createElement('div');
            let title = document.createElement('div');
            let info_container = document.createElement('div');

            const cont_hero = document.getElementById('hero');

            line_text.innerHTML = `<br><br>${category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}`
            line_text.style.fontSize = '1.8rem';
            line_text.style.color = "#00ffff";
            line_text.style.textShadow = "0 0 20px #00ffff";

            line.style.width = '100%';
            line.style.height = '2px';
            line.style.background = 'linear-gradient(135deg, #fc91f7 0%, #8d013b 100%)';

            title.id = "title";

            info_container.id = 'info-container';
            info_container.className = 'info-container';
            info_container.style.display = 'flex';
            info_container.style.flexWrap = 'wrap';
            info_container.style.gap = '20px';
            info_container.style.justifyContent = 'center';
            info_container.style.padding = '20px';

            cont_hero.appendChild(line_text);
            cont_hero.appendChild(line);
            cont_hero.appendChild(title);
            cont_hero.appendChild(info_container);

            const uiImages = {
                "123": "/static/images/benschi.png"
            };

            json.forEach((item) => {
                let wrapper = document.createElement('div');
                wrapper.className = 'contact-container';
                wrapper.style.width = '360px';

                const profileImg = uiImages[item.uid] || "";

                wrapper.innerHTML = `
                <div class="contact-form-wrapper">
                    <div class="contact-form">
                        <div class="form-group" style="display: flex; flex-direction: column; min-height: 200px; box-sizing: border-box; color: white;">
                            <div style="align-self: flex-start; font-size: 0.8rem; font-weight: bold; opacity: 0.6; color: #00ffff; text-shadow: 0 0 20px #00ffff;">
                                ${item.id}, ${item.category}
                            </div>
                            <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center; text-align: center; padding: 15px 0;">
                                <span style="font-size: 1.2rem; color: #00ffff; text-shadow: 0 0 20px #00ffff;">${item.content}</span>
                            </div>
                            <div style="align-self: flex-end; display: flex; align-items: center; gap: 12px; margin-top: auto;">
                                <button class="delete-btn">Delete</button>
                                <img src="${profileImg}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid white; background-color: #444;">
                            </div>
                        </div>
                    </div>
                </div>
               `;

                const delBtn = wrapper.querySelector('.delete-btn');

                delBtn.addEventListener('click', () => {
                    deleteEntry(table_name, item.id, wrapper);
                });

                info_container.appendChild(wrapper);
            });
        } else {
            alert("HTTP ERROR: " + response.status);
        }
    } catch (error) {
        alert("Fetch Error: " + error);
    }
}

fetchDB('notes', 'NOTIZ')
fetchDB('notes', 'TODO')
fetchDB('notes', 'VORSCHLAG')