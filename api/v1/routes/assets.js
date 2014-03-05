


module.exports.getAssets=function(req,res,next){
    
        var query=req.query;
        //console.log("query: " + JSON.stringify(req.query));
        var userid=req.query.userid;
        var assettypeid=query.assettypeid;
        //for pagination
        var startAt=query.startAt;
        var count=query.count;

	//console.log('getUsers')
	pool.getConnection(function(err, connection) {
              var countQuery;
              if((userid !== undefined)&&(assettypeid!==undefined)){
                  countQuery="select count(*) as total from asset where userid=" + userid + " and assettypeid=" + assettypeid;
              }
              else if(userid !== undefined){
                  countQuery="select count(*) as total from asset where userid=" + userid ;
              }
              else if(assettypeid !== undefined){
                  countQuery="select count(*) as total from asset where assettypeid=" + assettypeid ;
              }
              else countQuery="select count(*) as total from asset";
            
              var assetQuery;// = "select * from asset";
              if((userid !== undefined)&&(assettypeid!==undefined)){
                  assetQuery="select * from asset where userid=" + userid + " and assettypeid=" + assettypeid;
              }
              else if(userid !== undefined){
                  assetQuery="select * from asset where userid=" + userid ;
              }
              else if(assettypeid !== undefined){
                  assetQuery="select * from asset where assettypeid=" + assettypeid ;
              }
              else assetQuery="select * from asset";
              
              if((startAt !== undefined)&&(count !== undefined)){ //paginate
                  assetQuery += " LIMIT " + startAt + "," + count;
                  
              }

             // console.log("Assetquery: " + assetQuery);
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
             
             //do the count query
             var returnObject;
             if((startAt!== undefined)&&(count !== undefined)){
                 connection.query(countQuery, function(err,rows){
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
                 }
                 returnObject=rows[0];
                 returnObject.startAt=startAt;
                 returnObject.count=count;
                 
                 connection.query(assetQuery,function(err,rows){

               
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
                  returnObject.data=rows;
                  res.writeHead(200, {'Content-Type': 'application/json'});
          			res.end(JSON.stringify(returnObject));
          		//console.log(JSON.stringify(rows));
              });
                 
                 
                 });  
                 
              
                 
             }
             
            
             else connection.query(assetQuery,function(err,rows){

               
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
                  res.writeHead(200, {'Content-Type': 'application/json'});
          			res.end(JSON.stringify(rows));
          		//console.log(JSON.stringify(rows));
              });

          });
}

module.exports.getAsset=function(req,res,next){
	pool.getConnection(function(err, connection) {
              var assetQuery = "select * from asset where assetid=" + req.params.assetid;


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
            
             connection.query(assetQuery,function(err,rows){

               
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
          				res.end(JSON.stringify(rows[0]));
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

/*module.exports.getUserProjects=function(req,res,next){
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
                	//	res.writeHead(200, {'Content-Type': 'application/json'});
          				res.end(JSON.stringify(rows));
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
*/


/*
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
*/

/*
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
*/

/*
module.exports.updateUserProject=function(req,res,next){
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
              var userProjectQuery="update project set title='" + title +"',description='" + description +"',startdate=" + startdate +",enddate=" + enddate + ",bannerassetid=" + bannerassetid +",stylesid=" + stylesid +" where projectid=" + projectid;

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
*/







