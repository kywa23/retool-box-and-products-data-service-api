const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!process.env.API_KEY) {
    return next();
  }
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'API key is required',
      message: 'Provide API key in X-API-Key header or api_key query parameter'
    });
  }
  
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ 
      error: 'Invalid API key' 
    });
  }
  
  next();
};

module.exports = { apiKeyAuth };
