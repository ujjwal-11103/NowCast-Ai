import express from 'express';
import { sendResponse } from '../utils/apiResponse.js';

const router = express.Router();

router.get('/health', (req, res) => {
  sendResponse(res, 200, { status: 'OK' }, 'Service is healthy');
});

export default router;