import { DataTypes, Model } from 'sequelize';

/**
 * Provides a model for interacting with an ordinary item in the database.
 * Handles items that can be treated as a group.
 * 
 * @class
 */
export default class OrdinaryItem extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                office_quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                storage_quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                office_threshold: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                storage_threshold: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                img_url: {
                    type: DataTypes.STRING,
                    allowNull: false
                }
            },
            {
                tableName: "ordinary_items",
                modelName: "OrdinaryItem",
                timestamps: false,
                sequelize
            }
        );
    }
}
