import { DataTypes, Model } from 'sequelize';

/**
 * Provides a model for interacting with special item records in the database.
 * Handles items that need to be tracked individually.
 * 
 * @class
 */
export default class SpecialItem extends Model {
    static init(sequelize) {
        return super.init(
            {
                serial_number: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                img_url: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                expiration: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                location: {
                    type: DataTypes.STRING,
                    allowNull: false
                }
            },
            {
                tableName: "special_items",
                modelName: "SpecialItem",
                timestamps: false,
                sequelize
            }
        );
    }
}
