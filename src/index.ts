import express from "express"

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
