import Util from "./util.js";

/**
 * Provides functionality for user data fetching
 */
class UserService {
    /**
     * Get the current user profile data
     * @param {Request} req Express request object
     * @param {Response} res Express responce object
     * @param {Object} database Express database object
     * @returns authorized user`s profile
     */
    static async getProfile(req, res, database, logger) {
        if (req.user && req.session) {
            res.send(req.user);
        } else {
            res.send({});
        }
    }


    /**
     * Get the other`s user profile data by user_id
     * @param {Request} req Express request object
     * @param {Response} res Express responce object
     * @param {Object} database Express database object
     * @returns other user`s profile
     */
    static async getOtherProfile(req, res, database, logger) {
        const { _success, user_id } = await Util.check_args(req, res, [
            'user_id',
        ]);

        if (!_success || !req.user) {
            res.send({});
        }

        const result = await database["auth/user_by_user_id"].run(user_id);
        if (result.rowCount >= 1) {
            res.send(result.rows[0]);
        } else {
            res.send({});
        }

        logger.debug("Sending profile for " + user_id);
    }

    static async getProfiles(req, res, database, logger) {
        if (!(req.user && req.session)) {
            res.send([]);
            return;
        }

        const result = await database["user/get_users"].run();
        res.send(result.rows);
    }

    static async updateProfile(req, res, database, logger) {
        const { _success, name, email, age, phone } = await Util.check_args(req, res, [
            "name",
            "email",
            "age",
            "phone"
        ]);

        if (!_success) {
            console.log("RETURN", _success)
            return;
        }

        if (!(req.user && req.session)) {
            res.send({
                "error": "not_authorized",
                "message": "Вы не авторизованы"
            });
            return;
        }

        const result = (await database["user/update"].run(
            name,
            email,
            age,
            phone,
            req.user.id,
        )).rows[0];

        res.send(result ?? {});
    }
}

export default UserService;