const express = require('express')
const session = require('express-session')
const app = express()
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' })
const mongoose = require('mongoose')
const MongoClient= require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;
const cors = require('cors')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MongoStore = require('connect-mongo')
const path = require('path')
const PORT = process.env.PORT || 3001
const connectionString = 'mongodb+srv://yoda:Shadow69@cluster0.cf1zjcw.mongodb.net/?retryWrites=true&w=majority'


MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')

const db = client.db('project-forum')
const db2 = client.db('test')
const rebirthCollection = db.collection('rebirth-posts')
const userCollection = db.collection('userData')
const sessionCollection = db2.collection('users')

const ensureAuth = function (req, res, next) {
    // console.log('Ensure Auth Result: ' + req.isAuthenticated())
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/')
    }
}
const ensureGuest = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard')
    } else {
        return next()
    }
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
},
async(accessToken, refreshToken, profile, done) => {
    console.log(profile)
    try{
        userCollection.findOne({googleId: profile.id}, function(err, doc) {
            if (doc) {
                console.log(doc)
                done(null, doc)
            } else {
                doc = userCollection.insertOne({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[0].value,
                    createdAt: new Date()
                })
                done(null, doc)
            }
        })
    } catch (err) {
        console.log(err)
    }
    passport.serializeUser((user, done) => {
        done(null, user)
    })
    passport.deserializeUser(function(user, done) {
        done(null, user)
    })
    // passport.deserializeUser((id, done) => {
    //     sessionCollection.findOne({_id: id}, (err, user) => done(err, user))
    // })
}))

//MIDDLEWARE
app.use(cors())
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))



app.use(session({ secret: 'cats', resave: false, saveUninitialized: false,  store: MongoStore.create({mongoUrl: process.env.MONGO_URI}) }))
app.use(passport.initialize())
app.use(passport.session())

 
    
    //ROUTES
    app.get('/auth/google', passport.authenticate('google', {scope: ['profile']}))

    // Google Auth Callback
    // GET /auth/google/callback
    app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
        res.redirect('/dashboard')
    })

    // LOGOUT USER
    // ROUTE /auth/logout
    app.get('/logout', (req, res) => {
        req.logout(function(err) {
            if(err) { return next(err);}
        })
        res.redirect('/')
    })

    app.get('/', ensureGuest, (req, res) => {
        res.render('login.ejs')
    })
    
    app.get('/dashboard', ensureAuth, async (req, res) => {
        const data = await rebirthCollection.find().toArray()
        try {
            console.log(req)
            res.render('index.ejs', {rebirthPosts: data, name: req.user.firstName})
        } catch (err) {
            console.log(err)
        }
    })

    app.post('/blogPost', (req, res) => {
        rebirthCollection.insertOne({name: req.body.name, message: req.body.message, link: req.body.link, likes: 0})
        .then(result => {
            console.log(result)
            res.redirect('/')
        })
        .catch(error => console.log(error))
        //console.log(req.body)
    })

    app.put('/addOneLike', (request, response) => {
        rebirthCollection.updateOne({_id: new ObjectId(request.body.ObjectId)},{
            $set: {
                likes: request.body.likesS + 1
                }
        })
        .then(result => {
            // console.log('Added One Like')
            response.json('Like Added')
        })
        .catch(error => console.error(error))
    })

    app.delete('/deletePost', (request, response) => {
        // console.log(request.body.ObjectId)
        rebirthCollection.deleteOne( { _id: new ObjectId(request.body.ObjectId) } )
        .then(result => {
            console.log('Post Deleted')
            response.json('Post Deleted')
        })
        .catch(error => console.error(error))
    })

    app.listen(PORT, () =>{
        console.log(`The server is running on port ${PORT}!`)
    })
})
.catch(error => console.error(error))


