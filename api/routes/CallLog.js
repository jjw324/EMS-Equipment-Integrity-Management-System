import { Router } from 'express';
import { Form, CallLog } from '../models';

const CallLogRouter = Router();

/**
 * Retrieve the most recent form of the call log form from the document database. 
 */
async function getMostRecentCallLog() {
    return Form.find({ for: "CallLog" }).sort({ _id: -1 }).limit(1);
}

/**
 * Send the questions from the call log form to the client.
 */
CallLogRouter.get('/', async (req, res) => {
    let form;

    try {
        form = (await getMostRecentCallLog())[0].questions;
    } catch (err) {
        console.log("[ERR] Unable to locate most recent Call Log", err)
        res.status(404).send("Form not found");
    }

    res.status(200).send(form);
});

/**
 * Send the requested call log, identified by document ID, to the client.
 */
CallLogRouter.get('/id/:docID', async (req, res) => {
    let dbRes;

    try {
        dbRes = await CallLog.findById(req.params.docID);
    } catch (err) {
        console.log("[ERR] Unable to locate document with ID: ", req.params.docID);
        res.status(404).send(`Unable to locate document with ID ${this.params.docID}`);
    }

    res.status(200).send(dbRes);
});

/**
 * Send a list of all calls to the client.
 */
CallLogRouter.get('/list', async (req, res) => {
    let dbRes;

    try {
        dbRes = await CallLog.find({}).select('_id submittedBy dateSubmitted');
    } catch (err) {
        console.log(`[ERR] Error in /truckcheck/list`, err);
        res.status(500).end();
    }

    res.status(200).send(dbRes);
});

/**
 * Post a completed call log form to the document database.
 */
CallLogRouter.post('/', async (req, res) => {
   if (!(req.body.submittedBy &&
        req.body.questions &&
        req.body.answers)) {
        res.status(400).send("Bad Request. Expecting body to contain: submittedBy, questions, answers.");
    }
    else if(!(Array.isArray(req.body.questions) && Array.isArray(req.body.answers))) {
        res.status(400).send("Bad Request. Questions and Answers must be arrays.");
    }
    else if (req.body.questions.length !== req.body.answers.length) {
        res.status(400).send("Bad Request. Different number of questions and answers.");
    }

    let questions = []
    for (const item in req.body.questions) {
        questions.push({
            question: req.body.questions[item],
            answer: req.body.answers[item]
        });
    }

    const callLog = new CallLog({
        submittedBy: req.body.submittedBy,
        questions: questions
    });

    try {
        const dbRes = await callLog.save();
        console.log(`[INFO] Truck Check posted with ID: ${dbRes._id}`);
        res.status(201).end();
    } catch (err) {
        console.log("[ERR] Unable to post Truck Check", err);
    } 
});

export default CallLogRouter;
