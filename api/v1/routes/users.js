var models = require('../../../mongoosemodels');


module.exports.getUsers=function(req,res,next){
  //console.log("Get users " + UserModel);

  models.UserModel.find({},function(err,docs){
  // console.log("err: " + err + "docs: " + docs);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(docs));
  });

	
}

module.exports.getUser=function(req,res,next){

   models.UserModel.find({_id:req.params.userid},function(err,docs){
   //console.log("err: " + err + "docs: " + docs);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(docs[0]));
  });

}

module.exports.getUserProjects=function(req,res,next){
	var userid=req.params.userid;

   models.UserModel.findOne({_id:userid}, function (err, doc){
    
    if(typeof doc =='undefined'){

       res.end(null);
    }
    else{

      res.end(JSON.stringify(doc.projects));

    }
  // doc is a Document
  });
}

module.exports.getUserProjectsOld=function(req,res,next){
  pool.getConnection(function(err, connection) {
              var userQuery = "select * from project where userid=" + req.params.userid;


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
            
             connection.query(userQuery,function(err,rows){

               
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

                  //if(rows.length > 0){
                  //  res.writeHead(200, {'Content-Type': 'application/json'});
                  res.end(JSON.stringify(rows));
                //}
                //else{
                //  var error=new Error("Not Found");
                //    error.http_code=404;
                //    error.error_type='Client Error';
          //    next(error);
              //return;

                //}
              //console.log(JSON.stringify(rows));
              });

          });
}



module.exports.addUserProject=function(req,res,next){
	pool.getConnection(function(err, connection) {
            
            var project=req.body;
            var title=req.body.title;
            var description=req.body.description;
            var startdate=req.body.startdate;
            var enddate=req.body.enddate;
            var bannerassetid=req.body.bannerassetid;
            var stylesid=req.body.stylesid;
            var userid=req.body.userid;
            
            console.log("req.body:" + JSON.stringify(req.body));
              var userProjectQuery = "insert into project values(null," + userid + ",'" + title +"','" + description + "'," + startdate + "," + enddate + "," + bannerassetid + "," + stylesid + ");";

              console.log("insert query: " + userProjectQuery);
             if (err){
             				var error=new Error("Database Connection Error");
             				error.http_code=500;
             				error.error_type='Internal Server Error';
							next(error);
                            console.log("getConnection error: " + err);
                            //doneAllQueries("Error","Internal Database Connection Error");
                            //returnObject.response="Error";
                            //returnObject.message="Internal Database Connection Error";
                            //res.end(JSON.stringify(returnObject));
                            //res.status(404).send('Not found');
                            //return; //we're done
             }
            
             connection.query(userProjectQuery,function(err,rows){
                 console.log("rows: " + JSON.stringify(rows));
               
                 if (err){
                 			var error=new Error("Database Query Error");
             				error.http_code=500;
             				error.error_type='Internal Server Error'
							next(error);
                            console.log("database query error: " + err); 
                            //returnObject.response="Error";
                            //returnObject.message="Internal Database Query Error";
                            //res.end(JSON.stringify(returnObject));
                           // res.status(404).send('Not found');
                            //return;
                  }

                  //succeeded
                  //console.log(JSON.stringify(rows));
                  console.log("new project: " + rows.insertId);
                  project.projectid=rows.insertId;
                  res.end(JSON.stringify(project));

                  //if(rows.length > 0){
                	//	res.writeHead(200, {'Content-Type': 'application/json'});
          				//res.end(JSON.stringify(rows));
          			//}
          			//else{
          			//	var error=new Error("Not Found");
             		//		error.http_code=404;
             		//		error.error_type='Client Error';
					//		next(error);
							//return;

          			//}
          		//console.log(JSON.stringify(rows));
              });

          });
}

module.exports.deleteUserProject=function(req,res,next){
	pool.getConnection(function(err, connection) {
            
            var project=req.body;
            var projectid=req.params.projectid;
            
            
            console.log("req.body:" + JSON.stringify(req.body));
              var userProjectQuery = "delete from project where projectid=" + projectid;

              console.log("delete query: " + userProjectQuery);
             if (err){
             				var error=new Error("Database Connection Error");
             				error.http_code=500;
             				error.error_type='Internal Server Error';
							next(error);
                            console.log("getConnection error: " + err);
                            //doneAllQueries("Error","Internal Database Connection Error");
                            //returnObject.response="Error";
                            //returnObject.message="Internal Database Connection Error";
                            //res.end(JSON.stringify(returnObject));
                            //res.status(404).send('Not found');
                            //return; //we're done
             }
            
             connection.query(userProjectQuery,function(err,rows){
                 console.log("rows: " + JSON.stringify(rows));
               
                 if (err){
                 			var error=new Error("Database Query Error");
             				error.http_code=500;
             				error.error_type='Internal Server Error'
							next(error);
                            console.log("database query error: " + err); 
                            //returnObject.response="Error";
                            //returnObject.message="Internal Database Query Error";
                            //res.end(JSON.stringify(returnObject));
                           // res.status(404).send('Not found');
                            //return;
                  }

                  //succeeded
                  //console.log(JSON.stringify(rows));
                  //console.log("new project: " + rows.insertId);
                  //project.projectid=rows.insertId;
                  res.end(JSON.stringify(project));

                  //if(rows.length > 0){
                	//	res.writeHead(200, {'Content-Type': 'application/json'});
          				//res.end(JSON.stringify(rows));
          			//}
          			//else{
          			//	var error=new Error("Not Found");
             		//		error.http_code=404;
             		//		error.error_type='Client Error';
					//		next(error);
							//return;

          			//}
          		//console.log(JSON.stringify(rows));
              });

          });
}



module.exports.updateUserProject=function(req,res,next){
  var project=req.body;
  var projectTitle=req.body.projectTitle;
  var description=req.body.description;
  var bannerAsset=req.body.bannerAsset;
  var userid=req.body.userid;
  var projectId=req.body._id;

  console.log("updateUserProject " + userid + "  " + projectId);

 // UserModel.update({_id:userid,"projects._id": projectId},
 //                  {$set:{"projects.$.projectTitle":projectTitle,"projects.$.description":description,"projects.$.bannerAsset":bannerAsset}});

 UserModel.findOne({_id:userid},function(err,user){
        var project=user.projects.id(projectId);
        console.log("updateUserProject: " + JSON.stringify(project));
        project.projectTitle=projectTitle;
        project.description=description;
        project.bannerAsset=bannerAsset;
        user.save(function(err){
          //console.log(" updateUserProject err: " + err);
          //console.log(" updateUserProject Project saved: " + JSON.stringify(user));
          res.end(JSON.stringify(project));
        })
  });


}




module.exports.updateUserProjectOld=function(req,res,next){
	pool.getConnection(function(err, connection) {
            
            var project=req.body;
            var projectid=req.body.projectid;
            var title=req.body.title;
            var description=req.body.description;
            var startdate=req.body.startdate;
            var enddate=req.body.enddate;
            var bannerassetid=req.body.bannerassetid;
            var stylesid=req.body.stylesid;
            var userid=req.body.userid;
            
            console.log("req.body:" + JSON.stringify(req.body));
             // var userProjectQuery = "insert into project values(null," + userid + ",'" + title +"','" + description + "'," + startdate + "," + enddate + "," + bannerassetid + "," + stylesid + ");";
              var userProjectQuery="update project set title='" + title +"',description='" + description +"',startdate='" + startdate +"',enddate='" + enddate + "',bannerassetid=" + bannerassetid +",stylesid=" + stylesid +" where projectid=" + projectid;

              console.log("update query: " + userProjectQuery);
             if (err){
             				var error=new Error("Database Connection Error");
             				error.http_code=500;
             				error.error_type='Internal Server Error';
							next(error);
                            console.log("getConnection error: " + err);
                            //doneAllQueries("Error","Internal Database Connection Error");
                            //returnObject.response="Error";
                            //returnObject.message="Internal Database Connection Error";
                            //res.end(JSON.stringify(returnObject));
                            //res.status(404).send('Not found');
                            //return; //we're done
             }
            
             connection.query(userProjectQuery,function(err,rows){
                 console.log("rows: " + JSON.stringify(rows));
               
                 if (err){
                 			var error=new Error("Database Query Error");
             				error.http_code=500;
             				error.error_type='Internal Server Error'
							next(error);
                            console.log("database query error: " + err); 
                            //returnObject.response="Error";
                            //returnObject.message="Internal Database Query Error";
                            //res.end(JSON.stringify(returnObject));
                           // res.status(404).send('Not found');
                            //return;
                  }

                  //succeeded
                  //console.log(JSON.stringify(rows));
                 // console.log("new project: " + rows.insertId);
                  //project.projectid=rows.insertId;
                  res.end(JSON.stringify(project));

                  //if(rows.length > 0){
                	//	res.writeHead(200, {'Content-Type': 'application/json'});
          				//res.end(JSON.stringify(rows));
          			//}
          			//else{
          			//	var error=new Error("Not Found");
             		//		error.http_code=404;
             		//		error.error_type='Client Error';
					//		next(error);
							//return;

          			//}
          		//console.log(JSON.stringify(rows));
              });

          });
}





module.exports.handleError=function(err, req, res, next) {
    res.send(err.http_code, {status:err.http_code, message: err.message, type:err.error_type});
}


module.exports.getUserApiKey=function(username){
	//in fact, get the api key
	console.log("getUserApiKey " + username);
	return('abcdefghijklmnopqrstuvwxyz1234567890');
}