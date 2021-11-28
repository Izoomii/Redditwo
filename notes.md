#### UPDATES HAVE BEEN DISABLED ON PACKAGES IN PACKAGE JSON


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





## TODO:
# implement auth with other services, also, make those services -_-
# improve main page with tailwind

# add saved feature, and later upvotes

> after auth, passport sends user info in **req.user**

example of a cookie taken after successful auth of "Izumi":
[
  'connect.sid=s%3AJF-P6RwZW_Fp3IYAHnFwJh0oFh630QRH.Aj3vvXOg5o%2FPLVJjwJl2A0cTQfZLHT6xHrNuF%2B36j7w'
]

### all users in db right now have their passwords set to their nickname + "thebest" on lowercase, except for Obito, who has a capital O on his nickname in the password
















<form>
  <input name 1>
  <input name 2>
  <button type submit>
</form>