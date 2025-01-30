document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Mencegah reload halaman

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = { email, password };

    fetch("https://kosconnect-server.vercel.app/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Periksa kredensial Anda.");
          });
        }
        return response.json();
      })
      .then((result) => {
        if (result.token && result.role) {
          // Simpan token dan role ke cookie
          document.cookie = `authToken=${result.token}; path=/; secure;`;
          document.cookie = `userRole=${result.role}; path=/; secure;`;

          // Alihkan pengguna berdasarkan role
          if (result.role === "user") {
            window.location.href = "https://kosconnect.github.io/";
          } else if (result.role === "owner") {
            window.location.href = "https://kosconnect.github.io/dashboard-owner";
          } else if (result.role === "admin") {
            window.location.href = "https://kosconnect.github.io/dashboard-admin";
          } else {
            alert("Role tidak valid.");
          }
        }
      })
      .catch((error) => {
        alert("Akun Tidak Tedaftar. Silahkan Melakukan Pendaftaran Terlebih Dahulu");
        console.error("Error:", error);
        window.location.href = "https://kosconnect.github.io/register";
      });
  });
});

function handleGoogleSignIn() {
  // Redirect pengguna ke endpoint Google OAuth di backend
  window.location.href =
    "https://kosconnect-server.vercel.app/auth/google/login";
}

// Fungsi untuk menyimpan token ke cookie
const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Konversi hari ke milidetik
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/;Secure;SameSite=Strict`; 
};


// Contoh penggunaan dalam handleLoginResponse
const handleLoginResponse = async (response) => {
  try {
    if (!response.ok) {
      const errorData = await response.json();
      alert("Login gagal: " + (errorData.error || "Terjadi kesalahan."));
      return;
    }

    // Parse response JSON
    const data = await response.json();
    const { message, token, role, redirectURL } = data;

    // Simpan token ke Cookie
    if (token) {
      setCookie("authToken", token, 7); // Simpan token selama 7 hari
    }

    // Tampilkan pesan berhasil
    alert(message);

    // Redirect ke URL yang sesuai
    if (redirectURL) {
      window.location.href = redirectURL; // Redirect pengguna
    } else {
      alert("Redirect URL tidak ditemukan. Harap hubungi admin.");
    }
  } catch (error) {
    console.error("Error handling login response:", error);
    alert("Terjadi kesalahan saat memproses respons login.");
  }
};

// script untuk user setelah berhasil verifikasi email
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const verified = urlParams.get('verified');

  if (verified === 'true') {
      Swal.fire({
          title: 'Email Terverifikasi!',
          text: 'Email Anda berhasil diverifikasi. Silakan login untuk melanjutkan.',
          icon: 'success',
          confirmButtonText: 'OK'
      });
  }
});

 // Password visibility toggle
  document.addEventListener("DOMContentLoaded", () => {
      const togglePassword = document.querySelector(".toggle-password");
      const passwordInput = document.querySelector("#password");
  
      togglePassword.addEventListener("click", () => {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
  
        // Ganti ikon mata
        togglePassword.classList.toggle("fa-eye");
        togglePassword.classList.toggle("fa-eye-slash");
      });
  });