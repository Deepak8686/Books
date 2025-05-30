import mongoose from 'mongoose';

const Schema = mongoose.Schema

const reviewSchema = new Schema({
    Review_Id: { type: Number, required: true, unique: true },
    Book_Id: { type: String, required: true },
    User_Id: { type: String, required: true },
    Comment: { type: String, required: true },
    Rating: { type: Number, required: true },
    UserCreated: { type: Number },
    UserModified: { type: Number }
}, { timestamps: true })

export default mongoose.model('Review', reviewSchema);