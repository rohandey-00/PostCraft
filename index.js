const express = require("express");
const app = express();
const path = require("path");   //for ejs [1]
const { v4: uuidv4 } = require('uuid');  // uuid
let port = 8080;
const methodOverride = require('method-override');

app.set("view engin", "ejs");  //for ejs [2]
app.set("views", path.join(__dirname, "/views")); //for ejs runs outside the directory [3]
app.use(express.static(path.join(__dirname, "public"))); // to send css, js (static file by default public folder) with ejs from any directory.. [4]
app.use(express.urlencoded({ extended: true}));  //for POST requiest [1]
app.use(express.json());                         // for POST, json data [2]
app.use(methodOverride('_method'));


let posts = [                   //array as database..
    {
        id:uuidv4(),
        name: "John",
        content: "Enjoying a peaceful Sunday morning with a good book and a hot cup of tea. Blissful moments like these make life beautiful. 📖☕️ #SelfCare"
    },
    {
        id:uuidv4(),
        name: "Olivar",
        content: "Just got accepted into my dream university! 🎓 Hard work pays off! Excited for this new chapter!",
    },
    {
        id:uuidv4(),
        name: "Daniel",
        content: "Loving this sunny weather! ☀️ Perfect day for a hike in the mountains. Grateful for nature's beauty! 🌲",
    }
];


app.listen(port,()=>{
    console.log("app listining on port 8080");
});


app.get("/post",(req,res)=>{
    res.render("index.ejs", { posts });
});


app.get("/post/new",(req, res)=>{
    res.render("new.ejs");
});


app.post("/post",(req, res) =>{
    let id = uuidv4(); 
    let { name, content} = req.body;
    posts.push({id, name, content});
    
    // posts.push(id, req.body);    
    res.redirect("http://localhost:8080/post");
});



//------------------------------  VIEW one individual post using id   -------------------------------------

app.get("/post/:id", (req,res)=>{
    let { id } = req.params;
    let post = posts.find((p) => id===p.id);  //searching post based upon id
    if(post){
       res.render("show.ejs", { post });
    }else{
        res.send("Not find any page...");
    }
   
});


//------------------------------  UPDATE individual post using id   -------------------------------------

app.get("/post/:id/edit", (req,res)=>{    //from <a> tag
    let {id} = req.params;
    let post = posts.find((p) => id===p.id);  //searching post based upon id
    if(post){
       res.render("edit.ejs", { post });
    }else{
        res.send("Not find any page...");
    }
});


app.patch("/post/:id", (req,res)=>{
    let { id } = req.params;
    let newCont = req.body.content;
    let post = posts.find((p) => id===p.id);
    post.content=newCont;
    // console.log(post);
    res.redirect("http://localhost:8080/post");
});



//------------------------------  DELETE individual post using id   -------------------------------------

app.delete("/post/:id",(req,res)=>{

    let {id} = req.params;

    posts = posts.filter((p)=> id !== p.id);

    res.redirect("http://localhost:8080/post");
});

