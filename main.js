import database from './database/scripts/init.js';
import api from './api/scripts/init.js';
import express from 'express';
import { renderFile } from 'marked-engine';
import pino from 'pino';
import PNG from 'pngjs';

function arrayToPNG(width, height, h, xoff, yoff, z, out) {
    const png = new PNG.PNG({ width, height });
    const data = png.data;

    let sum = 0;

    for (const elem of dots[h - 1]) {
        const dist = Math.sqrt(Math.pow(xoff - elem[0], 2) + Math.pow(yoff - elem[1], 2));
        const d = 88 / Math.max(1, dist / 2);
        sum += d > 40 ? d : 0;
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            data[index] = h == 1 || h == 4 ? 255 : 40; // Red channel
            data[index + 1] = h == 2 || h == 4 ? 255 : 30; // Green channel
            data[index + 2] = h == 3 ? 255 : 20; // Blue channel
            data[index + 3] = Math.min(sum, 128); // Alpha channel (fully opaque)
        }
    }

    return png.pack().pipe(out);
}


const logger = pino({ level: 'info' });

const PORT = process.env.PORT || 5000;
logger.info('Running server on port ' + PORT)

const app = express();
app.engine('md', renderFile);
app.set('views', './');

const methods = await database.initialize(logger);
api.initialize(app, methods, logger);
app.listen(PORT);

app.get('/', function(req, res) {
    res.render('DOCS.md');
});


const dots = [
    [
        [10194, 5075],
        [10187, 5060],
    ],
    [
        [10191, 5073],
        [10184, 5056],
    ],
    [
        [10192, 5078],
        [10183, 5062],
    ],
    [
        [10197, 5074],
        [10189, 5068],
    ],
];


app.get('/maps', async function (req, res) {
    const { x, y, z, g } = req.query;

    // console.log(`${x} ${y} ${z} ${g}`)

    res.type("image/png");
    arrayToPNG(256, 256, g, x, y, z, res);
});


logger.info('Initialized and running')