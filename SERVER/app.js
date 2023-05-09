const multer = require('multer')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const app = express()

dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cors())

const port = process.env.PORT
const uri = process.env.URI

mongoose.connect(uri).then(() => {
    console.log('Connected to DB')
}).catch((err) => {
    console.log(err)
})


app.get('/', (req, res) => {
    res.send('Router setup properly')
})

const formSchema = new mongoose.Schema({
    postTitle: { type: String, required: true },
    postContent: { type: String, required: true },
    formImg: { data: Buffer, contentType: String }
})

const Post = mongoose.model('Post', formSchema)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage })

app.post('/upload', upload.single('formImg'), async (req, res) => {
    try {
        const { postTitle, postContent } = req.body
        const formImg = {
            data: req.file.path,
            contentType: req.file.mimetype
        };
        const post = new Post({ postTitle, postContent, formImg })
        await post.save()
        res.status(201).json({ message: 'Post Created.' })
        
    } catch (err) {
        console.log(err)
    }
})

app.get('/upload', async (req, res) => {
    const allImg = await Post.find()
    res.status(200).json(allImg)
})

app.listen(port, () => {
    console.log('Server up and running')
}) 