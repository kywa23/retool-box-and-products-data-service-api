const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/sizes', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        sku,
        weight_g,
        length_mm,
        width_mm,
        height_mm,
        name
      FROM products
      WHERE 
        weight_g IS NOT NULL 
        AND length_mm IS NOT NULL 
        AND width_mm IS NOT NULL 
        AND height_mm IS NOT NULL
      ORDER BY sku
    `);
    
    const formattedData = result.rows.map(row => [
      row.sku,
      row.weight_g,
      row.length_mm,
      row.width_mm,
      row.height_mm
    ]);
    
    res.json({
      success: true,
      count: formattedData.length,
      data: formattedData
    });
  } catch (error) {
    console.error('Error fetching product sizes:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch product sizes',
      message: error.message 
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        sku,
        name,
        weight_g,
        length_mm,
        width_mm,
        height_mm,
        photo,
        additional_sku,
        created_at,
        updated_at
      FROM products
      ORDER BY sku
    `);
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch products',
      message: error.message 
    });
  }
});

router.get('/by-sku', async (req, res) => {
  try {
    const skus = req.query.skus;
    
    if (!skus) {
      return res.status(400).json({ 
        success: false,
        error: 'SKU parameter is required',
        message: 'Use ?skus=SKU1 or ?skus=SKU1,SKU2,SKU3'
      });
    }
    
    const skuArray = skus.split(',').map(s => s.trim());
    
    const result = await db.query(`
      SELECT 
        sku,
        name,
        weight_g,
        length_mm,
        width_mm,
        height_mm,
        photo,
        additional_sku,
        created_at,
        updated_at
      FROM products
      WHERE sku = ANY($1)
      ORDER BY sku
    `, [skuArray]);
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching products by SKU:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch products by SKU',
      message: error.message 
    });
  }
});

module.exports = router;
