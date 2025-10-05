const Blog = require("../models/Blog");
const readingTime = require("../utils/readingTime");
const paginate = require("../utils/paginate");
const { body, validationResult } = require("express-validator");

const validateCreate = [body("title").notEmpty(), body("body").notEmpty()];

// Create blog
const createBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, body, tags } = req.body;
    const readTime = readingTime(body);

    const blog = new Blog({
      title,
      description,
      body,
      tags,
      author: req.user._id,
      reading_time: readTime,
      state: "draft",
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, state } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Only the blog owner can update
    if (String(blog.author) !== String(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update fields
    if (title) blog.title = title;
    if (body) {
      blog.body = body;
      blog.reading_time = readingTime(body);
    }
    if (state && ["draft", "published"].includes(state)) {
      blog.state = state;
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Publish blog
const publishBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (String(blog.author) !== String(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    blog.state = "published";
    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (String(blog.author) !== String(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single blog
const getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("author", "username email");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// List blogs
const listBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      state,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Always restrict public blogs to published ones
    let query = { state: "published" };

    // Optionally allow filter by state (but only if explicitly provided and valid)
    if (state && ["draft", "published"].includes(state) && req.user) {
      // Only logged-in users can filter by their own drafts (extra safety check)
      query.state = state;
    }

    // Search by title or tags
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting (default: newest first)
    const sortOption = { [sortBy]: order === "asc" ? 1 : -1 };

    const blogs = await Blog.find(query)
      .populate("author", "username email")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data: blogs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get my blogs
const getMyBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, state, search } = req.query;

    const query = { author: req.user._id };
    if (state) query.state = state;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data: blogs,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Export all
module.exports = {
  validateCreate,
  createBlog,
  updateBlog,
  publishBlog,
  deleteBlog,
  getBlog,
  listBlogs,
  getMyBlogs,
};
