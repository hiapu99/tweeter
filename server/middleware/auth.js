const jwt = require("jsonwebtoken");

const authorization = async (req, res, next) => {
    // Check if the authorization header is present
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            msg: "JWT token required"
        });
    }
    try {
        // Verify the token using the secret
        const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object
        req.user = decoded;

        // Call next() to proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({
            success: false,
            msg: "Invalid or expired token"
        });
    }
};

module.exports = authorization;
