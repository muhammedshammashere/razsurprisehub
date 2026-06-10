import { ApiError } from '../utils/ApiError.js';

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Not found - ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
