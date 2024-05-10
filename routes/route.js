const express = require('express');
const router = express.Router();

//RUTA
const path = require('path');

router.get('/', (req, res) => {
  
  const indexPath = path.join(__dirname, '..', 'index.html');
  res.sendFile(indexPath);
});

module.exports = router;
