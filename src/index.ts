import express from "express"
import { PrismaClient, RedditwoUser } from '@prisma/client'

const prisma = new PrismaClient()


const app = express();
const port = 3000


app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World2!')
})





app.post('/users', async (req, res) => {
  const body = req.body as RedditwoUser;
  await prisma.redditwoUser.create({
    data: {
      id: body.id,
      name: body.name,
      email: body.email,
      sub: body.sub,
      post: body.post
    }
  })
})

app.get('/users', async (_, res) => {
  const users = await prisma.redditwoUser.findMany();
  res.json(users)
})

app.get(`/r/:subreddit`, async (req, res) => {
  const sub = req.params.subreddit
  const allSubPosts = await prisma.redditwoUser.findMany({
    where: {
      sub: sub
    }
  })
  res.json(allSubPosts)
})

app.get(`/u/:user`, async (req, res) => {
  const theUser = req.params.user
  const allUserPosts = await prisma.redditwoUser.findMany({
    where: {
      name: theUser
    }
  })
  res.json(allUserPosts)
})

app.delete('/u/:id', async (req, res) => {
  const userID = parseInt(req.params.id);
  const user = await prisma.redditwoUser.delete({
    where: {
      id: userID
    }
  })
  
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
