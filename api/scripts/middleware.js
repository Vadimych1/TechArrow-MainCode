let database;

class Middleware {
    static setDatabase(db) {
        database = db;
    }
    
    static async cookie_auth_mw(req, res, next, logger) {        
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

        logger.debug("Authentificated user: " + req.session);
        logger.trace(req.user);
    
        next();
    }

    static async redirect_mw(req, res, next, logger) {
        if (req.query.redirect) {
            req.redirect_url = req.query.redirect;
            req.redirect = true;

            if (req.query.form_redirect || req.body.form_redirect || req.json?.form_redirect) {
                req.form_redirect = true;
            }   
        } else {
            req.redirect_url = null;
            req.redirect = false;
        }

        

        logger.debug("Redirect URL: " + req.redirect_url);
    
        next();
    }
}

export default Middleware;