/*          Jon Maddocks                    Assignment 3
            CIS 355 90 SU20                 July 24, 2020


            This project creates a simple web application that will utilize a database
                and display information regarding a list of items that are in the database.
                The user is also allowed to post new items that will be added to the database
                and items can be deleted if the ID is known. There is simple data validation 
                regarding posting, and the user must comply to those rules. Items will be
                updated in real-time when an item is posted or deleted.
 */

require('dotenv').config()

const express = require('express') //imports express
const fs = require('fs') //imports file system functions
const path =require('path') //imports path utils
const hbs=require('hbs'); //imports handlebars
const mongoose = require('mongoose')
const ItemEntry = require('./models/item');
//add other imports here

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


const app = express(); //creates express application and returns an object
const port=process.env.PORT || 8080; //selects the port to be used
app.listen(port) // starts listening for client requests on specified port
app.use(express.json());


const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')
app.use(express.static('./public')) //points to static resources like css, client side js etc.
app.set('view engine','hbs') //tells express top use handlebars templating engine
app.set('views',viewsPath) //sets the apps view directory to the viewsPath defined above
hbs.registerPartials(partialsPath)//registers the partials for the app


let items = [];

/* GET index listing. */
app.get('/', (req, res)=> {
    res.render('index', { title: 'ONLINE SHOPPING CENTER', description: "Jon's Store"});
    //This will embed the index.hbs view inside the body of layout.hbs
});

/* GET endpoint that serves for all sale items */
app.get('/items', (req, res) => {
    ItemEntry.find({}, (error, result) => {
        if(error)
            res.send({error: 'Something went wrong'})
         else{

         }
            const lstNames=[];
            result.forEach(item=>lstNames.push({_id:item._id,title:item.title}));
            res.send(lstNames);
    })
});

/* GET endpoint that serves for a single item for sale */
app.get('/items/:id', (req, res)=> {
    ItemEntry.find({_id: req.params.id},(error,result)=>{
        if (error)
            res.send({error: 'Something went wrong!'})
        else{
            if(result.length === 0){
                res.send({error: 'Item not found!'})
            }
            res.send(result[0])
        }
    })
});

/* POST endpoint that is used to insert a new entry into the sale items collection */ 
app.post('/items', (req, res)=> {
    console.log(req.body)
    const item = req.body
    ItemEntry.create(item,(error,result)=>{
        if(error){
            res.send({error: 'ERROR INSERTING ITEM!!!'})
        }
        else
            res.send(item)
    })
});


/* DELETE endpoint that deletes an existing entry from the sale items collection */ 
app.delete('/items/:id', (req, res)=> {
    ItemEntry.deleteOne({_id: req.params.id},(error,result)=>{
        if (error)
            res.send({error: 'Something went wrong!'})
        else
            console.log('Received DELETE request')
            res.send(result)
        }
    )
});

/* GET 404 listing. */
app.get('*', (req, res)=> {
    res.render('404');
});

