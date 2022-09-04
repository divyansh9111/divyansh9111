const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const port=3000;

// mongoose connection
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{useNewUrlParser:true});

// schema for articles
const articlesSchema=mongoose.Schema({
    title:String,
    content:String
});

// model with this schema
const Article=mongoose.model("Article",articlesSchema);

// app
const app=express();

// set set use use
app.use(bodyParser.urlencoded({extended:true}));
app.use("/public",express.static("public"));
app.set("view engine","ejs");

//*************API routes for all the articles**************
// app.get("/articles",(req,res)=>{
//     // res.send("Hello world");
//     Article.find({},(err,foundArticles)=>{
//         if (!err) {
//             // console.log(foundArticles);
//             res.send(foundArticles);           
//         }else{
//             console.log(err);
//         }
//     });
// });

// app.post("/articles",(req,res)=>{
//     const newArticle=new Article({
//         title:req.body.title,
//         content:req.body.content
//     });
//     newArticle.save((err)=>{
//         if (!err) {
//             res.send("Successfully added a new article");
//         }else{
//             res.send(err);
//         }
//     });
// });

// app.delete("/articles",(req,res)=>{
//     Article.deleteMany({},(err)=>{
//         if (!err) {
//             res.send("Successfully deleted all the articles");
//         }else{
//             res.send(err);
//         }
//     });
// });

// Better routing for the same route
app.route("/articles").get((req,res)=>{
    // res.send("Hello world");
    Article.find({},(err,foundArticles)=>{
        if (!err) {
            // console.log(foundArticles);
            res.send(foundArticles);           
        }else{
            console.log(err);
        }
    });}).post((req,res)=>{
        const newArticle=new Article({
            title:req.body.title,
            content:req.body.content
        });
        newArticle.save((err)=>{
            if (!err) {
                res.send("Successfully added a new article");
            }else{
                res.send(err);
            }
        });
    }).delete((req,res)=>{
        Article.deleteMany({},(err)=>{
            if (!err) {
                res.send("Successfully deleted all the articles");
            }else{
                res.send(err);
            }
        });
    });

//************API routes for a specific article*************
app.route("/articles/:articleTitle")
.get((req,res)=>{
    Article.findOne({title:req.params.articleTitle},(err,foundArticle)=>{
        if (foundArticle) {
            res.send(foundArticle);
        }else{
            res.send("No article found with that name!");
        }
    });
})
.put((req,res)=>{
    Article.replaceOne({title:req.params.articleTitle},{title:req.body.title,content:req.body.content},(err)=>{
        if (!err) {
            res.send("Successfully updated(put) the article");
        }else{
            res.send(err);
        }
    });
})
.delete((req,res)=>{
    Article.deleteOne({title:req.params.articleTitle},(err)=>{
        if (!err) {
            res.send("Successfully deleted the article");
        }else{
            res.send(err);
        }
    });
})
.patch((req,res)=>{
    Article.updateOne({title:req.params.articleTitle},{$set:{title:req.body.title,content:req.body.content}},(err)=>{
        if (!err) {
            res.send("Successfully updated(patched) the article");
        }else{
            res.send(err);
        }
    });
})



app.listen(port,()=>{
    console.log(`server listening on port ${port}`);
});
