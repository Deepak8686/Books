import mongoose from 'mongoose';

const Schema = mongoose.Schema

const bookSchema = new Schema({
    Book_Id: { type: Number, required: true, unique: true },
    Bookname: { type: String, required: true }, // Book title
    Author: { type: String, required: true },
    Genre: { type: String, required: true },
    UserCreated: { type: Number },
    UserModified: { type: Number }
}, { timestamps: true })

export default mongoose.model('Book', bookSchema);