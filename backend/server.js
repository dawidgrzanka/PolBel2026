const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: 'localhost', // Zmień na swój host (np. sql88.lh.pl jeśli odblokowałeś IP)
    user: 'root',
    password: '',
    database: 'polbel_db'
}).promise();

const createHandlers = (tableName, route) => {
    // POBIERANIE LISTY
    app.get(`/api/${route}`, async (req, res) => {
        try {
            const [rows] = await db.query(`SELECT * FROM ${tableName} ORDER BY id DESC`);
            // Konwersja pól dla każdego wiersza przed wysłaniem do Reacta
            const fixedRows = rows.map(item => {
                if (item.tags && typeof item.tags === 'string') {
                    try { item.tags = JSON.parse(item.tags); } catch (e) { item.tags = []; }
                }
                // Bardzo ważne: upewnij się, że published wraca jako boolean
                if (item.hasOwnProperty('published')) {
                    item.published = item.published === 1 || item.published === true;
                }
                return item;
            });
            res.json(fixedRows);
        } catch (err) { res.status(500).json({ error: err.message }); }
    });

    // DODAWANIE (POST)
    app.post(`/api/${route}`, async (req, res) => {
        try {
            const data = { ...req.body };
            
            // Konwersja Boolean na 0/1
            if (data.hasOwnProperty('published')) {
                data.published = data.published ? 1 : 0;
            }
            
            // Konwersja Tablic na String JSON
            if (Array.isArray(data.tags)) {
                data.tags = JSON.stringify(data.tags);
            }

            const [result] = await db.query(`INSERT INTO ${tableName} SET ?`, data);
            res.status(201).json({ id: result.insertId, ...req.body });
        } catch (err) { res.status(500).json({ error: err.message }); }
    });

    // EDYCJA (PUT)
    app.put(`/api/${route}/:id`, async (req, res) => {
        try {
            const data = { ...req.body };
            const id = req.params.id;
            delete data.id; // Nie aktualizujemy klucza głównego

            // KLUCZOWA POPRAWKA DLA STATUSU
            if (data.hasOwnProperty('published')) {
                data.published = data.published ? 1 : 0;
            }

            // Konwersja Tablic na String JSON
            if (Array.isArray(data.tags)) {
                data.tags = JSON.stringify(data.tags);
            }

            console.log(`Aktualizacja ${tableName} [ID: ${id}]:`, data);

            await db.query(`UPDATE ${tableName} SET ? WHERE id = ?`, [data, id]);
            res.json({ message: "Zaktualizowano pomyślnie" });
        } catch (err) {
            console.error("Błąd bazy:", err.message);
            res.status(500).json({ error: err.message });
        }
    });

    // USUWANIE
    app.delete(`/api/${route}/:id`, async (req, res) => {
        try {
            await db.query(`DELETE FROM ${tableName} WHERE id = ?`, [req.params.id]);
            res.json({ message: "Usunięto" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    });
};

// Rejestracja
createHandlers('blog_posts', 'posts');
createHandlers('products', 'products');

app.listen(3001, () => console.log('🚀 Serwer PolBel działa na porcie 3001'));