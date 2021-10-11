import mongoose from 'mongoose';

const PrefixSchema = new mongoose.Schema({
    Prefix: String,
    GuildID: String,
});

export default mongoose.model('prefix', PrefixSchema);