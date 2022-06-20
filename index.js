const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser=require('body-parser');
const session = require('express-session');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.set('view engine', 'ejs')

const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'node'
});

conn.connect(function(err){
    if(err) throw err;
    console.log("Connection Successfully...");
});

app.get('/', function(req,res){
    res.render('signup');
});

app.post('/signup',function(req,res){
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var sql=`insert into user(name,email,password) values('${name}','${email}','${password}')`;
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.redirect('/');
    })
});

app.get('/login',function(req,res){
    var invalidcre = '';
    res.render('login',{invalidcre: invalidcre});
});

app.post('/login',function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    if(email && password){
        var sql = `select * from user where email='${email}' && password='${password}'`;
        conn.query(sql,function(err,results){
            if(results.length>0){
                req.session.loggedin=true;
                req.session.email=email;
                res.redirect('/welcome');
            }else{
                var invalidcre = "Please Enter Valid Email ID and Password";
                res.render('login',{invalidcre: invalidcre});
            }
        });

    }else{
        res.send("<h1>please enter email and password</h1>");
    }
});

app.get('/welcome',function(req,res){
    if(req.session.loggedin){
        var useremail = req.session.email;
        res.render('welcome',{user: useremail});
    }else{
        res.redirect('/login');
    }
});

app.get('/logout',function(req,res){
    req.session.destroy((err)=>{
        res.redirect('/login');
    })
});

const server=app.listen(4000,function(){
    console.log("App Running on 4000...");
})