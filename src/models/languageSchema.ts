import mongoose from 'mongoose';

const requiredString = {
    type: String,
    required: true,
};

const languageSchema = new mongoose.Schema({
    _id: requiredString,
    language: requiredString,
});

export default mongoose.model('languages', languageSchema);
