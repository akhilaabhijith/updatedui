const validator=require('validator');
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();
const mysql = require('mysql')


const app = express();
app.use("/assets",express.static("assets"));


const connection = new mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodejs"
});

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
});


app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from loginuser where user_name = ? and user_pass = ?",[username,password],function(error,results,fields){
        if (results.length > 0) {
            res.redirect("/L1");
        } else {
            res.redirect("/");
        }
        res.end();
    })
})

// when login is success
app.get("/L1",function(req,res){
    res.sendFile(__dirname + "/L1.html")
})


app.get("/weekend",function(req,res){  
    res.sendFile(__dirname+"/weekend.html")
})
app.get("/insert",function(req,res){  
    res.sendFile(__dirname+"/insert.html")
})
app.get("/modify",function(req,res){  
    res.sendFile(__dirname+"/modify.html")
})
app.get("/delete",function(req,res){  
    res.sendFile(__dirname+"/delete.html")
})

app.post("/weekend",encoder, function(req,res){
    var tl = req.body.a;
    var ga = req.body.b;
    var gb = req.body.c;
    var gc = req.body.d;
    var myarr = []

    connection.query("select employee.emp_name,employee.emp_grp from employee INNER JOIN (SELECT employee.emp_name ,count(*) as count,max(weekendshifts.date) as recent_date FROM employee INNER JOIN weekendshifts ON employee.emp_id=weekendshifts.emp_id group by emp_name ) AS emp_count on employee.emp_name=emp_count.emp_name ORDER BY emp_grp,count,recent_date;" ,function(err,result,fields){
    
        if (err) throw err;
    
       result =JSON.parse( JSON.stringify(result));
        myarr = algo(result,tl,ga,gb,gc);
        console.log(myarr);
        console.log(typeof(myarr));
        if(myarr.length>0){
            var html = '' ;
            html+="<style>";
            html+=".styled-table";
            html+="{";
            html+= "border-collapse: collapse;"
            html+=    "margin: 25px 0;"
            html+=    "font-size: 0.9em;"
            html+=    "font-family: sans-serif;"
            html+=    "min-width: 400px;"
            html+=   "box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);"
            html+="}";
            html+=".styled-table thead tr { background-color: #009879;color: #ffffff; text-align: left;}";
            html+=".styled-table th,.styled-table td { padding: 12px 15px;}";
            html+=".styled-table tbody tr {border-bottom: 1px solid #dddddd;}";
            html+=".styled-table tbody tr:nth-of-type(even) {background-color: #f3f3f3;}";
            html+=".styled-table tbody tr:last-of-type {border-bottom: 2px solid #009879;}";
            html+=".styled-table tbody tr.active-row {font-weight: bold;color: #009879;}";
            html+="</style>"
            html+="<table class='styled-table'>"
            for(let i=0;i<myarr.length;i++)
            { 
                html = html+"<tr> <td>";
                html = html + myarr[i].emp_name+"</td>";
                html = html + "<td>" + myarr[i].emp_grp+"</td> </tr>";                
                // s=s+myarr[i].emp_name+"  "+myarr[i].emp_grp;
            }
            html = html + "</table>";
            
           res.send(html);
        }else{
            res.send(
                "<h1> No Yo boy </h1>"
            );
        }
        
        
    })
  
})

function algo(result,a,b, c, d)
{
    var myarr = []
    var TL= result.filter(obj => {
        return obj.emp_grp === 'TL'
      })
    var tl = TL.slice(0,a)
    myarr.push(...tl)
    //  console.log(TL.slice(0,a))
      var A=result.filter(obj => {
        return obj.emp_grp === 'A'
      })
      var ga = A.slice(0,b)
      myarr.push(...ga)
    //  console.log(A.slice(0,b))
      var B=result.filter(obj => {
        return obj.emp_grp === 'B'
      })
      var gb = B.slice(0,c)
      myarr.push(...gb)
    //   console.log(B.slice(0,c))
      var C=result.filter(obj => {
        return obj.emp_grp === 'C'
      })
      var gc= C.slice(0,d)
      myarr.push(...gc)
    //   console.log(C.slice(0,d))
    
      return myarr;
    //   console.log(TL,A,B,C)
}

app.post("/insert",encoder, function(req,res){
    var emp_name = req.body.emp_name;
    
    var emp_id = req.body.emp_id;
    
    var emp_grp=req.body.emp_grp;
    
    var sql = `INSERT INTO employee (emp_id,emp_name,emp_grp ) VALUES ('${emp_id}', '${emp_name}', '${emp_grp}' )`;

    connection.query(sql,function (err, data) {
        if (err) throw err;
        
        });
    res.redirect('/insert');
    // res.end();
});

app.post("/modify",encoder, function(req,res){
    var emp_name = req.body.emp_name;
    
    var emp_id = req.body.emp_id;
    // console.log(emp_id);
    var emp_grp=req.body.emp_grp;
    // console.log(emp_grp);
    
   
    var sql =  `UPDATE employee SET emp_grp= '${emp_grp}' WHERE emp_id = '${emp_id}'`;

    connection.query(sql,function (err, data) {
        if (err) throw err;
        
        });
    res.redirect('/modify');
    // res.end();
});

app.post("/delete",encoder, function(req,res){
    var emp_name = req.body.emp_name;
    
    var emp_id = req.body.emp_id;
    // console.log(emp_id);
    
    
   
    var sql =  `DELETE from employee WHERE emp_id = '${emp_id}'`;

    connection.query(sql,function (err, data) {
        if (err) throw err;
        
        });
    res.redirect('/delete');
    // res.end();
});



// set app port 
app.listen(4000);



