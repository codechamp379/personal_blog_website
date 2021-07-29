const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. "
const aboutContent = "Curabitur suscipit sapien sit amet nibh rhoncus, at suscipit ligula mattis. Aenean mollis convallis sapien, porttitor dapibus odio mattis ac. Phasellus at rutrum mi, eu lacinia erat. Morbi pulvinar, est et viverra cursus, enim magna ullamcorper odio, vel mollis eros quam non turpis."
const contactContent = "Nullam vitae eleifend elit. Suspendisse accumsan tortor a auctor finibus. Nunc egestas mi ac dui pulvinar dignissim. Vestibulum lacinia lacus tellus, sit amet volutpat sapien hendrerit ut. Proin quis aliquet lorem, et porttitor ligula."
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/blogDB",{ useNewUrlParser: true , useUnifiedTopology: true});
const postSchema = new mongoose.Schema({
    title : String,
    content : String
});

const Post = mongoose.model("Post",postSchema);


app.get('/',(req,res)=>{
    Post.find({},function(err,my_posts){
        return res.render('home',{textString : homeStartingContent,
            posts : my_posts
        });
    });
});
app.get('/about',(req,res)=>{
    return res.render('about',{aboutString : aboutContent});
});
app.get('/contact',(req,res)=>{
    return res.render('contact',{contactString : contactContent});
});
app.get('/compose',(req,res)=>{
    return res.render('compose');
});
app.get('/posts/:postName',(req,res)=>{
    const requestedPostId = req.params.postName;
    Post.findOne({_id : requestedPostId},function(err,post){
        res.render("post",{
           title : post.title,
           content : post.content 
        });
    });
});
app.post('/compose',(req,res)=>{
  const post = new Post({
      title : req.body.postTitle,
      content : req.body.postBody
  });
  post.save(function(err){
      if(err)
       console.log(err);
      else
       res.redirect('/');
  });
});

app.listen(3000,'127.0.0.1');