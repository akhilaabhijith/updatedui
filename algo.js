
const {app,connection}=require('./login');





const weekend=app.get("/weekend",function(req,res){
    res.sendFile(__dirname+"/weekend.html")
})

function algo(result,a,b, c, d)
{
    var TL= result.filter(obj => {
        return obj.emp_grp === 'TL'
      })
     // console.log(TL.slice(0,a))
      var A=result.filter(obj => {
        return obj.emp_grp === 'A'
      })
     // console.log(A.slice(0,b))
      var B=result.filter(obj => {
        return obj.emp_grp === 'B'
      })
      //console.log(B.slice(0,c))
      var C=result.filter(obj => {
        return obj.emp_grp === 'C'
      })
      //console.log(C.slice(0,d))
       
      console.log(TL,A,B,C)
}



module.exports=weekend;







