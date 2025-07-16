const API_BASE = "http://localhost:8000/api/v1"; // adjust your backend port

// Handle Registration
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch(`${API_BASE}/students/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    alert(result.message);

    if (response.ok) {
      window.location.href = "index.html";
    }
  });
}

/// Handle Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${API_BASE}/students/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // if using cookies
        body: JSON.stringify(data),
      });

      let result = {};
      try {
        result = await response.json(); // might throw
      } catch (jsonError) {
        console.warn("Failed to parse JSON from server");
      }

      if (response.ok) {
        localStorage.setItem("token", result.data?.accessToken || "");
        alert("Login successful!");
        window.location.href = "dashboard.html";
      } else {
        alert(result?.message || "Login failed");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Network or server error. Please try again later.");
    }
  });
}

// Handle Logout
function logout() {
  // Optional: call logout API if you store refresh token in DB
  localStorage.removeItem("token");
  alert("Logged out!");
  window.location.href = "index.html";
}
