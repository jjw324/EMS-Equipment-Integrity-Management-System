import { Router } from 'express';
import { rdb } from '../models';

const SpecialItemRouter = Router();
const specialItem = rdb.SpecialItem;

/**
 * Send information about the requested special item to the client. 
 */
SpecialItemRouter.get('/:serialNumber', async (req, res) => {
    try {
        const itemInfo = await specialItem.findAll({ where: { serial_number: req.params.serialNumber } });

        console.log(`Retrieved ${itemInfo.length} record(s) from special items table`);

        if (itemInfo.length === 0) {
            res.status(404).end();
        } else {
            res.status(200).send({ results: itemInfo[0] });
        }
    } catch (err) {
        console.log(`Error in GET /specialitem/:serialNumber: ${err}`);
        res.status(500).end();
    }
});

/**
 * Send the quantity of the requested special item to the client. 
 */
SpecialItemRouter.get('/qty/:itemName', async (req, res) => {
    res.status(500).send("NOT IMPLEMENTED"); //TODO
});

/**
 * Create a new special item in the relational database. 
 */
SpecialItemRouter.post('/', async (req, res) => {
    // TODO: Check each field
    if (
        req.body.hasOwnProperty("serial_number") &&
        req.body.hasOwnProperty("name") &&
        req.body.hasOwnProperty("expiration") &&
        req.body.hasOwnProperty("img_url") &&
        req.body.hasOwnProperty("location")
    ) {
        try {
            const dbResponse = await specialItem.create({
                serial_number: req.body.serial_number,
                name: req.body.name,
                expiration: req.body.expiration,
                img_url: req.body.img_url,
                location: req.body.location
            });

            res.status(201).end();

        } catch (err) {
            // TODO: better handling of 500 vs 400 errors
            console.log(`Error in /specialitem: ${err}`);
            res.status(400).end();
        }
    } else {
        res.status(400).send(`Expected JSON with the following properties: ` +
            `serial_number, name, expiration, img_url, location`);
    }
});

/**
 * Delete the specified item from the reltional database. 
 */
SpecialItemRouter.delete('/:serialNumber', async (req, res) => {
    try {
        const dbResponse = await specialItem.destroy({ where: { serial_number: req.params.serialNumber } });

        console.log(`Special item deleted: ${dbResponse}`);

        res.status(200).end();

    } catch (err) {
        console.log(`Error in DELETE /specialitem/:serialNumber: ${err}`);
        res.status(500).end();
    }
});


/**
 * Change the special item in the relational database to match the changes specified in the request body.
 */
SpecialItemRouter.patch('/:serialNumber', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).send("Empty patch request");
    } else {
        try {
            const dbResponse = await specialItem.update(req.body, { where: { serial_number: req.params.serialNumber } });

            console.log(`Updated ${dbResponse} Special Item(s)`);
            res.status(200).end();

        } catch (err) {
            console.log(`Error in PATCH /specialitem: ${err}`);
            res.status(400).end();
        }
    }
});

export default SpecialItemRouter;