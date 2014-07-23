
var models = require('../../../mongoosemodels')

module.exports.getProjects=function(req,res,next){
   returnObject=new Object();
  var userid=req.query.userid;
  var projectQuery={};
 
  if(typeof userid !== 'undefined'){
      projectQuery['userid']=userid;
  }

 models.ProjectModel.find(projectQuery,function(err,results){
      //console.log("getAssets result: " + JSON.stringify(results));
      //returnObject.data=results;
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(results));

    });
	
	
}


module.exports.getProject=function(req,res,next){
   returnObject=new Object();
  var projectid=req.params.projectid;
  projectQuery={}
 
  if(typeof projectid !== 'undefined'){
      projectQuery['_id']=projectid;
  }

 models.ProjectModel.findOne(projectQuery,function(err,results){
      //console.log("getAssets result: " + JSON.stringify(results));
      //returnObject.data=results;
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(results));

    });
  
  
}



module.exports.getProjectAssetAssemblies=function(req,res,next){
  //console.log('getProject ' +  req.params.projectid);
  pool.getConnection(function(err, connection) {
              var projectQuery = "select * from projectassetassembly where projectid=" + req.params.projectid;


             if (err){
                    var error=new Error("Database Connection Error");
                    error.http_code=500;
                    error.error_type='Internal Server Error';
              next(error);
                            //console.log("getConnection error: " + err);
                            //doneAllQueries("Error","Internal Database Connection Error");
                            //returnObject.response="Error";
                            //returnObject.message="Internal Database Connection Error";
                            //res.end(JSON.stringify(returnObject));
                            //res.status(404).send('Not found');
                            //return; //we're done
             }
            
             connection.query(projectQuery,function(err,rows){

               
                 if (err){
                      var error=new Error("Database Query Error");
                    error.http_code=500;
                    error.error_type='Internal Server Error'
              next(error);
                            //console.log("database query error: " + err); 
                            //returnObject.response="Error";
                            //returnObject.message="Internal Database Query Error";
                            //res.end(JSON.stringify(returnObject));
                           // res.status(404).send('Not found');
                            //return;
                  }

                  //succeeded
                  //console.log(JSON.stringify(rows));

                  if(rows.length > 0){
                    res.writeHead(200, {'Content-Type': 'application/json'});
                  res.end(JSON.stringify(rows));
                }
                else{
                  var error=new Error("Not Found");
                    error.http_code=404;
                    error.error_type='Client Error';
              next(error);
              //return;

                }
              //console.log(JSON.stringify(rows));
              });

          });
}

module.exports.handleError=function(err, req, res, next) {
    res.send(err.http_code, {status:err.http_code, message: err.message, type:err.error_type});
}