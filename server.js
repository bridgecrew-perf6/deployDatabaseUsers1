const pool = require('./connection.js');
const express = require('express');
const morgan = require('morgan');
const app = express();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

pool.connect();

app.use(express.json());
app.use(morgan('dev'))

app.get('/users', async (req, res, next) => {
    try {
        const data = await pool.query('SELECT * FROM usertest;')
        if (data.rowCount === 0) { return next() }
        res.status(200)
        res.setHeader('Content-Type', 'application/json')
        res.json(data.rows)
    } catch (error) {
        console.log(error.message)
    }

})

app.get('/users/:id', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM usertest WHERE id = $1;', [req.params.id])
        res.status(200)
        res.setHeader('Content-Type', 'application/json')
        res.json(data.rows)
    } catch (error) {
        console.log(error.message)
    }
})

app.post('/users', async (req, res) => {
    try {
        let name = req.body.name;
        let age = req.body.age;
        let email = req.body.email;

        let data = await pool.query(`INSERT INTO usertest(name, age, email) VALUES ($1, $2, $3)`, [name, age, email])
        res.status(200)
        res.setHeader('Content-Type', 'application/json')
        res.json(`New user name: ${name}, age: ${age}, email: ${email} was created!`)

    } catch (error) {
        console.log(error.message);

    }
})

app.patch('/users/:id', async (req, res, next) => {
    try {
        let name = req.body.name;
        let age = req.body.age;
        let email = req.body.email;
        let id = req.params.id;
        if (!name || !age || !email || !Number(id)) { return next() }
        let data = await pool.query(`UPDATE usertest SET name = $1, age = $2, email = $3 WHERE id = $4`, [name, age, email, id])

        res.status(200)
        res.setHeader('Content-Type', 'application/json')
        res.send(`User at index #${id} was updated successfully!`)

    } catch (error) {
        console.log(error.message);

    }
})

app.delete('/users/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        if (!Number(id)) { return next() }

        let data = await pool.query(`DELETE FROM usertest WHERE id = ${req.params.id};`)
        if (data.rowCount === 0) { return next() }
        res.status(200)
        res.setHeader('Content-Type', 'application/json')
        res.send(`User at index ${req.params.id} was deleted successfully!`)
    } catch (error) {
        console.log(error.message);

    }
})

app.use((req, res) => {
    res.status(404);
    res.setHeader('content-type', 'text/plain')
    res.send('Not Found')
})