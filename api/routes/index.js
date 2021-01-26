import { Router } from 'express';
import ItemRouter from './Item';
import SpecialItemRouter from './SpecialItem'
import CheckRouter from './Check';
import TruckCheckRouter from './TruckCheck';
import CallLogRouter from './CallLog';
import AdminRouter from './Admin';

const apiRouter = Router();

apiRouter.use('/item', ItemRouter)
    .use('/specialitem', SpecialItemRouter)
    .use('/check', CheckRouter)
    .use('/truckcheck', TruckCheckRouter)
    .use('/calllog', CallLogRouter)
    .use('/admin', AdminRouter);

apiRouter.get('/', (req, res) => {
    res.status(200).send(`Test page with request querystring:\n${JSON.stringify(req.query)}`);
});

export default apiRouter;