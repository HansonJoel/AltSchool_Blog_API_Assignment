const Blog = require("../models/Blog");

module.exports = async function (req, res, next) {
  const user = req.user;
  if (!user)
    return res.status(401).json({ message: "Authentication required" });
  const blogId = req.params.id || req.body.id;
  if (!blogId) return res.status(400).json({ message: "Blog id required" });
  const blog = await Blog.findById(blogId);
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  if (blog.author.toString() !== user._id.toString())
    return res.status(403).json({ message: "Forbidden — not the blog owner" });
  req.blog = blog;
  next();
};
