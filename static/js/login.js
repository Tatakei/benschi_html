const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', async function(e) {
    e.preventDefault();

    const username = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!username || !email || !password) {
        alert("Please fill in all fields :3");
        return;
    }

    await performLogin(username, email, password);
});

async function performLogin(username, email, password) {
    try {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch('/login', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.redirected) {
            window.location.href = response.url;
            return;
        }

        const data = await response.text();
        alert("Zugriff verweigert: Invalid Credentials");

    } catch (error) {
        console.error("Connection Error:", error);
        alert("Connection failed.");
    }
}