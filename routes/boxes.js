const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        sku,
        name,
        length_cm,
        width_cm,
        height_cm,
        weight_limit_kg,
        price_nova_poshta,
        price_ukr_poshta,
        created_at,
        updated_at
      FROM boxes
      ORDER BY name
    `);
    
    const formattedData = result.rows.map(row => ({
      name: row.name,
      dimensions: {
        length: row.length_cm,
        width: row.width_cm,
        height: row.height_cm
      },
      weightLimit: row.weight_limit_kg,
      prices: {
        novaPoshta: row.price_nova_poshta,
        ukrPoshta: row.price_ukr_poshta
      },
      sku: row.sku
    }));
    
    res.json({
      success: true,
      count: formattedData.length,
      data: formattedData
    });
  } catch (error) {
    if (error.code === '42P01') {
      return res.status(503).json({
        success: false,
        error: 'Boxes table not created yet',
        message: 'Table "boxes" does not exist. Please create it first.',
        fallback: 'Use Google Sheets as data source'
      });
    }
    
    console.error('Error fetching boxes:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch boxes',
      message: error.message 
    });
  }
});

module.exports = router;
