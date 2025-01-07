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
        credentials: "include", // Kirim cookie untuk autentikasi jika diperlukan
        body: JSON.stringify(data),
      })
        .then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Periksa kredensial Anda.");
          }
          return response.json();
        })
        .then((result) => {
          if (result.token && result.role) {
            // Simpan token dan role ke cookie
            setCookie("authToken", result.token, 7);
            setCookie("userRole", result.role, 7);
  
            // Redirect berdasarkan role
            redirectBasedOnRole(result.role);
          }
        })
        .catch((error) => {
          alert("Akun Tidak Tedaftar. Silahkan Melakukan Pendaftaran Terlebih Dahulu.");
          console.error("Error:", error);
          window.location.href = "https://kosconnect.github.io/register";
        });
    });
  });
  
  function handleGoogleSignIn() {
    // Redirect pengguna ke endpoint Google OAuth di backend
    window.location.href = "https://kosconnect-server.vercel.app/auth/google/login";
  }
  
  // Fungsi untuk menyimpan cookie dengan parameter aman
  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/;Secure;SameSite=Strict`;
  };
  
  // Fungsi untuk redirect berdasarkan role pengguna
  const redirectBasedOnRole = (role) => {
    let redirectURL = "https://kosconnect.github.io/";
    if (role === "owner") {
      redirectURL = "https://kosconnect.github.io/dashboard-owner";
    } else if (role === "admin") {
      redirectURL = "https://kosconnect.github.io/dashboard-admin";
    }
    window.location.href = redirectURL;
  };
  
  // Fungsi untuk memproses respons login dari backend
  const handleLoginResponse = async (response) => {
    try {
      if (!response.ok) {
        const errorData = await response.json();
        alert("Login gagal: " + (errorData.error || "Terjadi kesalahan."));
        return;
      }
  
      const data = await response.json();
      const { message, token, role, redirectURL } = data;
  
      // Simpan token ke cookie
      if (token) {
        setCookie("authToken", token, 7); // Simpan token selama 7 hari
      }
  
      // Tampilkan pesan berhasil
      alert(message);
  
      // Redirect berdasarkan URL dari backend
      if (redirectURL) {
        window.location.href = redirectURL;
      } else {
        redirectBasedOnRole(role);
      }
    } catch (error) {
      console.error("Error handling login response:", error);
      alert("Terjadi kesalahan saat memproses respons login.");
    }
  };  