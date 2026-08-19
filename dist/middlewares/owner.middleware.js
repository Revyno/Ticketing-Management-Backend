"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOwner = void 0;
// isi createdBy dari user yang login (jangan percaya client kirim createdBy sendiri)
function setOwner(req, _res, next) {
    if (req.user)
        req.body.createdBy = req.user.id;
    next();
}
exports.setOwner = setOwner;
