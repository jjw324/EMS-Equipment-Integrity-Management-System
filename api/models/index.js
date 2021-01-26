import Sequelize from 'sequelize';
import OrdinaryItem from './OrdinaryItem';
import SpecialItem from './SpecialItem';
import Form from './Form';
import { TruckCheck, CallLog } from './CompletedForm';
import InventoryUpdate from './InventoryUpdate';

const RDBHOST = process.env.RDBHOST || 'localhost';
const RDBUSER = process.env.RDBUSER || 'user';
const RDBPASS = process.env.RDBPASS || 'password';
const RDBDATA = process.env.RDBDATA || 'database';

const rdbConnection = new Sequelize(RDBDATA, RDBUSER, RDBPASS, {
    host: RDBHOST,
    dialect: 'mysql',
    logging: false
});

const models = {
    OrdinaryItem: OrdinaryItem.init(rdbConnection),
    SpecialItem: SpecialItem.init(rdbConnection)
};

const rdb = {
    ...models,
    connection: rdbConnection
};

const ddb = {
    Form,
    TruckCheck,
    CallLog,
    InventoryUpdate
}

export {
    rdb,
    ddb
}