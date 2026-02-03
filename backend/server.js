const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: 'sql88.lh.pl',
    user: 'serwer169064_companymsproduction',
    password: 'Djdawid6!',
    database: 'serwer169064_companymsproduction',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

/**
 * Middleware: Sprawdza czy żądanie pochodzi od zalogowanego admina
 */
const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== 'Bearer polbel-admin-session-secure-token') {
        return res.status(403).json({ message: 'Brak uprawnień. Zaloguj się jako administrator.' });
    }
    next();
};

const transformData = (data, direction = 'toDB') => {
    const result = { ...data };
    if (direction === 'toDB') {
        if (result.items && typeof result.items !== 'string') result.items = JSON.stringify(result.items);
        if (result.delivery_date === '') result.delivery_date = null;
        ['published', 'featured', 'in_stock'].forEach(f => {
            if (result.hasOwnProperty(f)) result[f] = result[f] ? 1 : 0;
        });
    } else {
        if (result.items && typeof result.items === 'string') {
            try { result.items = JSON.parse(result.items); } catch (e) { result.items = []; }
        }
        ['published', 'featured', 'in_stock'].forEach(f => {
            if (result.hasOwnProperty(f)) result[f] = result[f] === 1;
        });
    }
    return result;
};

// --- AUTH ENDPOINTS ---

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM admin_users WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ message: 'Niepoprawny e-mail lub hasło' });

        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch) return res.status(401).json({ message: 'Niepoprawny e-mail lub hasło' });

        res.json({ 
            token: 'polbel-admin-session-secure-token', 
            user: { id: rows[0].id, name: rows[0].name, email: rows[0].email } 
        });
    } catch (err) {
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

app.post('/api/auth/register-admin', verifyAdmin, async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const [existing] = await db.query('SELECT id FROM admin_users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: 'Email zajęty' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO admin_users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        res.status(201).json({ message: 'Admin dodany' });
    } catch (err) {
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

app.get('/api/auth/admins', verifyAdmin, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, email, created_at FROM admin_users ORDER BY id DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/auth/admins/:id', verifyAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM admin_users WHERE id = ?', [req.params.id]);
        res.json({ message: 'Usunięto' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- DYNAMIC HANDLERS ---
const createHandlers = (tableName, route) => {
    app.get(`/api/${route}`, async (req, res) => {
        try {
            const [rows] = await db.query(`SELECT * FROM ${tableName} ORDER BY id DESC`);
            res.json(rows.map(item => transformData(item, 'fromDB')));
        } catch (err) { res.status(500).json({ error: err.message }); }
    });
    // ... reszta Twoich handlerów post/put/delete pozostaje bez zmian
    app.post(`/api/${route}`, async (req, res) => {
        try {
            const dataForDB = transformData(req.body, 'toDB');
            const [result] = await db.query(`INSERT INTO ${tableName} SET ?`, dataForDB);
            res.status(201).json({ id: result.insertId, ...req.body });
        } catch (err) { res.status(500).json({ error: err.message }); }
    });
    app.put(`/api/${route}/:id`, async (req, res) => {
        try {
            const dataForDB = transformData(req.body, 'toDB');
            delete dataForDB.id;
            await db.query(`UPDATE ${tableName} SET ? WHERE id = ?`, [dataForDB, req.params.id]);
            res.json({ message: "Zaktualizowano" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    });
    app.delete(`/api/${route}/:id`, async (req, res) => {
        try {
            await db.query(`DELETE FROM ${tableName} WHERE id = ?`, [req.params.id]);
            res.json({ message: "Usunięto" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    });
};

createHandlers('blog_posts', 'posts');
createHandlers('products', 'products');
createHandlers('orders', 'orders');

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Serwer PolBel gotowy na porcie ${PORT}`));