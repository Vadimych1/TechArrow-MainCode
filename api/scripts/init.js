import express from 'express';
import cookieParser from 'cookie-parser';
import AuthService from './auth.js';
import Middleware from './middleware.js';
import UserService from './user.js';


let database;
let logger;


const functions = [
    {
        "path": "/api/auth/register",
        "function": AuthService.register,
        "method": "post",
    },
    {
        "path": "/api/auth/login",
        "function": AuthService.login,
        "method": "post",
    },
    {
        "path": "/api/auth/reset",
        "function": AuthService.reset,
        "method": "post",
    },
    {
        "path": "/api/auth/logout",
        "function": AuthService.logout,
        "method": "post",
    },

    {
        "path": "/api/user/my_profile",
        "function": UserService.getProfile,
        "method": "get",
    },
    {
        "path": "/api/user/other_profile",
        "function": UserService.getOtherProfile,
        "method": "get",
    },
    {
        "path": "/api/user/get_profiles",
        "function": UserService.getProfiles,
        "method": "get",
    }
];


function initialize(app, databaseMethods, g_logger) {
    logger = g_logger;

    app.use(express.static("./static/"));
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Allow-Methods');
        res.header('Access-Control-Allow-Credentials', true);

        next();
    });
    
    app.use(async (req, res, next) => Middleware.cookie_auth_mw(req, res, next, logger));
    app.use(async (req, res, next) => Middleware.redirect_mw(req, res, next, logger));

    for (const method in functions) {
        const { path, function: handler, method: method_name } = functions[method];
        app[method_name](path, async (req, res) => await handler(req, res, database, logger));
    }

    database = databaseMethods || {};
    Middleware.setDatabase(database);

    logger.info("Initialized API methods");
}


export default {
    initialize
}
