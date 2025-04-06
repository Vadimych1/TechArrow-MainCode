import database from './database/scripts/init.js';
import api from './api/scripts/init.js';
import express from 'express';
import { renderFile } from 'marked-engine';
import pino from 'pino';

const logger = pino({ level: 'info' });

const PORT = process.env.PORT || 3001;
logger.info('Running server on port ' + PORT)

const app = express();
app.engine('md', renderFile);
app.set('views', './');

const methods = await database.initialize(logger);
api.initialize(app, methods, logger);

app.listen(PORT);

app.get('/', function(req, res) {
    res.render('DOCS.md');
})

logger.info('Initialized and running')