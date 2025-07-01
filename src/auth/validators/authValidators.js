import { body } from 'express-validator';

export const registerValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot be more than 50 characters'),
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .toLowerCase()
    .trim(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

export const loginValidator = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .toLowerCase()
    .trim(),
  body('password')
    .notEmpty().withMessage('Password is required')
];