import express from 'express';
import path from 'path';
import { fileURLToPath } from "url";
import pg from "pg";

const app = express();
const PORT = process.env.PORT ||3000;

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.post("/submit", (req, res) => {
    console.log(req.body);
    pool.query(`
        INSERT INTO messages (text)
        VALUES ($1)
        `, [req.body.text], (err, result) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            res.status(500).json({ error: 'Internal server error' });
        messages} else {
            res.json({ message: 'Form submitted successfully!' });
        }
    });
});

app.get("/text", async (req, res) => {
    const text = await pool.query('SELECT text FROM messages');
    res.json(text.rows);
});


/*SERVER START*/
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});