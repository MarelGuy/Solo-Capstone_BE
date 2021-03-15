const jwt = require("jsonwebtoken");
const userModel = require("../schemas/userModel");

const authenticate = async (user) => {
    try {
        const accessToken = await generateJWT({ _id: user._id });
        const refreshToken = await generateRefreshJWT({ _id: user._id });
        user.refreshToken = user.refreshToken.concat({ token: refreshToken });
        await user.save();
        return { accessToken, refreshToken };
    } catch (err) {
        console.log(err);
    }
};

const generateJWT = (payload) =>
    new Promise((res, rej) =>
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            (err, token) => {
                if (err) rej(err);
                res(token);
            }
        )
    );

const verifyJWT = (token) =>
    new Promise((res, rej) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) rej(err);
            res(decoded);
        });
    });

const generateRefreshJWT = (payload) =>
    new Promise((res, rej) =>
        jwt.sign(
            payload,
            process.env.REFRESH_JWT_SECRET,
            (err, token) => {
                if (err) rej(err);
                res(token);
            }
        )
    );

const verifyRefreshToken = (token) =>
    new Promise((res, rej) =>
        jwt.verify(token, process.env.REFRESH_JWT_SECRET, (err, decoded) => {
            if (err) rej(err);
            res(decoded);
        })
    );

const refreshToken = async (oldRefreshToken) => {
    console.log(oldRefreshToken)
    const decoded = await verifyRefreshToken(oldRefreshToken);
    const user = await userModel.findOne({ _id: decoded._id });
    if (!user) console.log(err)
    const currentRefreshToken = user.refreshToken.find(
        (t) => t.token === oldRefreshToken
    );
    if (!currentRefreshToken) console.log(err)
    const accessToken = await generateJWT({ _id: user._id });
    const refreshToken = await generateRefreshJWT({ _id: user._id });
    const newRefreshToken = user.refreshToken
        .filter((t) => t.token !== oldRefreshToken)
        .concat({ token: refreshToken });
    user.refreshToken = [...newRefreshToken];
    await user.save();
    return { accessToken, refreshToken };
};

module.exports = { authenticate, verifyJWT, refreshToken };
