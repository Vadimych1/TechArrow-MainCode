import './App.css';
import { useState } from 'react';

// A fetch API wrappers
async function get(addr, data) {
  try {
    return await fetch(addr, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
  } catch (e) {
    return Promise.reject(e);
  }
}

async function post(addr, data) {
  try {
    return await fetch(addr, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
  } catch (e) {
    return Promise.reject(e);
  }
}

function App() {
  const [username, changeUsername] = useState(null);

  function update() {
    get("http://localhost:3001/api/user/my_profile").then(async (response) => {
      const data = await response.json();
      changeUsername(data.name);
    });
  }

  update();

  return (
    <div className="App">
      <h1>Login</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        post('http://localhost:3001/api/auth/login', {email, password})
         .then(res => res.json())
         .then(data => {
            console.log(data);

            if (data.error) {
              alert(data.message);
            }

            update();
          })
         .catch(err => console.error(err));
      }}>
        <input type="text" name="email" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>

      <h1>Register</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const age = e.target.age.value;
        const phone = e.target.phone.value;

        post('http://localhost:3001/api/auth/login', {email, password, age, phone, name})
         .then(res => res.json())
         .then(data => {
            console.log(data);

            if (data.error) {
              alert(data.message);
            }

            update();
          })
         .catch(err => console.error(err));
      }}>
        <input type="text" name="name" placeholder="Name" required />
        <input type="text" name="email" placeholder="Username" required />
        <input type="number" name="age" placeholder='Age' required />
        <input type="tel" name="phone" placeholder="Phone" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      
      <h1>Logout</h1>
      <form onSubmit={(e) => {
        e.preventDefault();

        post('http://localhost:3001/api/auth/logout', {})
         .then(res => res.json())
         .then(data => {
            console.log(data);

            if (data.error) {
              alert(data.message);
            }
        
            update();
          })
         .catch(err => console.error(err));
      }}>
        <button type="submit">Logout</button>
      </form>

      <h1>{username ? `Welcome, ${username}!` : "Not authorized"}</h1>
    </div>
  );
}

export default App;
