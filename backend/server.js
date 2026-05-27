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

app.post("/api/worlds", (req, res) => {
    console.log(req.body);
    pool.query(`
        INSERT INTO worlds (worldName, description)
        VALUES ($1, $2)
        `, [req.body.worldName, req.body.description], (err, result) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ message: 'World created successfully!' });
        }
    });
});

app.get("/api/worlds", async (req, res) => {
    const worlds = await pool.query('SELECT * FROM worlds');
    res.json(worlds.rows);
});


/*SERVER START*/
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});