function days_since(startDateString) {
    const today = new Date();

    const start = new Date(startDateString);

    const diffInMs = today - start;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays;
}

document.addEventListener('DOMContentLoaded', () => {
    const dt = document.getElementById('days_together');
    const dss = document.getElementById('days_since_server');

    dt.textContent = days_since('2026-02-07');
    dss.textContent = days_since('2026-03-11');
});