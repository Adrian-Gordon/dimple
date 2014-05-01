module.exports.getAssetAssemblies=function(req,res,next){

	

	//console.log('getUsers')
	pool.getConnection(function(err, connection) {
              var assetAssembliesQuery="select * from assetassembly";
             

             
             
            
              connection.query(assetAssembliesQuery,function(err,rows){

               
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
                  res.writeHead(200, {'Content-Type': 'application/json'});
          			res.end(JSON.stringify(rows));
          		//console.log(JSON.stringify(rows));
              });

          });
}



module.exports.getAssetAssembly=function(req,res,next){
	pool.getConnection(function(err, connection) {
              var assetAssemblyQuery = "select * from assetassembly where assetassemblyid=" + req.params.assetassemblyid;


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
            
             connection.query(assetAssemblyQuery,function(err,rows){

               
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