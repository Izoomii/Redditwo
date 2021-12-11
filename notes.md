#### UPDATES HAVE BEEN DISABLED ON PACKAGES IN PACKAGE JSON

### all users in db right now have their passwords set to their nickname + "thebest" on lowercase, except for Obito, who has a capital O on his nickname in the password

## Pug files are in the project but unused, will delete after Nextjs is set up and working


## TODO:
> implement auth with other services, also, make those services -_-
> add saved feature, and later upvotes
> improve main page with tailwind


## CRITICAL ERRORS:
>> Running nextjs and opening a page (Not found since i havent made any) leaves node using port 3000 even after terminating the program, 25% cpu usage and unable to use localhost 3000 anymore.
  > cause: 
      server.all("*", (req, res) => {
        return handle(req, res);
      });



## Known errors
> error with get request to auth/login after being logged in
> undefined when searching for posts





## ==================================================================================================================================
## ==================================================================================================================================

> after auth, passport sends user info in **req.user**

>HTTP
>POST: Post requests are usually used for "Posting/Adding" informations to the server.
>GET: This is what the browser uses per default. Get requests are usually used for "Getting/Querying" information from the server.
>PUT
>DELETE


joi to validate variable types and all
class-validator to validate classes, might not need it now but it's here


//very usefull
  interface LooseObject {
    [key: string]: any;
  }


  let str: Array<any> = ["A", "B", 3];
  console.log(str);

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })






example of a cookie taken after successful auth of "Izumi":
[
  'connect.sid=s%3AJF-P6RwZW_Fp3IYAHnFwJh0oFh630QRH.Aj3vvXOg5o%2FPLVJjwJl2A0cTQfZLHT6xHrNuF%2B36j7w'
]




<form>
  <input name 1>
  <input name 2>
  <button type submit>
</form>
