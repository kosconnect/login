document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Mencegah reload halaman

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = { email, password };

    fetch("https://kosconnect-server.vercel.app/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.error || "Periksa kredensial Anda.");
          });
        }
        return response.json();
      })
      .then((result) => {
        if (result.token && result.role) {
          // Simpan token dan role ke cookie
          setCookie("authToken", result.token, 7);
          setCookie("userRole", result.role, 7);

          // Tampilkan pesan sukses dengan Swal
          Swal.fire({
            title: "Login Berhasil!",
            text: "Anda akan dialihkan ke halaman sesuai peran Anda.",
            icon: "success",
            timer: 2000, // Auto-close dalam 2 detik
            showConfirmButton: false,
          }).then(() => {
            // Redirect berdasarkan role
            if (result.role === "user") {
              window.location.href = "https://kosconnect.github.io/";
            } else if (result.role === "owner") {
              window.location.href =
                "https://kosconnect.github.io/dashboard-owner";
            } else if (result.role === "admin") {
              window.location.href =
                "https://kosconnect.github.io/dashboard-admin";
            } else {
              Swal.fire("Error!", "Role tidak valid.", "error");
            }
          });
        }
      })
      .catch((error) => {
        if (
          error.message ===
          "Email belum diverifikasi. Silakan verifikasi email Anda."
        ) {
          Swal.fire({
            title: "Email Belum Diverifikasi!",
            text: "Silakan cek email Anda untuk verifikasi sebelum login.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "Login Gagal!",
            text: "Akun Tidak Terdaftar atau Password Salah. Silakan coba lagi atau daftar.",
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.href = "https://kosconnect.github.io/register";
          });
        }
      });
  });
});

// Fungsi untuk menyimpan token ke cookie
const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/;Secure;SameSite=Strict`;
};

// Script untuk user setelah berhasil verifikasi email
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const verified = urlParams.get("verified");

  if (verified === "true") {
    Swal.fire({
      title: "Email Terverifikasi!",
      text: "Email Anda berhasil diverifikasi. Silakan login untuk melanjutkan.",
      icon: "success",
      confirmButtonText: "OK",
    });
  }
});

// Password visibility toggle
document.addEventListener("DOMContentLoaded", () => {
  const togglePassword = document.querySelector(".toggle-password");
  const passwordInput = document.querySelector("#password");

  togglePassword.addEventListener("click", () => {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Ganti ikon mata
    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
  });
});

function handleGoogleSignIn() {
  // Redirect pengguna ke endpoint Google OAuth di backend
  window.location.href =
    "https://kosconnect-server.vercel.app/auth/google/login";
}