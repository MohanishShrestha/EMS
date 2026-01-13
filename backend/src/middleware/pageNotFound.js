const PageNotFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
};

export default PageNotFound;
