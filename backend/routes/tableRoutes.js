const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Create table
router.post('/createTable', (req, res) => {
    const { tableName, columns } = req.body;

    let columnDefinitions = columns.map(col => {
        let definition = `${col.name} ${col.type}`;
        if (col.type !== 'POINT') {
            if (col.pk) definition += ' PRIMARY KEY';
            if (col.nn) definition += ' NOT NULL';
            if (col.uq) definition += ' UNIQUE';
            if (col.binary) definition += ' BINARY';
            if (col.un) definition += ' UNSIGNED';
            if (col.zf) definition += ' ZEROFILL';
            if (col.ai && (col.type.includes('INT') || col.type === 'BIGINT')) definition += ' AUTO_INCREMENT';
        }
        return definition;
    }).join(', ');

    const sql = `CREATE TABLE ${tableName} (${columnDefinitions})`;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(JSON.stringify(result));
        }
    });
});

// Get all tables
router.get('/tables', (req, res) => {
    const sql = `SHOW TABLES`;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(results);
        }
    });
});

// Delete table
router.delete('/tables/:tableName', (req, res) => {
    const { tableName } = req.params;
    const sql = `DROP TABLE IF EXISTS ${tableName}`;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(JSON.stringify(result));
        }
    });
});

// Get columns for a specific table
router.get('/tables/:tableName/columns', (req, res) => {
    const tableName = req.params.tableName;
    const sql = `SHOW COLUMNS FROM ${tableName}`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.json(data);
        }
    });
});

// Add data to a specific table with image upload
router.post('/tables/:tableName/data', upload.single('image'), (req, res) => {
    const tableName = req.params.tableName;
    const { name, description, month, fee } = req.body;
    let image = null;
    if (req.file) {
        image = req.file.filename;
    }

    const sql = `INSERT INTO ${tableName} (name, description, month, fee, image) VALUES (?, ?, ?, ?, ?)`;
    const values = [name, description, month, fee, image];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(JSON.stringify(result));
        }
    });
});

// Get data from a specific table
router.get('/tables/:tableName/data', (req, res) => {
    const tableName = req.params.tableName;
    const sql = `SELECT * FROM ${tableName}`;

    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.json(data);
        }
    });
});

// Update data in a specific table
router.put('/tables/:tableName/data/:id', (req, res) => {
    const tableName = req.params.tableName;
    const id = req.params.id;
    const updatedData = req.body;

    const setClause = Object.keys(updatedData)
        .map(key => `${key} = ?`)
        .join(', ');

    const values = Object.values(updatedData);

    const sql = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
    values.push(id);

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(JSON.stringify(result));
        }
    });
});

// Delete data from a specific table
router.delete('/tables/:tableName/data/:id', (req, res) => {
    const tableName = req.params.tableName;
    const id = req.params.id;

    const sql = `DELETE FROM ${tableName} WHERE id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(JSON.stringify(result));
        }
    });
});

module.exports = router;
