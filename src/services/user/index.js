const app = require("express").Router()
const userModel = require("../../schemas/userModel")

app.get('/:id', async (req, res) => {
    const user = await userModel.findById(req.params.id)
    res.send(user)
});

module.exports = app