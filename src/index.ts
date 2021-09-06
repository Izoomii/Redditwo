import express from "express"
import { PrismaClient, User, Post } from '@prisma/client'

const prisma = new PrismaClient()


const app = express();
const port = 3000


app.use(express.urlencoded({ extended: true }));

interface searchWords {
  words: string;
}


//hello world but it has a 2 at the end
app.get('/', (req, res) => {
  res.send('Hello World2!')
})


//finds all users registered
app.get('/users', async (_, res) => {
  const users = await prisma.user.findMany();
  res.json(users)
})



//finds all posts of a subreddit
app.get(`/r/:subreddit`, async (req, res) => {
  const sub = req.params.subreddit
  const allSubPosts = await prisma.post.findMany({
    where: {
      sub: sub
    }
  })
  res.json(allSubPosts)
})


//finds all posts of a user
app.get(`/u/:user`, async (req, res) => {
  const theUser = req.params.user
  const allUserPosts = await prisma.post.findMany({
    where: {
      authorName: theUser
    }
  })
  res.json(allUserPosts)
})


//searches all posts in database for a specific keyword(s)
app.get('/searchposts', async (req, res) => {
  const keyWord = req.body as searchWords
  const results = await prisma.post.findMany({
    where: {
      content: {
        contains: keyWord.words
      }
    }
  })
  res.json(results)
})


//creates a user
app.post('/createuser', async (req, res) => {
  const body = req.body as User;
  await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
    }
  })
})


//creates a new post for a user
app.post('/createpost', async (req, res) => {
  const body = req.body as Post
  await prisma.post.create({
    data: {
      sub: body.sub,
      title: body.title,
      content: body.content,
      authorName: body.authorName
    }
  })
})


//deletes user
app.delete('/u/:name', async (req, res) => {
  const userName = req.params.name
  const user = await prisma.user.delete({
    where: {
      name: userName
    }
  })
  
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
