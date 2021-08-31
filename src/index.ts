import express from "express"
import { PrismaClient } from '@prisma/client'

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

//bruh email doesnt accept "alice@prisma.io" for some reason, changing it with anything else works, -_-

async function main() {
  // ... you will write your Prisma Client queries here
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: "alice123@prisma.io",
      posts: {
        create: { title: 'Hello World' },
      },
      profile: {
        create: { bio: 'I like turtles' },
      },
    },
  })

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  })
  console.dir(allUsers, { depth: null })
}


main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World2!')
})

app.get('/izumi', (req, res) => {
    res.send('Hello izumi!')
})

app.post('/post', (req, res) => {
    const body = req.body as CreatePostPayload;
    database.push(body)
    res.send(`thnx: ${body.username}`)
})

app.get('/post', (req, res) => {
    res.json(database)
})

app.get('/post/r/:subreddit', (req, res) => {
    const subreddit = req.params.subreddit;
    console.log(subreddit)
    const result = database.filter((value) => value.subreddit === `r/${subreddit}`);
    res.json(result)
})

app.get('/post/u/:user', (req, res) => {
    const user = req.params.user;
    console.log(user)
    const result = database.filter((value) => value.username === `r/${user}`);
    res.json(result)
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
