const router = require("express").Router();
const postController = require("../controller/postController");

router.get("/",postController.getPosts);
router.get("/create",postController.getCreatePost);
router.post("/create",postController.postCreatePost);
router.get("/edit/:id",postController.getEditPost);
router.post("/edit/:id",postController.postEditPost);
router.post("/delete/:id",postController.postDeletePost);

module.exports = router;