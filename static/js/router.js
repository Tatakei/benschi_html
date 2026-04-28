const FIXED_ROUTES = {
    "homepage": "/",
    "dashboard": "/",
    "atm": "/inf_atm",
    "notes": "/notes/dashboard",
    "coding": "/inf_coding",
    "others": "/others"
};

document.addEventListener("click", (event) => {
    const path = event.composedPath();
    const targetEl = path.find(el => el.dataset && el.dataset.route);

    if (!targetEl) return;

    const routeKey = targetEl.dataset.route;
    const destination = FIXED_ROUTES[routeKey] || routeKey;

    console.log(`Routing to: ${destination}`);
    window.location.href = destination;
});