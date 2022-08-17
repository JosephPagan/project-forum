const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
},
async(accessToken, refreshToken, profile, done) => {
    console.log(profile.id)
    let user = await userCollection.find({googleId: profile.id})
    try{
        if (user) {
            done(null, user)
        } else {
            user = userCollection.insertOne({
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value,
                createdAt: new Date()
            })
            done(null, user)
        }
    } catch (err) {
        console.log(err)
    }
    passport.serializeUser((user, done) => {
        // console.log(user.id)
        done(null, user)
    })
        
    passport.deserializeUser((id, done) => {
        userCollection.findById(id, (err, user) => done(err, user))
    })
}))