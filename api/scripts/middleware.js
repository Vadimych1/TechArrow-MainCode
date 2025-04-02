let database;

class Middleware {
    static setDatabase(db) {
        database = db;
    }
    
    static async cookie_auth_mw(req, res, next) {
        const { cookies } = req;
        if (cookies.session) {
            const result = await database["auth/cookie_user"].run(cookies.session);
            if (result.rowCount >= 1) {
                const user_result = await database["auth/user_by_user_id"].run(result.rows[0].user_id);
                if (user_result.rowCount >= 1) {
                    req.user = user_result.rows[0];
                    req.session = cookies.session;
                }
            }
        }
    
        next();
    }

    static async redirect_mw(req, res, next) {
        if (req.query.redirect) {
            req.redirect_url = req.query.redirect;
            req.redirect = true;
        } else {
            req.redirect_url = null;
            req.redirect = false;
        }
    
        next();
    }
}

export default Middleware;