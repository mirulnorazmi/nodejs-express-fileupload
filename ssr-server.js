const express = require('express')
const next = require('next')
const fileupload = require('express-fileupload')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev , fileupload })
const handle = app.getRequestHandler()

app.prepare()
    .then(() => {
        const server = express()

        server.get('*', (req, res) => {
            res.json(console.log({
                succes: "dsdds"
            }))
            return handle(req, res)
        })

        server.get('/p/:id', (req, res) => {
            const actualPage = '/post'
            const queryParams = { id: req.params.id }
            app.render(req, res, actualPage, queryParams)
        })

        server.listen(3000, (err) => {
            if (err) throw err
            console.log('> Ready on http://localhost:3000')
        })
    })
    .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
    })