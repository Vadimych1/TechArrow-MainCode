import Util from "./util.js"

export default class CommentsService {
    static async addComment(req, res, database, logger) {
        const { _success, text, stars } = await Util.check_args(req, res, [
            "text",
            "stars",
        ]);

        if (!_success) {
            return;
        }

        if (!(req.session && req.user)) {
            res.send({
                "error": "not_authorized",
                "message": "Вы не авторизованы"
            });
            return;
        }

        const result = (await database["comments/new"].run(text, stars, req.user.id)).rows[0];
        res.send({});
    }

    static async getComments(req, res, database, logger) {
        const result = (await database["comments/get"].run()).rows;
        res.send(result);
    }
}