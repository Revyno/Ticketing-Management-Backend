"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
// wajib login: cek header Authorization: Bearer <token>
function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!(header === null || header === void 0 ? void 0 : header.startsWith("Bearer "))) {
        return res.status(401).json({ message: "Unauthorized: no token" });
    }
    try {
        req.user = (0, jwt_1.verifyToken)(header.split(" ")[1]);
        next();
    }
    catch (_a) {
        return res.status(401).json({ message: "Unauthorized: invalid token" });
    }
}
exports.authenticate = authenticate;
// batasi role tertentu (mis. authorize("admin"))
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
}
exports.authorize = authorize;
