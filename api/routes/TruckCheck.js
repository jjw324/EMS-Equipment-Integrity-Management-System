import { Router } from 'express';
import { Form, TruckCheck } from '../models'

const TruckCheckRouter = Router();

/**
 * Retrieve the most recent truch check form from the document database. 
 */
async function getMostRecentTruckCheck() {
    return Form.find({ for: "TruckCheck" }).sort({ _id: -1 }).limit(1);
}

/**
 * Send the questions from the most recent truck check to the client. 
 */
TruckCheckRouter.get('/', async (req, res) => {
    let form;

    try {
        form = (await getMostRecentTruckCheck())[0].questions;
    } catch (err) {
        console.log("[ERR] Unable to locate most recent truck check", err)
        res.status(404).send("Form not found");
    }

    res.status(200).send(form);
});

/**
 * Send the specified truck check to the client. 
 */
TruckCheckRouter.get('/id/:docID', async (req, res) => {
    let dbRes;

    try {
        dbRes = await TruckCheck.findById(req.params.docID);
    } catch (err) {
        console.log("[ERR] Unable to locate document with ID: ", req.params.docID);
        res.status(404).send(`Unable to locate document with ID ${this.params.docID}`);
    }

    res.status(200).send(dbRes);
});

/**
 * Send a list of completed truck check forms to the client. 
 */
TruckCheckRouter.get('/list', async (req, res) => {
    let dbRes;

    try {
        dbRes = await TruckCheck.find({}).select('_id submittedBy dateSubmitted');
    } catch (err) {
        console.log(`[ERR] Error in /truckcheck/list`, err);
        res.status(500).end();
    }

    res.status(200).send(dbRes);
});

/**
 * Post a new completed truck check form to the document database. 
 */
TruckCheckRouter.post('/', async (req, res) => {
    if (!(req.body.submittedBy &&
        req.body.questions &&
        req.body.answers)) {
        res.status(400).send("Bad Request. Expecting body to contain: submittedBy, questions, answers.");
    } else if(!(Array.isArray(req.body.questions) && Array.isArray(req.body.answers))) {
        res.status(400).send("Bad Request. Questions and Answers must be arrays.");
    } else if (req.body.questions.length !== req.body.answers.length) {
        res.status(400).send("Bad Request. Different number of questions and answers.");
    }

    let questions = []
    for (const item in req.body.questions) {
        questions.push({
            question: req.body.questions[item],
            answer: req.body.answers[item]
        });
    }

    const truckCheck = new TruckCheck({
        submittedBy: req.body.submittedBy,
        questions: questions
    });

    try {
        const dbRes = await truckCheck.save();
        console.log(`[INFO] Truck Check posted with ID: ${dbRes._id}`);
        res.status(201).end();
    } catch (err) {
        console.log("[ERR] Unable to post Truck Check", err);
    }
});

export default TruckCheckRouter;