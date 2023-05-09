const multer = require('multer')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const app = express()

dotenv.config()

app.use(express.json())

app.use(cors())

const port = process.env.PORT

app.get('/', (req, res) => {
    res.send('Router setup properly')
})

const uri = process.env.URI

mongoose.connect(uri).then(() => {
    console.log('Connected to DB')
}).catch((err) => {
    console.log(err)
})



const formSchema = new mongoose.Schema({
    postTitle: { type: String, required: true },
    postContent: { type: String, required: true },
    img: { data: Buffer, contentType: String }
})

const Post = mongoose.model('Post', formSchema)

const upload = multer({ storage: multer.memoryStorage() });
app.post('/',upload.single('img'), async (req, res) => {
    try {
        const { postTitle, postContent} = req.body
        const img = {
            data: req.file.buffer,
            contentType: req.file.mimetype
          };
        const post = new Post({ postTitle, postContent, img })
        await post.save()
        res.status(201).json({ message: 'Post Created.' })
    } catch (err) {
        console.log(err)
    }
})

app.listen(port, () => {
    console.log('Server up and running')
}) 