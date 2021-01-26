import mongoose, { Schema } from 'mongoose';

/**
 * Provides a document model for recording transactions in the inventory database.
 */
const InventoryUpdate = new Schema({
    submittedBy: {
        type: String,
        required: true
    },
    dateSubmitted: {
        type: Date,
        default: Date.now
    },
    appliedToInventoryDatabase: {
        didApply: {
            type: Boolean,
            required: true
        },
        failureReason: String        
    },
    ordinary_items: [{
        id: Number,
        quantity: Number,
        source: String,
        destination: String,
        comment: String
    }],
    special_items: [{
        serial_number: Number,
        source: String,
        destination: String,
        comment: String
    }]
});

export default mongoose.model('InventoryUpdate', InventoryUpdate);
