const express = require('express') // allows us to use the Express's methods/mmodules
const app = express() //assigns express to the app variable
const MongoClient = require('mongodb').MongoClient // imports/allows us to use mongodb's methods/modules
const PORT = 2121 //assigns a port number to a variable to be used later in the listen express method
require('dotenv').config()  // guess - allows us to use the .env file to store our environment variables like mongodb connection string


let db, //declared db outside the the mongodb method so it can be accessed anywhere in the app
    dbConnectionStr = process.env.DB_STRING,  // assigning a db_string(mongodb connection string(password)) which resides in our .env file to a variable. This allows us to keep that senstive data locally/ or in the environment that will host the app. no need to upload to github
    dbName = 'todo'  // assigning our mongodb name to variable

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to our mongdb database returns a promise. 
    .then(client => { 
        console.log(`Connected to ${dbName} Database`) // console logging our dbname
        db = client.db(dbName) // 
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})