const authSection = document.getElementById("authSection");
const dashboard = document.getElementById("dashboard");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

const authMessage = document.getElementById("authMessage");


function showAuthMessage(message) {
    authMessage.textContent = message;
}
function updateAuthUI(session) {

    if (session) {
        authSection.style.display = "none";
        dashboard.style.display = "block";
    } else {
        authSection.style.display = "block";
        dashboard.style.display = "none";
    }

}

signupBtn.addEventListener("click", async () => {

    const email = authEmail.value.trim();
    const password = authPassword.value;

    if (!email || !password) {
        showAuthMessage("Please enter your email and password.");
        return;
    }

    showAuthMessage("Creating your account...");

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        showAuthMessage(error.message);
        return;
    }

    if (data.session) {
        showAuthMessage("Account created successfully. You are logged in.");
    } else {
        showAuthMessage(
            "Account created. Please check your email to confirm your account."
        );
    }

});


loginBtn.addEventListener("click", async () => {

    const email = authEmail.value.trim();
    const password = authPassword.value;

    if (!email || !password) {
        showAuthMessage("Please enter your email and password.");
        return;
    }

    showAuthMessage("Logging you in...");

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (error) {
        showAuthMessage(error.message);
        return;
    }

    showAuthMessage("Login successful.");
});


async function checkAuthSession() {

    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error) {
        console.error("Session error:", error);
        return;
    }
updateAuthUI(data.session);
    if (data.session) {
        showAuthMessage(
            `Logged in as ${data.session.user.email}`
        );
    }

}


checkAuthSession();
supabaseClient.auth.onAuthStateChange((event, session) => {

    updateAuthUI(session);

});