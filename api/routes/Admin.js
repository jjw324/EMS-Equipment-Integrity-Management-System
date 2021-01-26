import { Router } from 'express';
import Form from '../models/Form';

const AdminRouter = Router();

/**
 * Post a new version of a form. 
 */
AdminRouter.post('/newform', async (req, res) => {
    if (!(req.body.for &&
        req.body.createdBy &&
        req.body.questions)) {
        res.status(400).send("Bad request. Expected body with fields: for, createdBy, questions");
    } else if (!(req.body.for === "TruckCheck" || req.body.for === "CallLog")) {
        res.status(400).send("Bad request. 'for' must be 'TruckCheck' or 'CallLog'")
    }
    
    const newForm = new Form({
        for: req.body.for,
        createdBy: req.body.createdBy,
        questions: req.body.questions
    });

    try {
        const dbRes = await newForm.save();
        console.log(`[INFO] New Form posted with ID ${dbRes._id}`);
        res.status(201).end();
    } catch (err) {
        console.log(`[ERR] Unable to post new form`, err);
        res.status(500).end();
    }
});

/**
 * Post a change to the inventory. Records the transaction in the document database.
 */
AdminRouter.post('/invupdate', async (req, res) => {
    res.status(500).end();
});

export default AdminRouter;