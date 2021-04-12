const app = require('express').Router()
const forumRouter = require('./forum')
const scpRouter = require('./scp')
const userRouter = require('./user')
const docRouter = require('./documents')

app.use("/forum", forumRouter)
app.use("/scp", scpRouter)
app.use("/user", userRouter)
app.use("/doc", docRouter)

module.exports = app