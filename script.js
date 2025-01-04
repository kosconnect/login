document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
  
    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Mencegah form dari reload halaman
  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      const data = { email, password };
  
      const token = "YOUR_BEARER_TOKEN_HERE"; // Ganti dengan token yang valid
  
      fetch("https://kosconnect-server.vercel.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Gunakan token yang valid
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.message || 'Periksa kredensial Anda.');
          });
        }
        return response.json();
      })
      .then(result => {
        alert('Login berhasil!');
        window.location.href = "https://kosconnect.github.io/"; // Halaman tujuan setelah login
      })
      .catch(error => {
        alert('Terjadi kesalahan saat mencoba login.');
        console.error('Error:', error);
      });
    });
});