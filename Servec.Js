'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// مسار ملف البيانات
const dataPath = path.join(__dirname, 'data', 'chairs.json');

app.use(cors());
app.use(express.json());

// ====== وظائف مساعدة ======

function readChairs() {
    try {
        const data = fs.readFileSync(dataPath);
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function writeChairs(chairs) {
    fs.writeFileSync(dataPath, JSON.stringify(chairs, null, 2));
}

// ====== ROUTES ======

// GET all chairs
app.get('/chairs', (req, res) => {
    const chairs = readChairs();
    res.json(chairs);
});

// GET chair by id
app.get('/chairs/:id', (req, res) => {
    const chairs = readChairs();
    const chair = chairs.find(c => c.id === parseInt(req.params.id));

    if (!chair) {
        return res.status(404).json({ error: 'Chair not found' });
    }

    res.json(chair);
});

// POST new chair
app.post('/chairs', (req, res) => {
    const chairs = readChairs();
    const newChair = {
        id: chairs.length > 0 ? chairs[chairs.length - 1].id + 1 : 1,
        name: req.body.name,
        color: req.body.color,
        price: req.body.price
    };

    chairs.push(newChair);
    writeChairs(chairs);

    res.status(201).json(newChair);
});

// PUT update chair
app.put('/chairs/:id', (req, res) => {
    const chairs = readChairs();
    const index = chairs.findIndex(c => c.id === parseInt(req.params.id));

    if (index === -1) {
        return res.status(404).json({ error: 'Chair not found' });
    }

    chairs[index] = {
        id: parseInt(req.params.id),
        name: req.body.name,
        color: req.body.color,
        price: req.body.price
    };

    writeChairs(chairs);
    res.json(chairs[index]);
});

// DELETE chair
app.delete('/chairs/:id', (req, res) => {
    let chairs = readChairs();
    chairs = chairs.filter(c => c.id !== parseInt(req.params.id));

    writeChairs(chairs);
    res.status(204).send();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'Mix Backend Alive' });
});

app.listen(PORT, () => {
    console.log(`Mix Server running on port ${PORT}`);
});
