import mongoose, { Schema } from 'mongoose';

/**
 * Provides a document model format for a completed form. 
 */
const CompletedFormSchema = new Schema({
    submittedBy: {
        type: String,
        required: true
    },
    dateSubmitted: {
        type: Date,
        default: Date.now
    },
    questions: [{
        question: String,
        answer: String
    }]
});

const TruckCheck = mongoose.model('TruckCheck', CompletedFormSchema, 'truckcheck');
const CallLog = mongoose.model('CallLog', CompletedFormSchema, 'calllog');

export {
    TruckCheck,
    CallLog
}