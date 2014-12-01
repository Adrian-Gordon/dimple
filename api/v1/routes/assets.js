var models = require('../../../mongoosemodels');
var ObjectId = require('mongoose').Types.ObjectId; 


module.exports.getAssets=function(req,res,next){
    
        var query=req.query;
        //console.log("query: " + JSON.stringify(req.query));
        var userid=req.query.userid;
        var assettypeid=query.assettypeid;
        //for pagination
        var startAt=query.startAt;
        var count=query.count;

        var countQuery={};
        returnObject=new Object();

        if(typeof userid !== 'undefined'){
            countQuery['userid']=userid;
        }

        if(typeof assettypeid !== 'undefined'){
          countQuery['assetTypeId']=assettypeid;
        }


        models.AssetModel.count(countQuery,function(err,assetsCount){
              //console.log("count is: " + assetsCount);

              returnObject.total=assetsCount;
              returnObject.count=count;
              returnObject.startAt=startAt;

              var assetQuery={};
              var limits={};
              if(typeof userid !== 'undefined'){
                  assetQuery['userid']=userid;
              }

              if(typeof assettypeid !== 'undefined'){
                assetQuery['assetTypeId']=assettypeid;
              }


              if(typeof startAt !=='undefined' && typeof count !== 'undefined'){
                models.AssetModel.find(assetQuery).skip(startAt).limit(count).exec(function(err,results){
                  //console.log("getAssets result: " + JSON.stringify(results));
                  returnObject.data=results;
                  res.writeHead(200, {'Content-Type': 'application/json'});
                  res.end(JSON.stringify(returnObject));

                });
              }
              else{

                models.AssetModel.find(assetQuery).exec(function(err,results){
                  //console.log("getAssets result: " + JSON.stringify(results));
                  
                  res.writeHead(200, {'Content-Type': 'application/json'});
                  res.end(JSON.stringify(results));

                });

              }
              

        });


	
}


module.exports.getAsset=function(req,res,next){
    var assetid=req.params.assetid;

     models.AssetModel.findOne({_id:assetid}, function (err, doc){
    
    if(typeof doc =='undefined'){

       res.end(null);
    }
    else{

      res.end(JSON.stringify(doc));

    }
  // doc is a Document
  });
}



module.exports.addAsset=function(req,res){


  //create the new AssetAssembly

        var newAsset=new models.AssetModel({
              

               assetDescription:req.param('assetDescription'),
               assetTypeId:req.param('assetTypeId'),
               rating:req.param('rating'),
               posterAsset:req.param('posterAsset'),
               userid:req.param('userid'),
               assetSubtypeId:req.param('assetSubtypeId'),
               version:req.param('version')



            });

           newAsset.save(function (err) {
                 if (err) console.log("Add Asset error:" + err);
                 console.log("Saved new Asset " + JSON.stringify(newAsset));
                 res.end(JSON.stringify(newAsset));
           });
}











module.exports.updateAsset=function(req,res,next){
  
            
            var asset=req.body;

    
            var id= req.body._id;
            var assetsubtypeid= req.body.assetSubtypeId;
            var assettypeid= req.body.assetTypeId;
            var assetdescription= req.body.assetDescription;
            var posterassetid= req.body.posterAsset;
            var rating =req.body.rating;
            var userid =req.body.userid;
            var version =req.body.version;
            var captions=req.body.captions;
            var presentations=req.body.presentations;

           // AssetModel.update({_id:id},
            //       {$set:{"assetSubtypeId":assetsubtypeid,"assetTypeId":assettypeid,"assetDescription":assetdescription,"posterAsset":posterassetid,"rating":rating,"userid":userid,"version":version,"captions":captions,"presentations":presentations}});

            models.AssetModel.findOne({_id:id},function(err,asset){
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
            });
            
}










