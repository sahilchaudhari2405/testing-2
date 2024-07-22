import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    console.log(token);

    if (!token) {
        return res.status(401).json({ error: "No access token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid access token" });
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log(req.user);
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "You do not have permission to perform this action" });
        }
        next();
    };
};

export async function checkAdmin(req, res, next) {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing', status: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized', status: false });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access required', status: false });
        }

        req.user = user; // Assign user to req.user
        next();
    } catch (error) {
        console.error('Error in verifyAdmin middleware:', error);
        return res.status(500).json({ message: 'Internal server error', status: false, error: error.message });
    }
}