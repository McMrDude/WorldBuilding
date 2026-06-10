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

app.post("/api/worlds", async (req, res) => {
    try {
        console.log(req.body);

        if (!req.body.worldName || !req.body.description) {
            return res.status(400).json({ error: "Missing fields" });
        }

        await pool.query(`
            INSERT INTO worlds (worldname, description)
            VALUES ($1, $2)
            `, [req.body.worldName, req.body.description]);

        res.json({ message: "World created" });
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get("/api/worlds/:id", async (req, res) => {
    const result = await pool.query(
        'SELECT * FROM worlds WHERE id = $1', 
        [req.params.id]
    );

    console.log(req.params.id);
    console.log(result.rows);

    res.json(result.rows[0]);
});

app.get("/api/worlds", async (req, res) => {
    const worlds = await pool.query('SELECT * FROM worlds');
    res.json(worlds.rows);
});


app.post("/api/characters", async (req, res) => {
    try {
        console.log(req.body);

        if (!req.body.name) {
            return res.status(400).json({ error: "Missing fields" });
        }

        await pool.query(`
            INSERT INTO characters (img, name, race, age, description, world_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            `, [req.body.imageUrl, req.body.name, req.body.race, req.body.age, req.body.description, req.body.id]);

        res.json({ message: "Character created" });
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get("/api/characters", async (req, res) => {
    const result = await pool.query(
        'SELECT * FROM characters', 
    );

    res.json(result.rows);
});
app.get("/api/characters/:characterID", async (req, res) => {
    const result = await pool.query(
        'SELECT * FROM characters WHERE id = $1',
        [req.params.characterID]
    );

    res.json(result.rows[0]);
});
app.put("/api/characters/:characterID", async (req, res) => {
    try {
        await pool.query(
            `UPDATE characters
            SET lore = $1
            WHERE id = $2`,
            [req.body.lore, req.params.characterID]
        );

        console.log(req.body.lore);

        res.json({ success: true });
    } catch (error) {
        console.error('Big error altsa:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/*SERVER START*/
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});