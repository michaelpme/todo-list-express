const express = require('express') // allows us to use the Express's methods/mmodules
const app = express() //assigns express to the app variable
const MongoClient = require('mongodb').MongoClient // imports/allows us to use mongodb's methods/modules
const PORT = 2121 //assigns a port number to a variable to be used later in the listen express method
require('dotenv').config()  // guess - allows us to use the .env file to store our environment variables like mongodb connection string


let db, //declared(globally scopped) db outside the the mongodb method so it can be accessed anywhere in the app
    dbConnectionStr = process.env.DB_STRING,  // assigning a db_string(mongodb connection string(password)) which resides in our .env file to a variable. This allows us to keep that senstive data locally/ or in the environment that will host the app. no need to upload to github
    dbName = 'todo'  // assigning our mongodb name to variable

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to our mongdb database returns a promise. 
    .then(client => { 
        console.log(`Connected to ${dbName} Database`) // console logging our dbname
        db = client.db(dbName) // 
    })
    
app.set('view engine', 'ejs') //lets our app know that we will be using ejs 
app.use(express.static('public')) // I think it tells our api to access our public folder for any file that does not have a route specified
app.use(express.urlencoded({ extended: true })) // lets us pull data from the url. eg - https://something.com/:variable - we would be able to use :variable
app.use(express.json()) //allows us to read json data


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() //finds the all items in the todos collections and turns them into am array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // I think it counts the number of documnets present in the collection
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render the index.ejs file and passes the todoItems and itemsLeft to be used in the ejs file
    // db.collection('todos').find().toArray() // does the same thing as the above code but without the async function. uses promises
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //start of a post request to create an item into our todos collection
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // uses the insertOne function to insert an item into collection todos
    .then(result => { 
        console.log('Todo Added') // console logs when the action is completed
        response.redirect('/') // once all is complete, it redirect to the home page(root)(/)
    })
    .catch(error => console.error(error)) // a catch in case of any errors
})

app.put('/markComplete', (request, response) => { //the start of an put request to update the item in the todo collection 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // first parameter is the filter - updating the document that has request.body.itemfromjs
        $set: {   // setting the "completed" property to "true"
            completed: true
          }
    },{
        sort: {_id: -1}, // sorting in descending order
        upsert: false // the upsert property if set to true will create a new file if the filter condition cannot find something that matches.
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))  // a catch in case of any errors

})

app.put('/markUnComplete', (request, response) => {  //the start of an put request to update the item in the todo collection 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  // 
        $set: {// setting the "completed" property to "true"
            completed: false
          }
    },{
        sort: {_id: -1}, // sorting in descending order
        upsert:  false // the upsert property if set to true will create a new file if the filter condition cannot find something that matches.
    })
    .then(result => {
        console.log('Marked Complete') //once complete console log marked complete
        response.json('Marked Complete') // returns a json object when complete
    })
    .catch(error => console.error(error)) // a catch in case of any errors

})

app.delete('/deleteItem', (request, response) => {  //the start of a delete request to delete the item in the todo collection  
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete item that equal request.body.itemFromJS
    .then(result => {
        console.log('Todo Deleted') // console logs when delete action is complete
        response.json('Todo Deleted') // responds with a json when complete
    })
    .catch(error => console.error(error))  // a catch in case of any errors

})

app.listen(process.env.PORT || PORT, ()=>{ // listens on port found in the env file and if that does not exist, use the PORT variable as the port number 
    console.log(`Server running on port ${PORT}`) // console logs the string when the server starts.
})