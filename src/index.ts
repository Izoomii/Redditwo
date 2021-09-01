import express from "express"
import { PrismaClient, RedditwoUser } from '@prisma/client'

const prisma = new PrismaClient()


const app = express();
const port = 3000



/**
 * Users WIP EVERYONE ANON
 * Subreddits WIP ANYONE CAN JOIN ANY SUBREDDIT
 * Posts <-
 */

interface CreatePostPayload {
    username: string;
    subreddit: string;
    message: string;
}

const database: CreatePostPayload[] = [];



//copied from prisma docs

// async function main() {

//   // ... you will write your Prisma Client queries here

//   await prisma.redditwoUser.create({
//     data: {
//       name: 'Alice',
//       email: "alice@prisma.io",
//       sub: "r/aatroxmains",
//       post: "god damn aatrox is such a good champ fucked by meta i hate rito i will now proceed to burn half the amazon forest as a protest",
//     },
//   })

//   const allUsers = await prisma.redditwoUser.findMany()
//   console.dir(allUsers)

// }


// main()
//   .catch((e) => {
//     throw e
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })



app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World2!')
})

// app.get('/post/u/:user', (req, res) => {
//     const user = req.params.user;
//     console.log(user)
//     const result = database.filter((value) => value.username === `r/${user}`);
//     res.json(result)
// })


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
  const allSubPosts = await prisma.redditwoUser.findMany({
    where: {
      name: theUser
    }
  })
  res.json(allSubPosts)
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
