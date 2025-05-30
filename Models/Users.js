import mongoose from 'mongoose';

const Schema = mongoose.Schema

const userSchema = new Schema({
    User_Id: { type: Number, required: true, unique: true },
    Firstname: { type: String, required: true },
    Lastname: { type: String, required: true },
    Email_Id: { type: String, required: true },
    ContactNo: { type: String, required: true },
    password: { type: String, required: true },
    IsActive: { type: Boolean },
    UserCreated: { type: Number },
    UserModified: { type: Number }
}, { timestamps: true })

export default mongoose.model('User', userSchema);