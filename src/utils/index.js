const accessTokenOptions = {
    httpOnly: true,
    path: "/",
    overwrite: true,
    sameSite: "None",
    secure: true,
};

const refreshTokenOptions = {
    httpOnly: true,
    path: "/users/refreshToken",
    overwrite: true,
    sameSite: "None",
    secure: true,
};

module.exports = {
    accessTokenOptions,
    refreshTokenOptions
};
