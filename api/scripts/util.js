import bcrypt from 'bcrypt';

class Util {
    static async hash_password(password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return {salt, hash};
    }

    static async verify_password(password, hashed_password) {
        const result = await bcrypt.compare(password, hashed_password);
        return result;
    }

    static async check_redirect(req, res, fallback=null) {
        if (req.form_redirect) {
            res.redirect(req.redirect_url);
            return;
        }
        
        if (req.redirect) {
            res.status(200).send({redirect_url: req.redirect});
        } else if (fallback) {
            res.status(200).send({redirect_url: fallback});
        } else {
            res.status(200).send({redirect_url: "/"});
        }
    }

    static async check_args(req, res, required = []) {
        let ret = {_success: true};
        let sources = [
            req.query,
            req.body,
            req.params
        ];
        for (const arg of required) {
            for (const source of sources) {
                if (source[arg]) {
                    ret[arg] = source[arg];
                    break;
                }
            }
    
            if (!ret[arg]) {
                console.log(arg)
                res.status(400).send({"error": "bad_request", "message": `Обязательный аргумент ${arg} не найден`});
                return {_success: false}
            }
        }

        return ret;
    }
}

export default Util;