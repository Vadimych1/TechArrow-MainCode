import './App.css';
import { useState } from 'react';

// Врапперы для Fetch API
// для GET запросов
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

// и для POST запросов
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


// Эти две функции можно скопировать в код фронта - они остаются неизменными
// Если изменить - скорее всего всё сломается
// ! Для какого запроса нужен POST, а для какого GET - написано в ДОКУМЕНТАЦИИ !


function App() {
  // Создаем Stateful переменную для изменения содержимого сайта
  const [username, changeUsername] = useState(null);

  // Функция для динамического обновления. Берём данные с сервера и записываем в переменную.
  function update() {
    get("http://localhost:3001/api/user/my_profile").then(async (response) => {
      const data = await response.json();
      changeUsername(data.name);
    });
  }

  // Обновляем сразу же при загрузке компонента
  update();

  return (
    <div className="App">
      {/* Форма для входа */}
      <h1>Login</h1>
      <form onSubmit={(e) => {
        e.preventDefault();

        // Берём данные из формы
        const email = e.target.email.value;
        const password = e.target.password.value;

        // Отправляем POST запрос для регистрации
        // Агрументы НАПИСАНЫ В ДОКУМЕНТАЦИИ
        // Берём их из филдов формы, можно брать любые значения при необходимости
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

      {/* Форма для регистрации */}
      <h1>Register</h1>
      <form onSubmit={(e) => {
        e.preventDefault();

        // Берём данные из формы
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const age = e.target.age.value;
        const phone = e.target.phone.value;

        // Отправляем POST запрос для регистрации
        // Агрументы НАПИСАНЫ В ДОКУМЕНТАЦИИ
        // Берём их из филдов формы, можно брать любые значения при необходимости
        post('http://localhost:3001/api/auth/register', {email, password, age, phone, name})
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
      
      {/* Форма для выхода из аккаунта */}
      <h1>Logout</h1>
      <form onSubmit={(e) => {
        e.preventDefault();

        // Отправляем POST запрос для выхода из аккаунта
        // НИКАКИХ аргументов НЕ НУЖНО
        // Всё хранинтся в куки сайта
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

      {/* Отображение нашей динамической переменной */}
      <h1>{username ? `Welcome, ${username}!` : "Not authorized"}</h1>
    </div>
  );
}

`
ВАЖНО

Запросы можно отправлять через HTML форму, тогда у запроса нужно указывать "form_redirect": true и дополнительного кода не нужно
`

export default App;
