import database from './database/scripts/init.js';
import api from './api/scripts/init.js';
import express from 'express';

const PORT = process.env.PORT || 3000;

const app = express();
const methods = await database.initialize();
api.initialize(app, methods);

console.info("All modules initialized");

app.listen(PORT);

app.get('/', function(req, res) {})