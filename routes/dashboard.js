const express = require('express')
const router = express.Router()
const dashController = require('../controllers/dashboard')
const auth = require('../middleware/auth')
const authMiddleware = require('../middleware/auth')

router.get('/', authMiddleware.ensureAuth, dashController.getPosts)

router.post('/blogPost', authMiddleware.ensureAuth, dashController.addPost)

router.put('/addOneLike', authMiddleware.ensureAuth, dashController.addLike)

router.delete('/deletePost', authMiddleware.ensureAuth, dashController.deletePost)

module.exports = router