import { Router } from 'express';
import { rdb } from '../models';

const ItemRouter = Router();
const item = rdb.OrdinaryItem;

/**
 * Send the requested item info to the client.
 */
ItemRouter.get('/:itemID', async (req, res) => {
    try {
        const itemInfo = await item.findAll({ where: { id: req.params.itemID } });

        console.log(`Retrieved ${itemInfo.length} record(s) from ordinary items table`);

        if (itemInfo.length === 0) {
            res.status(404).end();
        } else {
            res.status(200).send({ results: itemInfo[0] });
        }

    } catch (err) {
        console.log(`Error in  GET /item/:itemID: ${err}`);
        res.status(500).end();
    }
});

/**
 * Post new ordinary item to the relational database. 
 */
ItemRouter.post('/', async (req, res) => {
    // TODO: Check each field
    if (
        req.body.hasOwnProperty("name") &&
        req.body.hasOwnProperty("office_quantity") &&
        req.body.hasOwnProperty("storage_quantity") &&
        req.body.hasOwnProperty("img_url") &&
        req.body.hasOwnProperty("office_threshold") &&
        req.body.hasOwnProperty("storage_threshold")
    ) {
        try {
            const newItem = await item.create({
                name: req.body.name,
                office_quantity: req.body.office_quantity,
                storage_quantity: req.body.storage_quantity,
                img_url: req.body.img_url,
                office_threshold: req.body.office_threshold,
                storage_threshold: req.body.storage_threshold
            });

            console.log(`Created new item with id: ${newItem.id}`);
            res.status(201).end();

        } catch (err) {
            // todo: better handling of 500 vs 400 errors
            console.log(`Error in POST /item: ${err}`);
            res.status(500).end();
        }
    } else {
        res.status(400).send(`Expected JSON with the following properties: ` +
            `name, office_quantity, storage_quantity, img_url, office_threshold, storage_threshold`);
    }
});

/**
 * Delete the specified ordinary item from the relational database
 */
ItemRouter.delete('/:itemID', async (req, res) => {
    try {
        const dbResponse = await item.destroy({ where: { id: req.params.itemID } });

        console.log(`Item Deleted: ${dbResponse}`);

        res.status(200).end();

    } catch (err) {
        console.log(`Error in DELETE /item/:itemID: ${err}`);
        res.status(500).end();
    }
});

/**
 * Change the item in the relational database to match the changes specified in the request body.
 */
ItemRouter.patch('/:itemID', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).send(`Empty patch request`);
    } else {
        try {
            const dbResponse = await item.update(req.body, { where: { id: req.params.itemID } });

            console.log(`Update ${dbResponse} item(s)`);
            res.status(200).end();

        } catch (err) {
            // TODO: better handling of 500 vs 400 errors
            console.log(`Error in PATCH /item: ${err}`);
            res.status(500).end();
        }
    }
});

export default ItemRouter
