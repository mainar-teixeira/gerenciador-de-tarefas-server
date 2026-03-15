const express = require('express');
const mysql = require('mysql2');

require('dotenv').config();

const conexaoBD = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.static("public"));


// LOGIN

app.post('/tarefa', (req, res) => {

    

    const { texto, userID} = req.body;

    
    conexaoBD.query('INSERT INTO tarefa (txt_da_tarefa, concluida, id_usuario) VALUES (?, false, ?)', [ texto, userID ], (err, result) => {
        
        

        if (err) {
           return res.status(500).json({ error: `ERRO: ${err}`});
        }

        res.json({
            id: result.insertId,
            texto
        });
        

    });

});

app.post('/login', (req, res) => {
    const { emailL, senhaL } = req.body;

    conexaoBD.query('SELECT * FROM usuario WHERE email = ? AND senha = ?', [ emailL, senhaL], (err, result) => {
        if (err) {
            res.status(404).json({ error: err});
        } else {
            res.json(result);
        }

        

    });
});

app.post('/loadTarefas', (req, res) => {

    const { userID } = req.body;

    conexaoBD.query('SELECT * FROM tarefa WHERE id_usuario = ?', [ userID ], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json(result);

    });
});

app.delete('/deleteTarefa/:id', (req, res) => {
    const id = req.params.id;

    conexaoBD.query('DELETE FROM tarefa WHERE id_tarefa = ?', [ id ], (err, result) => {
        if (err) {
            return res.status(404).json({ error: `ERRO: ${err}` });
        }

        res.json({ success: true});
    });

});

app.listen(PORT, () => {
    console.log('rodando na porta ' + PORT);
});