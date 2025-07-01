import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { registerValidator, loginValidator } from '../validators/authValidators.js';
import {validateRequest} from '../../middleware/validateRequest.js';

const router = express.Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.get('/me', protect, getMe);

export default router;