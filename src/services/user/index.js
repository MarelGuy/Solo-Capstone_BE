const app = require("express").Router()
const userModel = require("../../schemas/userModel")
const scpModel = require("../../schemas/scpModel")

const { authenticate } = require("../../utils/auth")
const { authorize } = require("../../utils/middleware")

const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../../utils/cloudinary")

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: process.env.FOLDER_NAME
    }
})
const uploadCloudinary = multer({ storage: storage });

app.get("/me", authorize, async (req, res, next) => {
    try {
        res.send(req.user)
    } catch (err) {
        console.log(err)
        next(err)
    }
});

app.get("/:id", async (req, res, next) => {
    try {
        const user = await userModel.findById(req.params.id)
        res.send(user)
    } catch (err) {
        console.log(err)
        next(err)
    }
});

app.get("/", async (req, res, next) => {
    try {
        const users = await userModel.find()
        res.send(users)
    } catch (err) {
        console.log(err)
        next(err)
    }
});

app.post("/register", async (req, res, next) => {
    try {
        const newUser = new userModel(req.body);
        const { _id } = await newUser.save();
        res.status(201).send({ _id });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

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
});

app.delete("/:id", async (req, res, next) => {
    try {
        await userModel.findByIdAndDelete(req.params.id)
        res.status(200).send("deleted")
    } catch (err) {
        console.log(err);
        next(err);
    }
})

app.post("/:id/image", uploadCloudinary.single("avatar"), async (req, res, next) => {
    try {
        await userModel.findByIdAndUpdate(req.params.id, {
            $set: {
                avatar: req.file.path
            }
        })
        console.log(req.file.path)
        res.send("Image changed")
    } catch (err) {
        console.log(err)
        next(err)
    }
});

app.get('/:id/favs', async (req, res, next) => {
    try {
        const user = await userModel.findById(req.params.id).populate(["scpFavourites", "forumFavourites"])
        res.send({
            scpFavourites: user.scpFavourites,
            docFavourites: user.docFavourites,
            forumFavourites: user.forumFavourites
        })
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.put('/:id', async (req, res, next) => {
    try {
        body = req.body
        console.log(body)
        await userModel.findByIdAndUpdate(req.params.id, {
            nickname: body.nickname,
            email: body.email
        })
        res.send("User updated")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.post('/fav/scp/:scpId', authorize, async (req, res, next) => {
    try {
        const user = await userModel.findOne({ _id: req.user._id })
        if (user.scpFavourites.findIndex(fav => fav.toString() === req.params.scpId.toString()) === -1) {
            await userModel.findByIdAndUpdate(req.user._id, {
                $push:
                {
                    scpFavourites: req.params.scpId
                }
            })
            const user_updated = await userModel.findOne({ _id: req.user._id }).populate("user")
            return res.send(user_updated)
        } else {
            await userModel.findByIdAndUpdate(req.user._id, {
                $pull:
                {
                    scpFavourites: req.params.scpId
                }
            })
            const user_updated = await userModel.findOne({ _id: req.user._id }).populate("user")
            return res.send(user_updated)
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.post('/fav/forum/:forumId', authorize, async (req, res, next) => {
    try {
        const user = await userModel.findOne({ _id: req.user._id })
        if (user.forumFavourites.findIndex(fav => fav.toString() === req.params.forumId.toString()) === -1) {
            await userModel.findByIdAndUpdate(req.user._id, {
                $push:
                {
                    forumFavourites: req.params.forumId
                }
            })
            const user_updated = await userModel.findOne({ _id: req.user._id }).populate("user")
            return res.send(user_updated)
        } else {
            await userModel.findByIdAndUpdate(req.user._id, {
                $pull:
                {
                    forumFavourites: req.params.forumId
                }
            })
            const user_updated = await userModel.findOne({ _id: req.user._id }).populate("user")
            return res.send(user_updated)
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.post('/fav/doc/:docId', authorize, async (req, res, next) => {
    try {
        const user = await userModel.findOne({ _id: req.user._id })
        if (user.docFavourites.findIndex(fav => fav.toString() === req.params.docId.toString()) === -1) {
            await userModel.findByIdAndUpdate(req.user._id, {
                $push:
                {
                    docFavourites: req.params.docId
                }
            })
            const user_updated = await userModel.findOne({ _id: req.user._id }).populate("user")
            return res.send(user_updated)
        } else {
            await userModel.findByIdAndUpdate(req.user._id, {
                $pull:
                {
                    docFavourites: req.params.docId
                }
            })
            const user_updated = await userModel.findOne({ _id: req.user._id }).populate("user")
            return res.send(user_updated)
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.put("/add-desc/:id", async (req, res, next) => {
    try {
        await userModel.findByIdAndUpdate(req.params.id, {
            userDesc: req.body.userDesc
        })
        res.status(201).send("description added!")
    } catch (err) {
        console.log(err);
        next(err);
    }
})



module.exports = app