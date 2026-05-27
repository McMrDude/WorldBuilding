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
    try {
        console.log(req.body);

        if (!req.body.worldName || !req.body.description) {
            return res.status(400).json({ error: "Missing fields" });
        }

        pool.query(`
            INSERT INTO worlds (worldName, description)
            VALUES ($1, $2)
            `, [req.body.worldName, req.body.description], (err, result) => {
            
        });
        res.json({ message: "World created" });
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
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