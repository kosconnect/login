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

// Fungsi untuk menangani respons login
const handleLoginResponse = async (response) => {
  try {
    if (!response.ok) {
      const errorData = await response.json();
      alert("Login gagal: " + errorData.error || "Terjadi kesalahan.");
      return;
    }

    // Parse response JSON
    const data = await response.json();
    const { message, token, role, redirectURL } = data;

    // Simpan token ke LocalStorage atau Cookies (opsional)
    if (token) {
      localStorage.setItem("authToken", token); // Simpan ke localStorage
    }

    // Tampilkan pesan berhasil
    alert(message);

    // Redirect ke URL yang sesuai
    if (redirectURL) {
      window.location.href = redirectURL;
    } else {
      alert("Redirect URL tidak ditemukan. Harap hubungi admin.");
    }
  } catch (error) {
    console.error("Error handling login response:", error);
    alert("Terjadi kesalahan saat memproses respons login.");
  }
};

// Contoh penggunaan saat login berhasil
fetch("https://kosconnect-server.vercel.app/auth/callback", {
  method: "GET", // atau GET, tergantung endpoint backend
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    state: "stateParameter", // ganti dengan nilai sebenarnya
    code: "authorizationCode", // ganti dengan kode sebenarnya
  }),
})
  .then(handleLoginResponse)
  .catch((error) => {
    console.error("Login request failed:", error);
    alert("Terjadi kesalahan saat menghubungi server.");
  });