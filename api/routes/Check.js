import { Router } from 'express';
import { rdb } from '../models';
import { Sequelize, Op } from 'sequelize';

const CheckRouter = Router();

/**
 * Send an object containing a list of Ordinary Items and a list of Special Items to the client. 
 */
CheckRouter.get('/allitems', async (req, res) => {
    const ordQuery = rdb.OrdinaryItem.findAll();

    const specialQuery = rdb.SpecialItem.findAll();

    try {
        const queryResults = await Promise.all([ordQuery, specialQuery]);

        console.log(`Retrieved ${queryResults[0].length} records from ordinary items table and ${queryResults[1].length} from special items table`);

        const results = { results: { ordinary_items: queryResults[0], special_items: queryResults[1] } };
        res.status(200).send(results);

    } catch (err) {
        console.log(`Error in GET /item: ${err}`);
        res.status(500).end();
    }
});

/**
 * Send a list of items that expire within the specified timeframe.
 * Passing the parameter expired=true will send a list of items that have already expired.
 * From: start of the interval, in number of months from today
 * Until: end of the interval, in number of months from today
 */
CheckRouter.get('/expiration', async (req, res) => {
    const from = parseInt(req.query.from) || -1,
        until = parseInt(req.query.until) || -1;
    let query;

    if (req.query.expired) {
        query = {
            where: {
                expiration: {
                    [Op.lte]: new Date()
                }
            }
        }
    } else if (from >= 0 && until >= 0 && from < until) {
        let fromDate = new Date();
        let untilDate = new Date();
        fromDate.setMonth(fromDate.getMonth() + from);
        untilDate.setMonth(untilDate.getMonth() + until);
        
        query = {
            where: {
                expiration: {
                    [Op.and]: {
                        [Op.gt]: fromDate,
                        [Op.lte]: untilDate
                    }
                }
            }
        };
    } else if (until >= 0) {
        let untilDate = new Date();
        untilDate.setMonth(untilDate.getMonth() + until);

        query = {
            where: {
                expiration: {
                    [Op.and]: {
                        [Op.gt]: new Date(),
                        [Op.lte]: untilDate
                    }
                }
            }
        };
    }

    if (query) {
        try {
            const dbResponse = await rdb.SpecialItem.findAll(query);
            res.status(200).send({ results: dbResponse });
        } catch (err) {
            console.log(`Error in GET /check/expiration: ${err}`);
            res.status(500).end();
        }
    } else {
        res.status(400).end();
    }
});

/**
 * Sends an object containing a list of items that are low and a list of items that are out of stock in the storage unit
 * Low is determined by if the quantity is less than the user-defined threshold. 
 */
CheckRouter.get('/storage', async (req, res) => {
    try {
        const dbResponse = await rdb.OrdinaryItem.findAll({
            where: {
                storage_quantity: {
                    [Op.lte]: Sequelize.col('storage_threshold')
                }
            }
        });

        let low = dbResponse.filter(item => item.storage_quantity >= 2);
        let out = dbResponse.filter(item => item.storage_quantity < 2);

        res.status(200).send({ results: {low: low, out: out} });

    } catch (err) {
        console.log(`Error in GET /check/storage: ${err}`);
        res.status(500).end();
    }
});

/**
 * Sends an object containing a list of items that are low and a list of items that are out of stock in the office
 * Low is determined by if the quantity is less than the user-defined threshold. 
 */
CheckRouter.get('/office', async (req, res) => {
    try {
        const dbResponse = await rdb.OrdinaryItem.findAll({
            where: {
                office_quantity: {
                    [Op.lte]: Sequelize.col('office_threshold')
                }
            }
        });

        let low = dbResponse.filter(item => item.office_quantity >= 2);
        let out = dbResponse.filter(item => item.office_quantity < 2);

        res.status(200).send({ results: {low: low, out: out} });

    } catch (err) {
        console.log(`Error in GET /check/office: ${err}`);
        res.status(500).end();
    }
});

/**
 * Sends a list of all item names to the client. 
 */
CheckRouter.get('/listitem', async (req, res) => {
    const dbResponse = await rdb.OrdinaryItem.findAll({ attributes: ['name'] });

    console.log(`Retrieved ${dbResponse.length} record(s) from ordinary_items table`);

    const onlyNames = dbResponse.map(item => item.name);

    res.status(200).send({results: onlyNames});
});

/**
 * Sends a list of all special items to the client.
 */
CheckRouter.get('/listspecial', async (req, res) => {
    const dbResponse = await rdb.SpecialItem.findAll({
        attributes: ['name'],
        group: ['name']
    });

    console.log(`Retrieved ${dbResponse.length} record(s) from special_items table`);
    const onlyNames = dbResponse.map(item => item.name);

    res.status(200).send({ results: onlyNames });
});

export default CheckRouter;