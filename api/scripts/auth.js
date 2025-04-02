import Util from "./util.js";

class AuthService {
    static async register(req, res, database) {
        const {_success, username, email, password, phone, age} = await Util.check_args(req, res, [
            "username",
            "email",
            "password",
            "phone",
            "age",
        ]);
    
        if (!_success) {
            return;
        }
    
        const {hash: hashed, salt} = await Util.hash_password(password);
    
        const register_result = await database["auth/register"].run(username, email, age, phone, hashed, salt);
    
        if (register_result.rowCount < 1) {
            res.status(400).send({"error": "server_error", "message": "Аккаунт уже существует"});
            return;
        }
    
        let expires = Date.now() + 24 * 60 * 60 * 1000;
        let expiresStr = (new Date(expires)).toISOString();
    
        const session_result = await database["auth/create_session"].run(register_result.rows[0].id, expiresStr);
    
        if (session_result.rowCount < 1) {
            res.status(418).send({"error": "server_error", "message": "Ошибка при создании сессии. Попробуйте войти"});
            return;
        }
    
        const session = session_result.rows[0].session_id;
        res.cookie("session", session, {"maxAge": expires});
    
        await Util.check_redirect(req, res, "/");
    }

    static async login(req, res, database) {
        const {_success, email, password} = await Util.check_args(req, res, [
            "email",
            "password",
        ]);
    
        if (!_success) {
            return;
        }
    
        const user_result = await database["auth/login"].run(email);
        if (user_result.rowCount < 1) {
            res.status(400).send({"error": "bad_request", "message": "Неверный email или пароль"});
            return;
        }
    
        const user = user_result.rows[0];
    
        const verify_result = await Util.verify_password(password, user.password);
        if (!verify_result) {
            res.status(401).send({"error": "bad_request", "message": "Неверный email или пароль"});
            return;
        }
    
        let expires = Date.now() + 24 * 60 * 60 * 1000;
        let expiresStr = (new Date(expires)).toISOString();
        const session_result = await database["auth/create_session"].run(user.id, expiresStr);
    
        if (session_result.rowCount < 1) {
            res.status(418).send({"error": "server_error", "message": "Ошибка при создании сессии. Попробуйте войти ещё раз"});
            return;
        }
    
        const session = session_result.rows[0].session_id;
    
        res.cookie("session", session, {"maxAge": expires});
    
        Util.check_redirect(req, res, "/");
    }

    static async reset(req, res, database) {
        res.status(404).send({"error": "not_found", "message": "Неизвестный или нереализованный метод"});
        Util.check_redirect(req, res, "/");
    }

    static async logout(req, res, database) {
        if (req.user && req.session) {
            await database["auth/logout"].run(req.session);
            res.clearCookie("session");
        } else {
            res.clearCookie("session");
            res.status(401).send({"error": "unauthorized", "message": "Необходима авторизация"});
            return;
        }
    
        Util.check_redirect(req, res, "/");
    }
}

export default AuthService;