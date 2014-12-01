
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


//{"projectTitle":"New Project","description":"A New dimple Project","bannerAsset":424,"userid":0,"assetAssemblies":[]}
module.exports.addProject=function(req,res){
   //create the new Project

        var newProject=new models.ProjectModel({
              projectTitle:req.param('projectTitle'),
              description:req.param('description'),
              bannerAsset:req.param('bannerAsset'),
              userid:req.param('userid'),
              assetAsemblies:req.param('assetAssemblies')


            });

           newProject.save(function (err) {
                 if (err) console.log("Add newProject error:" + err);
                 console.log("Saved new Project: " + JSON.stringify(newProject));
                 res.end(JSON.stringify(newProject));
           });


}

module.exports.deleteProject=function(req,res){

  var id= parseInt(req.params.projectid);

    console.log("Delete project: " + id);

    models.ProjectModel.findOneAndRemove({_id:id},function(err){
          if(err)console.log('models.ProjectModel.findOneAndRemove err: ' + err);
          else console.log('models.projectModel.findOneAndRemove done' );
        });

    
    res.end();
}



//{"_id":2,"projectTitle":"A Testy thing thing","description":"A test. Location based content about something or other thing","bannerAsset":1086,"userid":1,"__v":0,"assetAssemblies":[{"assetAssemblyId":370,"visible":true,"_id":"539760aa75168f1c03957a81"},{"assetAssemblyId":371,"visible":true,"_id":"539760aa75168f1c03957a82"},{"assetAssemblyId":377,"visible":true,"_id":"539760aa75168f1c03957a83"},{"assetAssemblyId":378,"visible":true,"_id":"539760aa75168f1c03957a84"},{"assetAssemblyId":1010,"visible":true}]}

module.exports.updateProject=function(req,res,next){
  
            
            var project=req.body;

            var id= req.body._id;
           /* var set={
            
                 projectTitle:req.body.projectTitle,
                 description:req.body.description,
                 bannerAsset:req.body.bannerAsset,
                 userid:req.body.userid,
                 assetAssemblies:req.body.assetAssemblies
            };*/

          //  models.ProjectModel.update({_id:id},{$set:set},{},function(err,num){


           // });
                //   {$set:{"assetSubtypeId":assetsubtypeid,"assetTypeId":assettypeid,"assetDescription":assetdescription,"posterAsset":posterassetid,"rating":rating,"userid":userid,"version":version,"captions":captions,"presentations":presentations}});

         /*   models.AssetModel.findOne({_id:id},function(err,asset){
              asset.assetSubtypeId=assetsubtypeid;
              asset.assetTypeId=assettypeid;
              asset.assetDescription=assetdescription;
              asset.posterAsset=posterassetid;
              asset.rating=rating;
              asset.userid=userid;
              asset.version=version;
              asset.captions=captions;
              asset.presentations=presentations;
              asset.save();
              res.end(JSON.stringify(asset));
            });*/


            models.ProjectModel.findOne({_id:id}, function(err,updatedProject){
              if(updatedProject){
                updatedProject.projectTitle=project.projectTitle;
                updatedProject.description=project.description;
                updatedProject.bannerAsset=project.bannerAsset;
                updatedProject.userid=project.userid;
                updatedProject.assetAssemblies=project.assetAssemblies;

                updatedProject.save();
                res.end(JSON.stringify(updatedProject));
              }
              else{
                res.end();
              }


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