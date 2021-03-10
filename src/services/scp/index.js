const app = require("express").Router()
const scpModel = require("../../schemas/scpModel")

const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../../utils/cloudinary")

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: process.env.FOLDER_NAME
    }
})
const multerCloudinary = multer({
    "storage": storage
})

app.get('/', async (req, res, next) => {
    try {
        const SCP = await scpModel.find().populate("user")
        if (SCP.lenth === 0) {
            res.status(404).send("Error 404, maybe there aren't any scps in the db?")
        } else {
            res.status(200).send(SCP)
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.get('/:id', async (req, res, next) => {
    try {
        const SCP = await scpModel.findById(req.params.id).populate("user")
        res.status(200).send(SCP)
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.post('/', multerCloudinary.single("image"), async (req, res, next) => {
    try {
        const { _id } = await new scpModel(req.body).save()
        await scpModel.findByIdAndUpdate(_id, {
            $set: {
                image: req.file.path,
            }
        },
            {
                runValidators: true,
                new: true
            }
        );
        res.status(201).send("SCP created!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

// app.post('/', async (req, res, next) => {
//     try {
//         await new scpModel(req.body).save()
//         res.status(201).send("SCP created!")
//     } catch (err) {
//         console.log(err);
//         next(err);
//     }
// });

app.post('/:id/like', async (req, res, next) => {
    try {
        await scpModel.findByIdAndUpdate(req.params.id, {
            $push:
            {
                likes: req.body
            }
        })
        res.status(201).send("SCP liked!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.put('/:id', async (req, res, next) => {
    try {
        await scpModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(201).send("SCP updated!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.delete('/:id', async (req, res, next) => {
    try {
        await scpModel.findByIdAndDelete(req.params.id, req.body)
        res.status(201).send("SCP deleted!")
    } catch (err) {
        console.log(err);
        next(err);
    }
})

module.exports = app