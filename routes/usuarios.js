const express = require('express');
const router = express.Router();
const pool = require('../config.js');

// POST /usuario
router.post('/', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { nombre, balance } = req.body;
        const result = await client.query('INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *', [nombre, balance]);
        await client.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Error al registrar el nuevo usuario.' });
    } finally {
        client.release();
    }
});

// GET /usuarios (no necesita transacción)
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM usuarios');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios.' });
    }
});

// PUT /usuario/:id
router.put('/', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.query;
        const { name, balance } = req.body;
        await client.query('UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3', [name, balance, id]);
        await client.query('COMMIT');
        res.status(200).json({ mensaje: 'Usuario actualizado correctamente.' });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Error al actualizar el usuario.' });
    } finally {
        client.release();
    }
});

// DELETE /usuario/:id
router.delete('/', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.query;
        await client.query('DELETE FROM usuarios WHERE id = $1', [id]);
        await client.query('COMMIT');
        res.status(200).json({ mensaje: 'Usuario eliminado correctamente.' });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Error al eliminar el usuario.' });
    } finally {
        client.release();
    }
});

module.exports = router;
