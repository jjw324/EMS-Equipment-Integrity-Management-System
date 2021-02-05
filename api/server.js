import express from 'express';
import BodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import apiRouter from './routes';
import { rdb } from './models';

const server = express();

// ENVIRIONMENT VARIABLES
const PORT = process.env.API_PORT || 5000;
const DDB_URL = `mongodb://${process.env.DDBHOST}:${process.env.DDBPORT}/emseims` || "mongodb://127.0.0.1:27017/emseims";

// MIDDLEWARES
server.use(cors())
    .use(BodyParser.json());

// ROUTES
server.use('/', apiRouter);

// SERVER INITIATE
server.listen(PORT, async () => {
    console.log(`[INFO] Server listening on port ${PORT}`)
    try {
        await rdb.connection.authenticate();
        console.log('[INFO] Connection to relational database has been established successfully.');
        await mongoose.connect(DDB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('[INFO] Connection to document database has been established successfully.');
    } catch (error) {
        console.error('[ERR] Unable to connect to the database: ', error);
        return;
    };
});