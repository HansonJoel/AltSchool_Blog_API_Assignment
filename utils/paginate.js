module.exports = function paginate(query) {
  const page = parseInt(query.page, 10) || 1;

  // Convert the "limit" query parameter to an integer
  // If not provided, use DEFAULT_PAGE_SIZE from environment variables
  // If DEFAULT_PAGE_SIZE is not set, fallback to 20
  const limit =
    parseInt(query.limit, 10) ||
    parseInt(process.env.DEFAULT_PAGE_SIZE || "20", 10);

  // This calculates how many documents to skip based on page and limit
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
