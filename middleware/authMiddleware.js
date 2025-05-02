const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = tokenParts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Attach decoded token to req.admin
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Super Admin only
const verifySuperAdmin = (req, res, next) => {
  if (req.admin.role !== "super-admin") {
    return res.status(403).json({ message: "Super Admin access required" });
  }
  next();
};

// ✅ Blog Admin or Super Admin
const verifyBlogAdmin = (req, res, next) => {
  if (req.admin.role !== "blog-admin" && req.admin.role !== "super-admin") {
    return res.status(403).json({ message: "Blog Admin access required" });
  }
  next();
};

// ✅ Sales Admin or Super Admin
const verifySalesAdmin = (req, res, next) => {
  if (req.admin.role !== "sales-admin" && req.admin.role !== "super-admin") {
    return res.status(403).json({ message: "Sales Admin access required" });
  }
  next();
};

// ✅ Medical Admin or Super Admin
const verifyMedicalAdmin = (req, res, next) => {
  if (req.admin.role !== "medical-admin" && req.admin.role !== "super-admin") {
    return res.status(403).json({ message: "Medical Admin access required" });
  }
  next();
};

module.exports = {
  authMiddleware,
  verifySuperAdmin,
  verifyBlogAdmin,
  verifySalesAdmin,
  verifyMedicalAdmin, // 👈 Add this
};
