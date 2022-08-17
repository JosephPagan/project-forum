const express = require('express')
const passport = require('passport')
const router = express.Router()

    //ROUTES
router.get('/google', passport.authenticate('google', {scope: ['profile']}))

// Google Auth Callback
// GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
    res.redirect('/dashboard')
})

// LOGOUT USER
// ROUTE /auth/logout
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if(err) { return next(err);}
    })
    res.redirect('/')
})

module.exports = router