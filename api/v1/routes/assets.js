


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


        AssetModel.count(countQuery,function(err,assetsCount){
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
                AssetModel.find(assetQuery).skip(startAt).limit(count).exec(function(err,results){
                  //console.log("getAssets result: " + JSON.stringify(results));
                  returnObject.data=results;
                  res.writeHead(200, {'Content-Type': 'application/json'});
                  res.end(JSON.stringify(returnObject));

                });
              }
              else{

                AssetModel.find(assetQuery).exec(function(err,results){
                  //console.log("getAssets result: " + JSON.stringify(results));
                  
                  res.writeHead(200, {'Content-Type': 'application/json'});
                  res.end(JSON.stringify(results));

                });

              }
              

        });


	
}


module.exports.getAsset=function(req,res,next){
    var assetid=req.params.assetid;

     AssetModel.findOne({_id:assetid}, function (err, doc){
    
    if(typeof doc =='undefined'){

       res.end(null);
    }
    else{

      res.end(JSON.stringify(doc));

    }
  // doc is a Document
  });
}






module.exports.addAsset=function(req,res,next){
  var assetDescription=req.param('assetDescription');
  var assetTypeId=req.param('assetTypeId');
  var rating=req.param('rating');
  var posterAsset=req.param('posterAsset');
  var userid=req.param('userid');
  var assetSubtypeId=req.param('assetSubtypeId');
  var version=req.param('version');



  createNewAsset(res,assetDescription,assetTypeId,assetSubtypeId,rating,posterAsset,userid,version,[],[]);

 //var id=getNextAssetId();
  

  /*
  pool.getConnection(function(err, connection) {
            
            
            var assetdescription=req.param('assetdescription');
            var assettypeid=req.param('assettypeid');
            var rating=req.param('rating');
            var posterassetid=req.param('posterassetid');
            var userid=req.param('userid');
            var assetsubtypeid=req.param('assetsubtypeid');
            var version=req.param('version');
            
            console.log("req.body:" + JSON.stringify(req.query));
              var assetQuery = "insert into asset values(null,'" + assetdescription + "'," + assettypeid +"," + rating + "," + posterassetid + "," + userid + "," + assetsubtypeid + "," + version + ");";

              console.log("insert query: " + assetQuery);
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
            
             connection.query(assetQuery,function(err,rows){
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
                  console.log(JSON.stringify(rows));
                  console.log("new asset: " + rows.insertId);
                  res.end(JSON.stringify(rows));

                  //if(rows.length > 0){
                  //  res.writeHead(200, {'Content-Type': 'application/json'});
                  //res.end(JSON.stringify(rows));
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

          });*/
}


function createNewAsset(res,assetDescription,assetTypeId,assetSubtypeId,rating,posterAsset,userid,version,captions,presentations) {
   db.counters.findAndModify(
          {
            query: { _id: "assetid" },
            update: { $inc: { seq: 1 } },
            new: true
          },
          function(err,obj){
            console.log("getNextAssetId err: " + err + " obj: " + JSON.stringify(obj));
            

            var newAsset=new AssetModel({
                _id:obj.seq,
                assetDescription: assetDescription,
                assetTypeId:assetTypeId,
                assetSubtypeId:assetSubtypeId,
                rating:rating,
                posterAsset: posterAsset,
                userid: userid,
                version: version,
                captions:[],
                presentations:[]


            });
           newAsset.save(function (err) {
                 if (err) console.log("Add Asset error:" + err);
                 console.log("Saved new Asset: " + JSON.stringify(newAsset));
                 res.end(JSON.stringify(newAsset));
           });
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

            AssetModel.findOne({_id:id},function(err,asset){
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

module.exports.updateAssetOld=function(req,res,next){
	pool.getConnection(function(err, connection) {
            
            var asset=req.body;

    
            var assetid= req.body.assetid;
            var assetsubtypeid= req.body.assetsubtypeid;
            var assettypeid= req.body.assettypeid;
            var assetdescription= req.body.assetdescription;
            var posterassetid= req.body.posterassetid;
            var rating =req.body.rating;
            var userid =req.body.userid;
            var version =req.body.version;

            
            console.log("req.body:" + JSON.stringify(req.body));
             // var userProjectQuery = "insert into project values(null," + userid + ",'" + title +"','" + description + "'," + startdate + "," + enddate + "," + bannerassetid + "," + stylesid + ");";
              var assetQuery="update asset set assetdescription='" + assetdescription +"',assetsubtypeid=" + assetsubtypeid +",assettypeid=" + assettypeid + ",posterassetid=" + posterassetid +",rating=" + rating +",version=" + version + ",userid=" + userid +" where assetid=" + assetid;

              console.log("update query: " + assetQuery);
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
            
             connection.query(assetQuery,function(err,rows){
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
                  res.end(JSON.stringify(asset));

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








