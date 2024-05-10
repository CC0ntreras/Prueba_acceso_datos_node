const express = require('express');
const router = express.Router();
const pool = require('../config.js'); // Importar el pool de conexiones a la base de datos PostgreSQL

// POST /transferencia

router.post('/', async (req, res) => {
    let client; 
    try {

        const { emisor, receptor, monto } = req.body;

        if (emisor === receptor) {
            return res.status(400).json({ error: 'La transferencia entre la misma cuenta no está permitida.' });
        }
        
        client = await pool.connect();
        await client.query('BEGIN');

        
        await client.query('UPDATE usuarios SET balance = balance - $1 WHERE id = $2', [monto, emisor]);
        await client.query('UPDATE usuarios SET balance = balance + $1 WHERE id = $2', [monto, receptor]);

        
        const fecha = new Date().toISOString();
        await client.query('INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, $4)', [emisor, receptor, monto, fecha]);

        
        await client.query('COMMIT');

        
        client.release();

        
        res.status(200).json({ mensaje: 'Transferencia realizada exitosamente.' });
    } catch (error) {
        
        if (client) {
            await client.query('ROLLBACK');

            client.release(); 
        }
        console.error('Error en la transacción:', error);
        res.status(500).json({ error: 'Error al procesar la transferencia.' });
    }
});

// GET /transferencias

router.get('/', async (req, res) => {
    try {
      
        const { rows } = await pool.query(`
        SELECT  t.id, t.fecha, u1.nombre AS nombre_emisor, u2.nombre AS nombre_receptor, t.monto 
        FROM transferencias t 
        JOIN usuarios u1 ON t.emisor = u1.id 
        JOIN usuarios u2 ON t.receptor = u2.id;
        `);
        const formattedRows = rows.map(row => [
            row.id,
            row.nombre_emisor,
            row.nombre_receptor,
            row.monto,
            row.fecha
        ]);
      
        res.status(200).json(formattedRows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las transferencias.' });
    }
});

module.exports = router;
