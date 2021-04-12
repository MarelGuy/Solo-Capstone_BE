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

app.post('/fav/scp/:userId', async (req, res, next) => {
    try {
        await userModel.findByIdAndUpdate(req.params.userId, {
            $push:
            {
                scpFavourites: req.body
            }
        })
        res.status(201).send("SCP favourited!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.delete('/fav/scp/:userId/:favId', async (req, res, next) => {
    try {
        await userModel.findByIdAndUpdate(req.params.userId, {
            $pull:
            {
                scpFavourites: req.params.favId
            }
        })
        res.status(201).send("SCP unfavourited!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.post('/fav/forum/:userId', async (req, res, next) => {
    try {
        await userModel.findByIdAndUpdate(req.params.userId, {
            $push:
            {
                forumFavourites: req.body
            }
        })
        res.status(201).send("forum favourited!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.delete('/fav/forum/:userId/:favId', async (req, res, next) => {
    try {
        await userModel.findByIdAndUpdate(req.params.userId, {
            $pull:
            {
                forumFavourites: req.params.favId
            }
        })
        res.status(201).send("forum unfavourited!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.post('/fav/doc/:userId', async (req, res, next) => {
    try {
        await userModel.findByIdAndUpdate(req.params.userId, {
            $push:
            {
                docFavourites: req.body
            }
        })
        res.status(201).send("document favourited!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.delete('/fav/doc/:userId/:favId', async (req, res, next) => {
    try {
        await userModel.findByIdAndUpdate(req.params.userId, {
            $pull:
            {
                docFavourites: req.params.favId
            }
        })
        res.status(201).send("document unfavourited!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.put("/add-desc/:id", async (req, res, next) => {
    try {
        await userModel.findByIdAndUpdate(req.params.id, {
            userDesc: req.body
        })
    } catch (err) {
        console.log(err);
        next(err);
    }
})



module.exports = app