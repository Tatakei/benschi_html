function updateFilters() {
    const checkboxes = document.querySelectorAll('.filter-item input');
    const states = {};
    checkboxes.forEach(cb => {
        const targetName = cb.getAttribute('data-target');
        const section = document.getElementById('section-' + targetName);
        if (section) section.style.display = cb.checked ? 'block' : 'none';
        states[targetName] = cb.checked;
    });
    localStorage.setItem('atm10_filters', JSON.stringify(states));
}

function loadFilters() {
    const saved = localStorage.getItem('atm10_filters');
    if (!saved) {
        document.querySelectorAll('.filter-item input').forEach(cb => {
            cb.checked = true;
            updateFilters();
        });
        return;
    }
    const states = JSON.parse(saved);
    for (const [targetName, isChecked] of Object.entries(states)) {
        const cb = document.querySelector(`input[data-target="${targetName}"]`);
        const section = document.getElementById('section-' + targetName);
        if (cb) cb.checked = isChecked;
        if (section) section.style.display = isChecked ? 'block' : 'none';
    }
}

function openEditModal(id) {
    const modal = document.getElementById('modal-' + id);
    if (modal) modal.showModal();
}

function closeEditModal(id) {
    const modal = document.getElementById('modal-' + id);
    if (modal) modal.close();
}

function openDeleteCatModal(id) {
    const modal = document.getElementById('delete-cat-modal-' + id);
    if (modal) modal.showModal();

    modal.addEventListener('click', (event) => {
            const rect = modal.getBoundingClientRect();

            const isInDialog = (
                    rect.top <= event.clientY &&
                    event.clientY <= rect.top + rect.height &&
                    rect.left <= event.clientX &&
                    event.clientX <= rect.left + rect.width
                );

                if (!isInDialog) {
                    modal.close();
                }
        })
}

function closeDeleteCatModal(id) {
    const modal = document.getElementById('delete-cat-modal-' + id);
    if (modal) modal.close();
}

function openDeleteModal(id) {
    const modal = document.getElementById('delete-modal-' + id);
    if (modal) modal.showModal();

    modal.addEventListener('click', (event) => {
        const rect = modal.getBoundingClientRect();

        const isInDialog = (
                rect.top <= event.clientY &&
                event.clientY <= rect.top + rect.height &&
                rect.left <= event.clientX &&
                event.clientX <= rect.left + rect.width
            );

            if (!isInDialog) {
                modal.close();
            }
    })
}

function closeDeleteModal(id) {
    const modal = document.getElementById('delete-modal-' + id);
    if (modal) modal.close();
}

function updateTypeFromFreq(inputEl) {
    const freq = parseInt(inputEl.value.replace(/\D/g, ''));
    if (isNaN(freq)) return;
    const form = inputEl.closest('form');
    const typeSelect = form.querySelector('select[name="type"]');
    if (freq >= 1 && freq <= 100) typeSelect.value = "Import";
    else if (freq >= 101 && freq <= 300) typeSelect.value = "Export";
    else if (freq >= 301 && freq <= 400) typeSelect.value = "Transfer";
    else if (freq >= 401 && freq <= 500) typeSelect.value = "ME2_Request";
}

document.addEventListener('DOMContentLoaded', loadFilters);

document.addEventListener('input', function (e) {
    if (e.target.name === 'freq') updateTypeFromFreq(e.target);
});

document.addEventListener('submit', function (e) {
    const freqInput = e.target.querySelector('input[name="freq"]');
    if (!freqInput) return;
    const numericValue = parseInt(freqInput.value.replace(/\D/g, ''));
    if (isNaN(numericValue) || numericValue < 1 || numericValue > 500) {
        e.preventDefault();
        alert('Fehler: Frequenz muss zwischen 1 und 500 liegen!');
        return;
    }
    let existingFreqs = [];
    if (e.target.id === 'add-form') {
        const selectedCat = e.target.querySelector('select[name="category"]').value;
        const sections = document.querySelectorAll('.section-divider');
        sections.forEach(sec => {
            if (sec.querySelector('h2').textContent.trim() === selectedCat) {
                let next = sec.nextElementSibling;
                while (next && !next.classList.contains('section-divider')) {
                    next.querySelectorAll('.freq-display').forEach(el => existingFreqs.push(el.textContent.replace(/\D/g, '')));
                    next = next.nextElementSibling;
                }
            }
        });
    } else {
        const currentCard = e.target.closest('.card');
        document.querySelectorAll('.freq-display').forEach(el => {
            if (!currentCard.contains(el)) existingFreqs.push(el.textContent.replace(/\D/g, ''));
        });
    }
    if (existingFreqs.includes(numericValue.toString())) {
        e.preventDefault();
        alert('Fehler: Die Frequenz ' + numericValue + ' wird bereits verwendet!');
    }
});