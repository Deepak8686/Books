import express from 'express';
import { AddBooks, AddReview, CreateUser, DeleteReview, EditReview, GetBookById, GetBooks, SearchBooks, UserLogin } from '../Controllers/Controller.js';
import auth from '../Middleware/Middleware.js';

const router = express.Router()

router.post('/login', UserLogin);
router.post('/register', CreateUser);
router.post('/addBooks', auth, AddBooks);
router.get('/getBooks', GetBooks);
router.get('/getBook/:Book_Id', GetBookById);
router.post('/addReview', auth, AddReview);
router.put('/editReview', auth, EditReview);
router.delete('/deleteReview/:Review_Id', auth, DeleteReview);
router.get('/searchBooks', SearchBooks);

export default router;