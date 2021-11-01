# HTTP

## POST
Post requests are usually used for "Posting/Adding" informations to the server.
## GET
This is what the browser uses per default.
Get requests are usually used for "Getting/Querying" information from the server.
## PUT
## DELETE




installed sha256, argon2, joi and class-validator, may need to install auth-js later but i dont see why now.

sha256 to format strings to fixed lenght digests
argon2 to generate storable passwords strings (i hope)
joi to validate variable types and all

class-validator to validate classes, might not need it now but it's here



main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })





# TODO:

# literally auth


AUTH WORKS, JUST. BARELY, ITS LITERALLY ON THE EDGE, BUT HASNT FALLEN YET, WHICH IS GOOD ENOUGH, GOOD ENOUGH, LITERALLY ONE TRIP AND THE WHOLE SHIP EXPLODES, BUT IDC, AUTH WORKS, IT DIDNT EXPLODE, I WILL FIX IT... L A T E R.

all users in db right now have their passwords set to their nickname + "thebest" on lowercase, except for Obito, who has a capital O on his nickname in the password