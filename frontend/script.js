const API_BASE = "http://localhost:8000/api/v1"; // adjust based on deployment

// 🧾 Utility: show toast/alert
function showAlert(message, isSuccess = true) {
  alert(`${isSuccess ? "✅" : "❌"} ${message}`);
}

// 🔐 REGISTER
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = registerForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Registering...";

    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${API_BASE}/students/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        showAlert(result.message || "Registration successful!");
        window.location.href = "index.html";
      } else {
        showAlert(result.message || "Registration failed.", false);
      }
    } catch (err) {
      console.error("Register error:", err);
      showAlert("Server error during registration", false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Register";
    }
  });
}

// 🔑 LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = loginForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${API_BASE}/students/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      let result = {};
      try {
        result = await response.json();
      } catch {
        console.warn("Invalid JSON response");
      }

      if (response.ok) {
        localStorage.setItem("token", result.data?.accessToken || "");
        showAlert("Login successful!");
        window.location.href = "dashboard.html";
      } else {
        showAlert(result?.message || "Invalid credentials", false);
      }

    } catch (error) {
      console.error("Login error:", error);
      showAlert("Network error. Try again.", false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Login";
    }
  });
}

// 🚪 LOGOUT
async function logout() {
  try {
    const response = await fetch(`${API_BASE}/students/logout`, {
      method: "POST",
      credentials: "include",
    });

    const contentType = response.headers.get("content-type");

    let result = {};
    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    }

    if (response.ok) {
      localStorage.removeItem("token");
      alert(result.message || "Logged out!");
      window.location.href = "index.html";
    } else {
      alert(result.message || `Logout failed: ${response.status}`);
    }

  } catch (error) {
    console.error("Logout error:", error);
    alert("Server error. Please try again.");
  }
}
