const tokenExtractor = (request, response, next) => {
  const auth = request.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    request.token = auth.substring(7);
  }
  next()
}

const errorHandler = (error, request, response, next) => {
  
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
   else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'viallinen token'
    })
   }
    next(error)
  }
  
  
  
  
  module.exports = {
    tokenExtractor,
    errorHandler  
  }