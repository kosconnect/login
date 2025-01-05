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