const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (
      !req.user ||
      req.user.role.toLowerCase() !== requiredRole.toLowerCase()
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient permissions"
      });
    }

    next();
  };
};

export default roleMiddleware;