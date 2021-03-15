const app = require("express").Router()
const userModel = require("../../schemas/userModel")
const { authenticate } = require("../../utils/auth")
const {
    accessTokenOptions,
    refreshTokenOptions
} = require("../../utils")
const { authorize } = require("../../utils/middleware")

app.get("/me", authorize, async (req, res, next) => {
    try {
        res.send(req.user)
    } catch (err) {
        console.log(err)
        next(err)
    }
})

app.post("/register", async (req, res, next) => {
    try {
        const newUser = new userModel(req.body);
        const { _id } = await newUser.save();
        res.status(201).send({ _id });
    } catch (err) {
        console.log(err);
        next(err);
    }
})

app.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findByCredentials(email, password);
        const { accessToken, refreshToken } = await authenticate(user);
        console.log({ accessToken, refreshToken })
        res
            .send(
                {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
            );
    } catch (err) {
        console.log(err);
        next(err);
    }
})

app.get('/favs', async (req, res, next) => {
    try {
        const user = await userModel.findById(req.params.id)
        res.send(user.favourites)
    } catch (err) {
        console.log(err);
        next(err);
    }
})

app.post('/fav/:userId', async (req, res, next) => {
    try {
        await userModel.findByIdAndUpdate(req.params.userId, {
            $push:
            {
                favourites: req.body
            }
        })
        res.status(201).send("SCP liked!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.delete('/fav/:userId/:favId', async (req, res, next) => {
    try {
        await userModel.findByIdAndUpdate(req.params.userId, {
            $pull:
            {
                favourites: { _id: req.params.favId }
            }
        })
        res.status(201).send("SCP unfavourited!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = app