const express = require('express')

const postController = require("../controllers/postController")
const protect = require("../middleware/authmiddleware")
const router=express.Router();


router.route("/")
.get(protect,postController.getAllPosts)
.post(protect,postController.createPost);


router.route("/:id")
.get(protect,postController.getOnePosts )
.patch(protect,postController.updatePost)
.delete(protect,postController.deletePost)

module.exports = router;