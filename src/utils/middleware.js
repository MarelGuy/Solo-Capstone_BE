const UserModel = require("../schemas/userModel");
const { verifyJWT } = require("./auth");

const authorize = async (req, res, next) => {
    try {
        const token = req.headers.accesstoken;
        const decoded = await verifyJWT(token);
        const user = await UserModel.findById(decoded._id);
        if (!user) throw new Error();
        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        console.log(err)
        next(err);
    }
};

const adminOnlyMiddleware = async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
    }
};

module.exports = {
    authorize,
    adminOnly: adminOnlyMiddleware,
};
