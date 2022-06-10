const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient= require('mongodb').MongoClient
const cors = require('cors')
const PORT = process.env.PORT || 3001

const connectionString = 'mongodb+srv://yoda:Shadow69@cluster0.cf1zjcw.mongodb.net/?retryWrites=true&w=majority'

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('project-forum')
        const rebirthCollection = db.collection('rebirth-posts')

        app.use(cors())
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
            rebirthCollection.insertOne({name: req.body.name, message: req.body.message, likes: 0})
            .then(result => {
                console.log(result)
                res.redirect('/')
            })
            .catch(error => console.log(error))
            //console.log(req.body)
        })

        app.put('/addOneLike', (request, response) => {
            db.collection('rebirth-posts').updateOne({name: request.body.nameS, message: request.body.messageS, likes: request.body.likesS},{
                $set: {
                    likes:request.body.likesS + 1
                  }
            },{
                sort: {_id: -1},
                upsert: true
            })
            .then(result => {
                console.log('Added One Like')
                response.json('Like Added')
            })
            .catch(error => console.error(error))
        
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

        app.listen(PORT, () =>{
            console.log(`The server is running on port ${PORT}!`)
        })

    })
    .catch(error => console.error(error))


