# HTTP

## POST
Post requests are usually used for "Posting/Adding" informations to the server.
## GET
This is what the browser uses per default.
Get requests are usually used for "Getting/Querying" information from the server.
## PUT
## DELETE







copied from prisma docs

async function main() {

  // ... you will write your Prisma Client queries here

  await prisma.redditwoUser.create({
    data: {
      name: 'Alice',
      email: "alice@prisma.io",
      sub: "r/aatroxmains",
      post: "god damn aatrox is such a good champ fucked by meta i hate rito i will now proceed to burn half the amazon forest as a protest",
    },
  })

  const allUsers = await prisma.redditwoUser.findMany()
  console.dir(allUsers)

}


main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })





# TODO:

## change code to create user then have user post something, rather than make a new "user" with different id for every post, effectively giving each "user" one post.