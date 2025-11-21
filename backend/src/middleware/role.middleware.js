export const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req.user) {
            return res.status(401).json({ message: "Unauthorized - No User Info" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden - Insufficient Role" });
        }
        next();
    };
};