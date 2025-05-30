import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import User from '../Models/Users.js';
import Book from '../Models/Book.js';
import Review from '../Models/Review.js';
dotenv.config();

export const CreateUser = async (req, res) => {
    try {
        const { Firstname, Lastname, Email_Id, ContactNo, password } = req.body;

        const existingmail = await User.findOne({ Email_Id });
        const existingcontact = await User.findOne({ ContactNo });

        const hasedPassword = await bcrypt.hash(password, 12);
        if (existingmail) return (res.status(400).json({ message: "Email already exists" }));
        if (existingcontact) return (res.status(400).json({ message: "Contact No already exists" }));
        const lastUser = await User.findOne().sort({ User_Id: -1 });
        const newUserId = lastUser ? lastUser.User_Id + 1 : 1;
        await User.create({
            User_Id: newUserId, Firstname, Lastname, Email_Id, ContactNo,
            password: hasedPassword, IsActive: true
        });
        return res.status(200).json({ message: "User created success" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const UserLogin = async (req, res) => {

    const { Email_Id, ContactNo, password } = req.body;

    try {
        const existingUser = Email_Id == undefined ? await User.findOne({ ContactNo }) :
            ContactNo == undefined ? await User.findOne({ Email_Id }) : undefined;
        if (!existingUser) return res.status(400).json({ message: "Email or Contact not registered" });

        if (!existingUser?.IsActive) return res.status(400).json({ message: "Deactivated User Login" });

        const hasedPassword = await bcrypt.compare(password, existingUser.password);
        if (hasedPassword == true) {
            const token = jwt.sign({ userId: existingUser.User_Id, id: existingUser._id, role: existingUser.Role_Id, DateTime: new Date().toISOString() }, 'FirstJwtTokenCreation', { expiresIn: '8h' });
            return res.status(200).json({ userId: existingUser._id, token, message: `${existingUser.Firstname + " " + existingUser.Lastname}, You are Logged in successfully` });
        } else {
            return res.status(400).json({ message: "Incorrect Password" });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const AddBooks = async (req, res) => {
    try {
        const { Bookname, Author, Genre } = req.body
        const lastBook = await Book.findOne().sort({ Book_Id: -1 });
        const newBookId = lastBook ? lastBook.Book_Id + 1 : 1;
        await Book.create({ Book_Id: newBookId, Bookname, Author, Genre });
        return res.status(200).json({ message: 'Book added success' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const GetBooks = async (req, res) => {
    try {
        const { Author, Genre, page = 1, limit = 10 } = req.query;
        const query = {};
        if (Author) query.Author = Author;
        if (Genre) query.Genre = Genre;
        const books = await Book.find(query).skip((page - 1) * limit).limit(limit);
        return res.json(books);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const GetBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        const avgRating = await Review.aggregate([
            { $match: { Book_Id: book.Book_Id } },
            { $group: { Book_Id: null, avg: { $avg: "$Rating" } } }
        ]);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const reviews = await Review.find({ Book_Id: book.Book_Id }).skip((page - 1) * limit).limit(limit);
        return res.json({ book, averageRating: avgRating[0]?.avg || 0, reviews });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const AddReview = async (req, res) => {
    try {
        const { Book_Id, User_Id, Comment, Rating } = req.body
        const exists = await Review.findOne({ User_Id, Book_Id });
        if (exists) return res.status(400).json({ message: 'Already reviewed' });
        await Review.create({ User_Id, Book_Id, Comment, Rating });
        return res.status(200).json({ message: 'Review added success' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const EditReview = async (req, res) => {
    try {
        const { Review_Id, User_Id, Comment, Rating } = req.body
        const review = await Review.findById(Review_Id);
        if (!review || review.User_Id.toString() !== User_Id) return res.status(400).json({ message: 'Unknown error' });
        await Review.findOneandUpdate({ Review_Id }, { Comment, Rating });
        return res.status(200).json({ message: 'Review updated success' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const DeleteReview = async (req, res) => {
    try {
        const { Review_Id } = req.params
        await Review.findOneandDelete({ Review_Id });
        return res.status(200).json({ message: "Review removed" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const SearchBooks = async (req, res) => {
    try {
        const { q } = req.query;
        const books = await Book.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { author: { $regex: q, $options: 'i' } }
            ]
        });
        return res.json(books);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}