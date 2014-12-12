var models = require('../../../mongoosemodels')
var ObjectId = require('mongoose').Types.ObjectId; 

module.exports.getAssetAssembliesSQL=function(req,res,next){

	

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




module.exports.addAssetAssembly=function(req,res){


  //create the new AssetAssembly

        var newAssetAssembly=new models.AssetAssemblyModel({
              assetAssemblyDescription:req.param('assetAssemblyDescription'),
              icon:req.param('icon'),
              layarImageUrl:req.param('layarImageUrl'),
              imageAsset:req.param('imageAsset'),
              textElements:req.param('textElements'),
              assets:[],
              location:req.param('location')


            });

           newAssetAssembly.save(function (err) {
                 if (err) console.log("Add AssetAssembly error:" + err);
                 console.log("Saved new AssetAssembly: " + JSON.stringify(newAssetAssembly));
                 res.end(JSON.stringify(newAssetAssembly));
           });
}


module.exports.getAssetAssembly=function(req,res){
  var aaid=req.params.assetassemblyid;
  logger.info("getAssetAssembly " + aaid);

  models.AssetAssemblyModel.findOne({"_id":aaid}, function (err, assetAssembly){
  //UserModel.findOne({"projects.assetAssemblies":{$elemMatch:{_id:aaid}}}, function (err, user){
    
    if(err)console.log("Error: " + err);

  //  console.log("user: " + JSON.stringify(user));
    if((typeof assetAssembly =='undefined')||(assetAssembly===null)){

       res.end(null);
    }
    else{
      
      res.end(JSON.stringify(assetAssembly));

    }
  // doc is a Document
  });
}

module.exports.updateAssetAssembly=function(req,res){
      var assetAssembly=req.body;

    
      var id= req.body._id;
      var assetAssemblyDescription= req.body.assetAssemblyDescription;
      var icon= req.body.icon;
      var layarImageUrl= req.body.layarImageUrl;
      var textElements= req.body.textElements;
      var assets =req.body.assets;
      var location =req.body.location;
      var imageAsset=req.body.imageAsset;
      
      console.log("update AA textElement:" + JSON.stringify(textElements));
     // AssetModel.update({_id:id},
      //       {$set:{"assetSubtypeId":assetsubtypeid,"assetTypeId":assettypeid,"assetDescription":assetdescription,"posterAsset":posterassetid,"rating":rating,"userid":userid,"version":version,"captions":captions,"presentations":presentations}});

      models.AssetAssemblyModel.findOne({_id:id},function(err,assetAssembly){
        assetAssembly.assetAssemblyDescription=assetAssemblyDescription;
        assetAssembly.icon=icon;
        assetAssembly.layarImageUrl=layarImageUrl;
        assetAssembly.textElements=textElements;
        assetAssembly.assets=assets;
        assetAssembly.location=location;
        assetAssembly.imageAsset=imageAsset;

        assetAssembly.save();
        res.end(JSON.stringify(assetAssembly));
      });



}

module.exports.deleteAssetAssembly=function(req,res){
    var id= parseInt(req.params.assetassemblyid);

    console.log("Delete AssetAssembly: " + id);

    models.ProjectModel.find({assetAssemblies:{$elemMatch:{assetAssemblyId:id}}}, function (err, projects){
        //console.log("remove AA from projects: " + JSON.stringify(projects));

        for(i in projects){ //remove the asset assembly from any projects it is used in
          var project=projects[i];
          console.log("remove AA from project: " + JSON.stringify(project));
          var pid = project._id;
          
          models.ProjectModel.update({_id:pid},{$pull:{'assetAssemblies':{assetAssemblyId:id}}},function(err){
            if(err)console.log('models.ProjectModel.update err: ' + err);
            else console.log('models.ProjectModel.update success');
          });



        }
        //and remove the Asset Assembly itself
        models.AssetAssemblyModel.findOneAndRemove({_id:id},function(err){
          if(err)console.log('models.AssetAssemblyModel.findOneAndRemove err: ' + err);
          else console.log('models.AssetAssemblyModel.findOneAndRemove done' );
        });
    });
    res.end();
}






