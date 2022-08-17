const Posts = require('../models/Posts')

module.exports = {
    getPosts: async (req, res) => {
        try {
            const data = await Posts.find()
            // console.log(req)
            res.render('index.ejs', {rebirthPosts: data})
        } catch (err) {
            console.log(err)
        }
    },
    addPost: async (req, res)=>{
        try{
            await Posts.create({name: req.body.name, message: req.body.message, likes: 0})
            console.log('Post has been added!')
            res.redirect('/dashboard')
        }catch(err){
            console.log(err)
        }
    },
    addLike: async (req, res) => {
        try{
            await Posts.findOneAndUpdate({_id: req.body.ObjectId}, {$set: {likes: req.body.likesS + 1}})
            res.json('Like Added')
        } catch (err) {
            console.log(err)
        }
    },
    deletePost: async (req, res) => {
        try{
            await Posts.findOneAndDelete( { _id: req.body.ObjectId } )
            console.log(`Deleted Post`)
            res.json('Delete Confirmed')
        } catch (err) {
            console.log(err)
        }
    }
}