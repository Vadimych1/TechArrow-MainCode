<style>
    :root {
        font-family: sans-serif;
    }

    h1 {
        font-weight: bold;
    }
</style>

# API documentation
### - AUTH block
#### 1. /api/auth/register
Method: POST <br>
Arguments: name, surname, email, password, age <br>
Auth: not required<br>
On success: redirects to 'redirect' parameter if specified, else on "/"

#### 2. /api/auth/login
Method: POST<br>
Arguments: email, password<br>
Auth: not required<br>
On success redirects to 'redirect' parameter if specified, else on "/"

#### 3. /api/auth/logout
Method: POST<br>
Arguments: -<br>
Auth: required<br>
On success redirects to 'redirect' parameter if specified, else on "/"

### - USER block
#### 1. /api/user/my_profile
Method: GET<br>
Arguments: -<br>
Auth: required<br>
On success returns JSON:
```json
{
    "name": "Vadim",
    "surname": "Lebedenko",
    "email": "vadimlebedenko0@gmail.com",
    "age": 16,
}
```

#### 2. /api/user/other_profile
Method: GET<br>
Arguments: user_id<br>
Auth: required<br>
On success returns JSON:
```json
{
    "name": "Jane",
    "surname": "Doe",
    "email": "janedoe@example.com",
    "age": 25,
}
```

<hr>

# About arguments
Arguments can be passed to method with:
1. query string
2. html form data
3. json body

<hr>

# Example API usage
JSON body example usage:
```js
const response = await (await fetch("localhost:3001/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
        email: "test@example.com",
        password: "test123"
    }),
    headers: {
        "Content-Type": "application/json"
    }
})).json();
```

Query string example usage:
```js
const response = await (await fetch("localhost:3001/api/auth/login", {
    method: "POST",
    body: URLSearchParams({ email: "test@example.com", password: "test123" }),
})).json();
```