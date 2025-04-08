import fs from 'fs';
import pg from 'pg';
const { Client } = pg;

let logger;

const client = new Client({
    user: "postgres",
    password: "postgres",
});
client.connect();

// types: add/delete/get/update
const methods = [
    // auth
    {
        "name": "auth/register",
        "type": "add",
        "file": "REGISTER"
    },
    {
        "name": "auth/login",
        "type": "add",
        "file": "LOGIN"
    },
    {
        "name": "auth/reset",
        "type": "add",
        "file": "RESET"
    },
    {
        "name": "auth/logout",
        "type": "delete",
        "file": "LOGOUT"
    },
    {
        "name": "auth/cookie_user",
        "type": "get",
        "file": "USER_ID_BY_COOKIE"
    },
    {
        "name": "auth/user_by_user_id",
        "type": "get",
        "file": "USER_BY_USER_ID"
    },
    {
        "name": "auth/create_session",
        "type": "add",
        "file": "CREATE_SESSION"
    },
    {
        "name": "user/get_users",
        "type": "get",
        "file": "USERS"
    }
];

const init_scripts = [
    "functions",
    "tables",
];

async function initialize(g_logger) {
    logger = g_logger;

    for (const script of init_scripts) {
        const sql = fs.readFileSync(`./database/sql/${script}.sql`, 'utf8');

        try {
            await client.query(sql);            
        } catch (err) {
            logger.error(`Error executing SQL script ${script}:\n${sql}\n`, err);
            process.exit(1);
        }
    }

    let registered = {};
    for (const method of methods) {
        const { name, type, file } = method;
        const sql = fs.readFileSync(`./database/sql/${type}/${file}.sql`, 'utf8');
        registered[name] = {
            file,
            sql,
            "run": async (...args) => {
                try {
                    const res = await client.query(sql, args);
                    return res;
                } catch (err) {
                    logger.error(`Error executing SQL query for ${name}:\n${sql}\n`, err);
                    process.exit(1);
                }
                
            }
        }
    }

    logger.info("Initialized DB");
    return registered;
}

export default {
    initialize
}