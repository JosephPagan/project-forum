const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient= require('mongodb').MongoClient

const connectionString = 'mongodb+srv://yoda:Shadow69@cluster0.cf1zjcw.mongodb.net/?retryWrites=true&w=majority'

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('project-forum')
        const rebirthCollection = db.collection('rebirth-posts')


        app.set('view engine', 'ejs')
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
        app.use(express.static('public'))

        app.get('/', (req, res) => {
            db.collection('rebirth-posts').find().toArray()
                .then(results => {
                    //console.log(results)
                    res.render('index.ejs', { rebirthPosts: results })
                })
                .catch(error => console.log(error))
        })

        app.post('/blogPost', (req, res) => {
            rebirthCollection.insertOne(req.body)
            .then(result => {
                console.log(result)
                res.redirect('/')
            })
            .catch(error => console.log(error))
            //console.log(req.body)
        })

        app.delete('/blogPost', (req, res) => {
            rebirthCollection.deleteOne(
                {name: req.body.name},
            )
            .then(result => {
                if (result.deletedCount === 0) {
                    return res.json('No blank posts at this time')
                }
                res.json('Deleted Blank Post')
                console.log('Blank Deleted')
            })
            .catch(error => console.log(error))
        })

        const PORT = process.env.PORT || 3001
        
        app.listen(PORT, () =>{
            console.log(`The server is running on port ${PORT}!`)
        })

    })
    .catch(error => console.error(error))


