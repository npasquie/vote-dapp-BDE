const express = require('express')
const app = express()
const port = 3000

app.get('/:vote/:secret', (req, res) => {
    let vote = req.params.vote, secret = req.params.secret

    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
