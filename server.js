require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { apiKeyAuth } = require('./middleware/auth');

const productsRoutes = require('./routes/products');
const boxesRoutes = require('./routes/boxes');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    service: 'Retool Box and Products Data Service API',
    version: '1.0.0',
    endpoints: {
      products: {
        all: 'GET /api/products',
        sizes: 'GET /api/products/sizes',
        bySku: 'GET /api/products/by-sku?skus=SKU1,SKU2'
      },
      boxes: {
        all: 'GET /api/boxes'
      }
    },
    authentication: process.env.API_KEY ? 'Required (X-API-Key header or api_key query param)' : 'Not required'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/products', apiKeyAuth, productsRoutes);
app.use('/api/boxes', apiKeyAuth, boxesRoutes);

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Data Service API running on port ${PORT}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
  console.log(`🔐 API Key: ${process.env.API_KEY ? 'Required' : 'Not required'}`);
});
