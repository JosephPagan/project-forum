const express = require('express')
const session = require('express-session')
const app = express()
const connectDB = require('./config/db')

const homeRoutes = require('./routes/home')
const authRoutes = require('./routes/auth')
const dashRoutes = require('./routes/dashboard')

const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')
const passport = require('passport')
const MongoStore = require('connect-mongo')
const path = require('path')
const PORT = process.env.PORT || 3001

dotenv.config({ path: './config/config.env' })

require('./config/passport')(passport)

connectDB()

//MIDDLEWARE
app.use(cors())
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({ secret: 'cats', resave: false, saveUninitialized: false,  store: MongoStore.create({mongoUrl: process.env.MONGO_URI}) }))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', homeRoutes)
app.use('/auth', authRoutes)
app.use('/dashboard', dashRoutes)


app.listen(PORT, () =>{
    console.log(`The server is running on port ${PORT}!`)
})



