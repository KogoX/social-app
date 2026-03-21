const testLogin = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'deondd402@gmail.com', password: 'kipchumba' })
    });
    const data = await res.json();
    console.log('Login Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

testLogin();
