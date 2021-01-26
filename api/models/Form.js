import mongoose, { Schema } from 'mongoose';

/**
 * Provides a document model to create an HTML form. 
 */
const FormSchema = new Schema({
    for: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        answerType: {
            type: String,
            required: true
        }
    }]
});

export default mongoose.model('Form', FormSchema, 'form');