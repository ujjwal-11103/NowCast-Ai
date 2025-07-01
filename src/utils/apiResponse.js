export const sendResponse = (res, statusCode, data, message) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}