const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();



const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.connect()
  .then(() => console.log("Conectado ao banco"))
  .catch(err => console.error("Erro ao conectar no banco:", err));

app.use(express.json());
app.use(express.static("docs"));


// ADICIONAR TAREFA
app.post('/tarefa', async (req, res) => {

    const { texto, userID } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO tarefa (txt_da_tarefa, concluida, id_usuario) VALUES ($1, false, $2) RETURNING id_tarefa',
            [texto, userID]
        );

        res.json({
            id: result.rows[0].id_tarefa,
            texto
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});


// LOGIN
app.post('/login', async (req, res) => {

    const { emailL, senhaL } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM usuario WHERE email = $1 AND senha = $2',
            [emailL, senhaL]
        );

        res.json(result.rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});


// CARREGAR TAREFAS
app.post('/loadTarefas', async (req, res) => {

    const { userID } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM tarefa WHERE id_usuario = $1',
            [userID]
        );

        res.json(result.rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});


// DELETAR TAREFA
app.delete('/deleteTarefa/:id', async (req, res) => {

    const id = req.params.id;

    try {
        await pool.query(
            'DELETE FROM tarefa WHERE id_tarefa = $1',
            [id]
        );

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});


app.listen(PORT, () => {
    console.log('rodando na porta ' + PORT);
});
