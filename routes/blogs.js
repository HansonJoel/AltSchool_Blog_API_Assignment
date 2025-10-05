const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const auth = require("../middleware/auth");

// all routes pass through auth middleware which sets req.user if token provided
router.use(auth);

// list public blogs (paginated, searchable, filter, orderable)
router.get("/", blogController.listBlogs);

// create blog (auth required)
router.post("/", blogController.validateCreate, blogController.createBlog);

// get single blog
router.get("/:id", blogController.getBlog);

// update blog (owner required)
router.put("/:id", blogController.updateBlog);

// publish blog (owner)
router.patch("/:id/publish", blogController.publishBlog);

// delete blog (owner)
router.delete("/:id", blogController.deleteBlog);

// get my blogs (auth required)
router.get("/user/me/list", blogController.getMyBlogs);

module.exports = router;
