const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home')
const authMiddleware = require('../middleware/auth')

router.get('/', authMiddleware.ensureGuest, homeController.getIndex) 

module.exports = router