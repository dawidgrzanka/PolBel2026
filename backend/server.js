const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Konfiguracja połączenia z bazą LH.pl
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
 * Funkcja pomocnicza do konwersji danych przed zapisem/odczytem
 */
const transformData = (data, direction = 'toDB') => {
    const result = { ...data };
    
    if (direction === 'toDB') {
        // Zamień items na string, jeśli przychodzą jako obiekt/tablica
        if (result.items && typeof result.items !== 'string') {
            result.items = JSON.stringify(result.items);
        }
        // Upewnij się, że puste daty nie psują zapytania
        if (result.delivery_date === '') result.delivery_date = null;
        
        // Pola boolean (jeśli są)
        ['published', 'featured', 'in_stock'].forEach(f => {
            if (result.hasOwnProperty(f)) result[f] = result[f] ? 1 : 0;
        });
    } else {
        // Parsowanie JSON przy odczycie z bazy
        if (result.items && typeof result.items === 'string') {
            try { result.items = JSON.parse(result.items); } catch (e) { result.items = []; }
        }
        ['published', 'featured', 'in_stock'].forEach(f => {
            if (result.hasOwnProperty(f)) result[f] = result[f] === 1;
        });
    }
    return result;
};

const createHandlers = (tableName, route) => {
    // 1. POBIERANIE LISTY (GET)
    app.get(`/api/${route}`, async (req, res) => {
        try {
            const [rows] = await db.query(`SELECT * FROM ${tableName} ORDER BY id DESC`);
            const fixedRows = rows.map(item => transformData(item, 'fromDB'));
            res.json(fixedRows);
        } catch (err) {
            console.error(`Błąd GET /api/${route}:`, err.message);
            res.status(500).json({ error: err.message });
        }
    });

    // 2. POBIERANIE POJEDYNCZEGO ELEMENTU (GET BY ID/SLUG) - TEGO BRAKOWAŁO!
    app.get(`/api/${route}/:identifier`, async (req, res) => {
        try {
            const id = req.params.identifier;
            // Szukamy albo po ID, albo po polu slug (ważne dla SEO i linków produktu)
            const [rows] = await db.query(
                `SELECT * FROM ${tableName} WHERE id = ? OR slug = ?`, 
                [id, id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ error: "Nie znaleziono rekordu" });
            }

            const fixedRow = transformData(rows[0], 'fromDB');
            res.json(fixedRow);
        } catch (err) {
            console.error(`Błąd GET /api/${route}/${req.params.identifier}:`, err.message);
            res.status(500).json({ error: err.message });
        }
    });

    // 3. DODAWANIE (POST)
    app.post(`/api/${route}`, async (req, res) => {
        try {
            const dataForDB = transformData(req.body, 'toDB');
            const [result] = await db.query(`INSERT INTO ${tableName} SET ?`, dataForDB);
            res.status(201).json({ id: result.insertId, ...req.body });
        } catch (err) {
            console.error(`Błąd POST /api/${route}:`, err.message);
            res.status(500).json({ error: "Błąd zapisu", details: err.message });
        }
    });

    // 4. EDYCJA (PUT)
    app.put(`/api/${route}/:id`, async (req, res) => {
        try {
            const id = req.params.id;
            const dataForDB = transformData(req.body, 'toDB');
            delete dataForDB.id;
            await db.query(`UPDATE ${tableName} SET ? WHERE id = ?`, [dataForDB, id]);
            res.json({ message: "Zaktualizowano pomyślnie" });
        } catch (err) {
            console.error(`Błąd PUT /api/${route}:`, err.message);
            res.status(500).json({ error: err.message });
        }
    });

    // 5. USUWANIE (DELETE)
    app.delete(`/api/${route}/:id`, async (req, res) => {
        try {
            await db.query(`DELETE FROM ${tableName} WHERE id = ?`, [req.params.id]);
            res.json({ message: "Usunięto pomyślnie" });
        } catch (err) {
            console.error(`Błąd DELETE /api/${route}:`, err.message);
            res.status(500).json({ error: err.message });
        }
    });
};

// Rejestracja tras
createHandlers('blog_posts', 'posts');
createHandlers('products', 'products');
createHandlers('orders', 'orders');

app.use((req, res) => {
    res.status(404).json({ error: `Ścieżka ${req.originalUrl} nie istnieje.` });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Serwer PolBel gotowy na porcie ${PORT}`);
});