import express from 'express';
import BodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import apiRouter from './routes';
import { rdb } from './models';
import timersPromises from 'timers/promises';

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
    console.log(`[INFO] Server listening on port ${PORT}`);
    let connectedRDB = false;
    let connectedDDB = false;
    
    while(!connectedRDB){
        try {
            await rdb.connection.authenticate();
            console.log('[INFO] Connection to relational database has been established successfully.');
            connectedRDB = true;
        } catch (error) {
            console.log('[WARN] Unable to connect to relational database. Retrying again in 30s. ');
            await timersPromises.setTimeout(30000);
        }
    }
    
    while(!connectedDDB){
        try {
            await mongoose.connect(DDB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log('[INFO] Connection to document database has been established successfully.');
            connectedDDB = true;
        } catch (error) {
            console.log('[WARN] Unable to connect to document database. Retrying again in 30s. ');
            timersPromises.setTimeout(30000);
        }
    }
});