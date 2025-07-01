import { validationResult } from 'express-validator';
import { ErrorResponse } from '../utils/apiResponse.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    throw new ErrorResponse(errorMessages.join(', '), 400);
  }
  next();
};