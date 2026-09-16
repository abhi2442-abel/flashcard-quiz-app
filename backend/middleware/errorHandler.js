// Error handling middleware
const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`\n❌ ERROR: ${message}`);
    console.error(err);
  }

  // Handle MongoDB validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: {
        status: 400,
        message: 'Validation Error',
        details: messages
      }
    });
  }

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      error: {
        status: 400,
        message: 'Duplicate field value entered'
      }
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: {
        status: 401,
        message: 'Invalid token'
      }
    });
  }

  res.status(status).json({
    error: {
      status,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;
