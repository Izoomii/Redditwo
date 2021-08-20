import express from "express"
import couchbase, { connect } from "couchbase"


//mess taken from "https://docs.couchbase.com/nodejs-sdk/current/hello-world/start-using-sdk.html"
async function main() {
    const cluster = await connect("couchbase://localhost", {
        username: "Administrator",
        password: "password",
    });

    // ^ copied from couchbase doc so will need to look into it.
    // couchbase.Cluster deprecated ??
    // @deprecated Use the static sdk-level {@link connect} method instead.

    // replaced the original with "couchbase.Cluster" with "await connect", have no idea if it will work but i hope. programmer spirit.
    // see https://forums.couchbase.com/t/typescript-support/28984/4


    // get a reference to our bucket
    const bucket = cluster.bucket("travel-sample");

    //  get a reference to our collection
    const collection = bucket.scope("inventory").collection("airline");

    // get a reference to the default collection, required for older Couchbase server versions
    const collection_default = bucket.defaultCollection();



}


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
