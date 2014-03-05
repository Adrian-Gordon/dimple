


if(typeof String.prototype.endsWith !== "function") {
    /**
     * String.prototype.endsWith
     * Check if given string locate at the end of current string
     * @param {string} substring substring to locate in the current string.
     * @param {number=} position end the endsWith check at that position
     * @return {boolean}
     *
     * @edition ECMA-262 6th Edition, 15.5.4.23
     */
    String.prototype.endsWith = function(substring, position) {
        substring = String(substring);

        var subLen = substring.length | 0;

        if( !subLen )return true;//Empty string

        var strLen = this.length;

        if( position === void 0 )position = strLen;
        else position = position | 0;

        if( position < 1 )return false;

        var fromIndex = (strLen < position ? strLen : position) - subLen;

        return (fromIndex >= 0 || subLen === -fromIndex)
            && (
                position === 0
                // if position not at the and of the string, we can optimise search substring
                //  by checking first symbol of substring exists in search position in current string
                || this.charCodeAt(fromIndex) === substring.charCodeAt(0)//fast false
            )
            && this.indexOf(substring, fromIndex) === fromIndex
        ;
    };
}

/*Authentication*/
 var authenticateAPI = function(req, res, next){
  //console.log("authenticate API");
  if (req.isAuthenticated()) { //we're logged in
     // console.log("We're authenticated");
      return next(); 
    }
    else{ //see if username/parameters match

      console.log("check call username api key");
      console.log("req: " + JSON.stringify(req.query));
      var username=req.query.username;
      var apikey=req.query.apikey;

     // console.log("username: " + username + " apikey: " + apikey);

      if((username !== undefined)&&(users.getUserApiKey(username)===apikey)){
       // console.log("API auth OK");
        return next();
      }
     // else{
       // console.log("API auth not OK");
      //  res.send(401,{status:401,message:"Not Authorised",type:"Authorisation Error"});
      //}

    }
  //res.redirect('/login.html');
  res.send(401,{status:401,message:"Not Authorised",type:"Authorisation Error"});
};

var authenticate=function(req,res,next){
  if (req.isAuthenticated()) { //we're logged in
     // console.log("req[user]: " + JSON.stringify(req["user"]));
      res.cookie('dimpleuserid',req["user"].userid,{maxAge:2592000000});
      return next(); 
    }
    res.redirect('/login.html');
}






var http = require('http')
var mysql = require('mysql');
var url  = require('url');
var express = require('express');
var app = express();
var projects=require('./api/v1/routes/projects');
var users=require('./api/v1/routes/users');
var assets=require('./api/v1/routes/assets');
passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;

var fs = require('fs'),
request = require('request');

app.set('port', process.env.PORT || 3000);


app.use(express.cookieParser("secret"));
app.use(express.session({
    secret: 'keyboard cat'
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.bodyParser());    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
//app.get('/hello', function(req, res) {
 // res.render('hello', { message: 'Congrats, you just set up your app!' });
//});

//projects.getProjects('a','b');

app.use(app.router);

passport.use(new LocalStrategy(
 
    function(username, password, done) {
 
        return check_auth_user(username,password,done);
 
    }
 
    ));
 


app.get('/SelectImageAP',selectImageAP);
app.get('/GetAllProjectAssemblies',getAllProjectAssemblies);
app.get('/AssembleAssets', assembleAssets); 
app.get('/GenerateStylesheet',generateStylesheet);

app.post('/UploadImageFromUrl',authenticateAPI,uploadImageFromUrl);


//RESTful API

//projects
app.get('/api/v1/projects/',authenticateAPI,projects.getProjects);
app.get('/api/v1/projects/:projectid',authenticateAPI,projects.getProject);


app.use('/api/v1/projects/',projects.handleError);



//app.use(function(err, req, resp, next) {
 //   resp.send('Ooops, something went wrong with a project');
//});

//users
app.get('/api/v1/users/', authenticateAPI,users.getUsers);
app.get('/api/v1/users/:userid',authenticateAPI,users.getUser);
app.get('/api/v1/users/:userid/projects/',authenticateAPI,users.getUserProjects);
app.post('/api/v1/users/:userid/projects/',authenticateAPI,users.addUserProject);
app.delete('/api/v1/users/:userid/projects/:projectid',authenticateAPI,users.deleteUserProject);
app.put('/api/v1/users/:userid/projects/:projectid',authenticateAPI,users.updateUserProject);


//assets

app.get('/api/v1/assets/',authenticateAPI,assets.getAssets);


app.use('/api/v1/users/',users.handleError);

/*End restful api*/

/*dimple Console*/

//login form submit as post
 
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/dimpleconsole.html',
        failureRedirect: '/login.html'
    })
    );

app.get('/dimpleconsole.html',authenticate); //must be logged in to go to the console

/*End  dimple console*/

/*Static pages*/
app.use(express.static(__dirname + '/public'));


 pool  = mysql.createPool({
    host     : 'dimpledbinstance.ck95qqenkefj.eu-west-1.rds.amazonaws.com',
    user     : 'dimpledbuser',
    password : 'dimpledbpw',
    database: 'dimpledb'
});

/*Authentication*/
 


function check_auth_user(username,password,done,public_id){
    
   

    pool.getConnection(function(err, connection) {
      var sql="SELECT * FROM user WHERE username = '"+ username +"' and userpassword = '"+ password +"' limit 1";

      //console.log(sql);
        if (err){
                    var error=new Error("Database Connection Error");
                    error.http_code=500;
                    error.error_type='Internal Server Error';
                    throw(error);
                    //next(error);
                            //console.log("getConnection error: " + err);
                            //doneAllQueries("Error","Internal Database Connection Error");
                            //returnObject.response="Error";
                            //returnObject.message="Internal Database Connection Error";
                            //res.end(JSON.stringify(returnObject));
                            //res.status(404).send('Not found');
                            //return; //we're done
             }
            
             connection.query(sql,function(err,rows){
              if(connection != null)connection.release();
               if (err){
                      var error=new Error("Database Query Error");
                      error.http_code=500;
                      error.error_type='Internal Server Error'
                     throw(error);
                            //console.log("database query error: " + err); 
                            //returnObject.response="Error";
                            //returnObject.message="Internal Database Query Error";
                            //res.end(JSON.stringify(returnObject));
                           // res.status(404).send('Not found');
                            //return;
                  }
                  if(rows.length > 0){
 
                      var res=rows[0]; 
                      //serialize the query result save whole data as session in req.user[] array  
                      passport.serializeUser(function(res, done) {
                          done(null,res);
                      });
 
                      passport.deserializeUser(function(id, done) {
                          done(null,res);
 
                      });
                     //console.log(JSON.stringify(results));
                      //console.log(results[0]['member_id']);
                      return done(null, res);
                  }else{
                      return done(null, false); 
 
                  }

             });
    });

    
 
}



function selectImageAP(req,res){
    var parsedUrl= require('url').parse(req.url,true);
    var pathName=parsedUrl.pathname;
    var query = parsedUrl.query;

    var assetid=query.assetid;
    var maxwidth=query.maxwidth;

       pool.getConnection(function(err, connection) {
              var assetQuery = "select mimetype, url,localurl,posterurl,localposterurl,quality,width,height,languagecode,version from assetpresentation,asset where assetpresentation.assetid=" + assetid + " and asset.assetid=" + assetid + " order by width desc;";


             if (err){
                            console.log("getConnection error: " + err);
                            //doneAllQueries("Error","Internal Database Connection Error");
                            //returnObject.response="Error";
                            //returnObject.message="Internal Database Connection Error";
                            //res.end(JSON.stringify(returnObject));
                            res.status(404).send('Not found');
                            return; //we're done
             }
             connection.query(assetQuery,function(err,rows){
               if(connection != null)connection.release();

                var redirectUrl="";
                 if (err){
                            console.log("database query error: " + err); 
                            //returnObject.response="Error";
                            //returnObject.message="Internal Database Query Error";
                            //res.end(JSON.stringify(returnObject));
                            res.status(404).send('Not found');
                            return;
                  }
                  
                  var selectedRow;
                  console.log("rows: " + JSON.stringify(rows));
                  for(rowindex in rows){
                    row=rows[rowindex];

                    if(selectedRow === undefined)selectedRow=row;
                    if(row.width <= maxwidth){
                      selectedRow=row;
                      break;
                    }
                    if(row.width < selectedRow.width) selectedRow=row;
                    
                   
                  }

                  if(selectedRow !== undefined){
                    redirectUrl=selectedRow.url;
                    res.writeHead(302, {'location':redirectUrl});
                    res.end();
                  }
                  else res.status(404).send('Not found');
                  //res.end(JSON.stringify(rais));
             });
        });
}



/*GenerateStylesheet*/
function generateStylesheet(req,res){
    var parsedUrl= require('url').parse(req.url,true);
    var pathName=parsedUrl.pathname;
    var query = parsedUrl.query;

    var specis;
    var rais;
    var atisPerRule;

    var useragent=query.useragent;
    var styleid=query.styleid;
    var isWirelessDevice=query.iswireless;
    var app=query.app;

    var doneAllQueries=function(){
        //console.log("Done all queries");
        // res.end(JSON.stringify(atisPerRule));
        var stylesheetText="";//\n<style type=\"text/css\">\n";
         for(key in atisPerRule){
            if((isWirelessDevice=="true")&&(key==".dimple-body")){
                stylesheetText +=  "body{\n";
            }
            else stylesheetText += key + "{\n";
            var attributes=atisPerRule[key];
            for(attribute in attributes){
                var value = attributes[attribute];
                stylesheetText+= attribute + ":";  

                var type=value.type;
                if(type=="string"){
                    stylesheetText+=value.valuestring + ";\n";
                }
                else if(type=="integer"){
                    
                    var si=specis[key+attribute];
                    if(si != undefined){
                        var unit=si.unit;
                        var valOutput=(value.nincrements * ((si.maxi - si.floori)/si.maxincrements)) + si.floori;
                        if((useragent=="iphone-ipod")&&(app=="true")&&(attribute=="font-size")&&(key==".dimple-body")){
                          
                            valOutput=valOutput/3;
                        
                    }
                        stylesheetText+=(valOutput + value.unit + ";\n");
                    }
                    else{
                        stylesheetText+=";\n";
                    }
                 }
                 else{
                     var si=specis[key+attribute];
                    if(si != undefined){
                        var unit=si.unit;
                        var valOutput=(value.nincrements * ((si.maxf - si.floorf)/si.maxincrements)) + si.floorf;
                       
                         stylesheetText+=(valOutput + value.unit + ";\n");
                    }
                    else{
                        stylesheetText+=";\n";
                    }
                   
                 }

                //stylesheetText+= JSON.stringify(value);
            }
             if((key==".dimple-body")&&(isWirelessDevice=="false")&&!(useragent=="sd-emulator-browser"))stylesheetText +="width:800px;";
            stylesheetText +=  "}\n";
         }
        // stylesheetText+="</style>\n";
         res.end(stylesheetText);
    };

    /*Get ruleattrspecinstances for this useragent*/
    
        var returnObject=new Object();
         //specis=new Object();
         //rais=new Object();
         var rasiQuery="select ruleattrspecinstance.rulename as rulename,ruleattrspecinstance.attrname as attrname,ruleattrspec.nincrements as maxincrements,useragent,maxi,maxf,floori,floorf from ruleattrspecinstance,ruleattrspec where ruleattrspec.rulename=ruleattrspecinstance.rulename and ruleattrspec.attrname=ruleattrspecinstance.attrname and useragent='" + useragent + "';";
         var raiQuery="select rulename,attrname,type,valuestring,nincrements,unit from ruleattrinstance  where styleid=" + styleid + ";";

      pool.getConnection(function(err, connection) {
             if (err){
                            console.log("getConnection error: " + err);
                            //doneAllQueries("Error","Internal Database Connection Error");
                            returnObject.response="Error";
                            returnObject.message="Internal Database Connection Error";
                             res.end(JSON.stringify(returnObject));
                            return; //we're done
             }
             connection.query(rasiQuery,function(err,rows){
                if(connection !=null)connection.release();
                 if (err){
                            console.log("database query error: " + err); 
                            returnObject.response="Error";
                            returnObject.message="Internal Database Query Error";
                            res.end(JSON.stringify(returnObject));
                            return;
                  }
                  var _specis=new Object();
                  for(rowindex in rows){
                    row=rows[rowindex];
                    
                    _specis[row.rulename + row.attrname]=row;
                  }

                  specis=_specis;

                  if((rais != undefined)&&(specis != undefined)&&(atisPerRule != undefined))doneAllQueries();

                  //res.end(JSON.stringify(rais));
             });
           });
          pool.getConnection(function(err, connection) {
            connection.query(raiQuery,function(err,rows){
               if(connection != null)connection.release();
                  if (err){
                            console.log("database query error: " + err); 
                            returnObject.response="Error";
                            returnObject.message="Internal Database Query Error";
                            res.end(JSON.stringify(returnObject));
                            return;
                  }
                  var _rais=new Object();
                  var _atisPerRule=new Object();
                  for(rowindex in rows){
                    row=rows[rowindex];
                    
                    _rais[row.rulename + row.attrname]=row;
                    if(_atisPerRule[row.rulename]==undefined){ //create new
                        _atisPerRule[row.rulename]=new Object();
                        var apr=_atisPerRule[row.rulename];
                        apr[row.attrname]=row;                       
                    }
                    else{                                       //add to it
                        var apr=_atisPerRule[row.rulename];
                        apr[row.attrname]=row;
                    }
                  }
                  rais=_rais;
                  atisPerRule=_atisPerRule
                   if((rais != undefined)&&(specis != undefined)&&(atisPerRule != undefined))doneAllQueries();

                  });


     });

}


/*GetAllProjectAssemblies*/
function getAllProjectAssemblies(req,res){
    var parsedUrl= require('url').parse(req.url,true);
    var pathName=parsedUrl.pathname;
    var query = parsedUrl.query;
     var projectid=query.projectid;
     var language=query.language;
    if(language==undefined)language="en";


  var host=req.headers.host;

    var projectData;
    var assembliesData;
    

    var assembliesCount=-1; //no of assemblies - haven't done them all yet

    var doneAllQueries=function(){
       // console.log("GetAllProjectAssemblies doneAllQueries");
        projectData.assemblies=assembliesData;
        

         res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify(projectData));
    }
   pool.getConnection(function(err, connection) {

            // var returnObject=new Object();

             if (err){
                            console.log("getConnection error: " + err);
                           var returnObject=new Object();
                            returnObject.response="Error";
                            returnObject.message="Internal Database Connection Error";
                            res.end(JSON.stringify(returnObject));
                            return; //we're done
             }
            
                       
              /*  var projectTitle=null;
                var projectDescription=null;
                var projectStartDate=null;
                var projectEndDate=null;
                var projectBannerAssetId=null;
                var projectStylesId=null;
                */
                
                //get the project details
                connection.query( 'SELECT projectid,title,description,startdate,enddate,bannerassetid,stylesid from project where projectid=' +projectid, function(err, rows) {
                   // console.log("In get project query");

                     if (err){
                            console.log("database query error: " + err);
                            var returnObject=new Object();
                            returnObject.response="Error";
                            returnObject.message="Internal Database Query Error";
                             res.end(JSON.stringify(returnObject));
                            return; //we're done
                        }
                    
                  
                    if(rows[0] != null){
                        projectData=rows[0];
                        //console.log("There are rows");
                      /*  projectTitle=rows[0].title;
                        projectDescription=rows[0].description;
                        projectStartDate=rows[0].startdate;
                        projectEndDate=rows[0].enddate;
                        projectBannerAssetId=rows[0].bannerassetid;
                        projectStylesId=rows[0].stylesid;
                        */
                    }
                    
                    if((projectData != undefined) &&(assembliesData != undefined)&&(assembliesCount==0))doneAllQueries();
                    
                   
                });
                

             var sqlQueryString= "select title,DATE_FORMAT(project.startdate,'%Y%/%m%/%d %T') as startdate,DATE_FORMAT(project.enddate,'%Y%/%m%/%d %T') as enddate,assetassemblydescription,assetassembly.assetassemblyid as assetassemblyid,layariconid,layarimageurl,summaryimageassetid,latitude,longitude,visible from project left join projectassetassembly on project.projectid=projectassetassembly.projectid  left join assetassembly on projectassetassembly.assetassemblyid=assetassembly.assetassemblyid  where  project.projectid=" + projectid + " order by assetassemblyid asc  ;";

                connection.query( sqlQueryString, function(err, assemblyRows) {
                   if (err){
                            console.log("database query error: " + err);
                            returnObject=new Object();
                            returnObject.response="Error";
                            returnObject.message="Internal Database Query Error";
                             res.end(JSON.stringify(returnObject));
                            return; //we're done
                        }
                        assembliesCount=assemblyRows.length * 2;
                        assembliesData=assemblyRows;

                        //get the text elements

                        for(var i in assemblyRows){
                            var row = assemblyRows[i];
                            var textElementsQuery="select " + i + " as rowindex, assetassemblytitle,assetassemblysubtitle,summarytext1,summarytext2,summarytext3,summarytext4 from assetassemblytextelements where assetassemblyid=" + row.assetassemblyid + " and languagecode='" +language + "';";
                            connection.query(textElementsQuery,function(err,rows){
                                    if (err){
                                             console.log("database query error: " + err);
                                             returnObject=new Object();
                                            returnObject.response="Error";
                                            returnObject.message="Internal Database Query Error";
                                            res.end(JSON.stringify(returnObject));
                                            return; //we're done
                                    }
                                
                                    var textElements=rows[0];
                                  //  console.log(textElements +" " + JSON.stringify(textElements));
                                    if(textElements != undefined){
                                        assemblyRows[textElements.rowindex].assetassemblytitle=textElements.assetassemblytitle;
                                        assemblyRows[textElements.rowindex].assetassemblysubtitle=textElements.assetassemblysubtitle;
                                        assemblyRows[textElements.rowindex].summarytext1=textElements.summarytext1;
                                        assemblyRows[textElements.rowindex].summarytext2=textElements.summarytext2;
                                        assemblyRows[textElements.rowindex].summarytext3=textElements.summarytext3;
                                        assemblyRows[textElements.rowindex].summarytext4=textElements.summarytext4;
                                    }
                                    assembliesCount-=1;
                                   // console.log("assembliesCount: " + assembliesCount);
                                    
                                      if((projectData != undefined) &&(assembliesData != undefined)&&(assembliesCount==0))doneAllQueries();

                                });

                          if(row.summaryimageurl == undefined)row.summaryimageurl="";
                            //get the summary image url
                          


                          var summaryImageQuery="select " + i + " as rowindex, assetpresentationid,assetpresentation.assetid,assettypedescription,mimetype ,url,localurl,posterurl ,localposterurl,quality ,width ,height ,languagecode from asset inner join assetpresentation on asset.assetid=assetpresentation.assetid inner join assettype on asset.assettypeid=assettype.assettypeid and assetpresentation.assetid=" +row.summaryimageassetid + " and width > 0 order by width asc";
                           //console.log(summaryImageQuery);
                            connection.query( summaryImageQuery, function(err, saurlRows) {
                            if (err){
                                    console.log("database query error: " + err);
                                    returnObject=new Object();
                                    returnObject.response="Error";
                                    returnObject.message="Internal Database Query Error";
                                    res.end(JSON.stringify(returnObject));
                                    return; //we're done
                                }
                                var summaryImageUrl;
                                if(saurlRows[0]!=null){
                                    summaryImageUrl=saurlRows[0].url;
                                    assemblyRows[saurlRows[0].rowindex].summaryimageurl=summaryImageUrl;

                                }
                                else{
                                    //summaryImageUrl="";
                                }
                                //console.log("summaryImageUrl: " + summaryImageUrl);
                                //assemblyRows[saurlRows[0].rowindex].summaryimageurl=summaryImageUrl;

                                assembliesCount-=1;

                               if((projectData != undefined) &&(assembliesData != undefined)&&(assembliesCount==0))doneAllQueries();
  
                            });

                                

                        }

                        
                        
                   
                 /*   returnObject.assemblies=rows;
                    returnObject.response="OK";
                    returnObject.projectid=projectid;
                    returnObject.projecttitle=projectTitle;
                    returnObject.description=projectDescription;
                    returnObject.startdate=projectStartDate;
                    returnObject.enddate=projectEndDate;
                    returnObject.bannerassetid=projectBannerAssetId;
                    returnObject.stylesid=projectStylesId;
                    returnObject.ip=host;
                    //console.log("Go write stuff");
                      res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(returnObject));
                */

                  if((projectData != undefined) &&(assembliesData != undefined)&&(assembliesCount==0))doneAllQueries();

                  
                 
                });

              
                
                                          
                
                
                  // And done with the connection.
                    connection.release();
                    //console.log("Release the connection");
                
          
            
            
            
        });

}



/*AssembleAssets */

function assembleAssets(req,res){
   
   var projectData;
   var aaIsVisible;
   var assetAssemblyData;
   var assetsData=[];
    var posterUrls=[];
    var noOfAssets=-1; //don't know how many yet'
    var summaryImageUrl;
    var bannerAssetUrl;
    var aacallback;
    var containsFlash=false; 
    var containsMp4=false;
    var containsQuicktime=false;
    var html5audio=false;

    var usesParse=false;
    var usesLogin=false;
    var containsQuestion=false;
    var anonymousLogin=false;

   var allQueriesDone= function(){

      //console.log("bannerAssetUrl: " + bannerAssetUrl + " summaryImageUrl: " + summaryImageUrl + " aaIsVisible: " + aaIsVisible + " projectData: " + projectData + " assetAssemblyData: " + assetAssemblyData + " noOfAssets: " + noOfAssets);
        if((bannerAssetUrl != undefined)&&(summaryImageUrl != undefined)&&(aaIsVisible != undefined)&&(projectData != undefined)&&(assetAssemblyData != undefined)&&(noOfAssets==0)){
                return(true);
            }
        else return(false);
   }
   
   var getStylesheetTypeForUserAgent=function(deviceOs,  deviceId, isWirelessDevice) {
        //console.log("getStylesheetTypeForUserAgent " + deviceOs + " " + deviceId + " " + isWirelessDevice);
        if(isWirelessDevice=="false") return("generic-desktop");
      
        if(deviceOs.indexOf("Android")!= -1){
            return("iphone-ipod");
           
        }
        if(deviceId.indexOf("iphone")!= -1){
            return("iphone-ipod");
        }
        if(deviceId.indexOf("ipad")!= -1){
            return("iphone-ipod");
        }
        return("generic-mobile");
    }

   
   
   var doneAllQueries=function(response,message){
     var returnObject=new Object();
        if(response=="OK"){
        //console.log("done all queries");
       // console.log(projectData);
        //console.log(aaIsVisible);
        //console.log("AssetAssmblyData: " + assetAssemblyData);
       // console.log(assetsData);
       // console.log(summaryImageUrl);
       
        returnObject.response="OK";
       
        returnObject.pagetitle=projectData.title;
        returnObject.bannerassetid=projectData.bannerassetid;
        returnObject.bannerasseturl=bannerAssetUrl;
        returnObject.stylesid=projectData.stylesid;
        returnObject.projectid=projectId;
        returnObject.assetassemblyid=aaid;
        returnObject.language=languageCode;
       
        returnObject.visible=(aaIsVisible ==1) ?"true":"false";
        returnObject.summaryimageurl=summaryImageUrl;
        
        if(assetAssemblyData != undefined){
         returnObject.title=assetAssemblyData[0].assetassemblytitle;
         returnObject.subtitle=assetAssemblyData[0].assetassemblysubtitle;
         returnObject.summarytext1=assetAssemblyData[0].summarytext1;
         returnObject.summarytext2=assetAssemblyData[0].summarytext2;
         returnObject.summarytext3=assetAssemblyData[0].summarytext3;
         returnObject.summarytext4=assetAssemblyData[0].summarytext4;
         returnObject.summaryimageassetid=assetAssemblyData[0].summaryimageassetid;
         returnObject.layariconid=assetAssemblyData[0].layariconid;

        

       
        //console.log("AssetAssemblydata: " + JSON.stringify(assetAssemblyData));
        //console.log("AssetsData: " + JSON.stringify(assetsData));
        
       // returnObject.assets=new Array(assetAssemblyData.length);
        returnObject.assets=new Array();
        
        for(i in assetAssemblyData ){
            var asset=assetAssemblyData[i];
            var assetPresentation=assetsData[i];
            
           
             
            if(assetPresentation != undefined){ //must have an asset presentation
            var assetjson=new Object();
            
            assetjson.assetid=asset.assetid;
            assetjson.assettype=asset.assettypedescription;
            assetjson.assettypeid=asset.assettypeid;
            assetjson.subtypeid=asset.subtypeid;
            if(assetjson.subtypeid===6){
                usesParse=true; //login requires parse scripts
                usesLogin=true;


              }
            else if(assetjson.subtypeid===5){
                usesParse=true;
                containsQuestion=true;

            }
            assetjson.assetindex=asset.assetindex;
            assetjson.version=asset.version;
            assetjson.assetdescription=asset.assetdescription;
             assetjson.assetcaption=asset.assetcaption;
            assetjson.width=assetPresentation.width;
             assetjson.height=assetPresentation.height;
             assetjson.quality=assetPresentation.quality;
             assetjson.language=assetPresentation.languagecode;
             assetjson.mimetype=assetPresentation.mimetype;
             assetjson.url=assetPresentation.url;
             assetjson.posterassetid=assetPresentation.posterassetid;
            assetjson.posterurl=posterUrls[i];
            
            //returnObject.assets[i]=assetjson;
            returnObject.assets.push(assetjson);
            }


            
            }
            
        
        }
        else{
             returnObject.assets=new Array(0);
        }
        }
        else{
            returnObject.response="Error";
            returnObject.message=message;
        }
        
      //console.log("return Object: " + JSON.stringify(returnObject) + " END");
        
        if(returnType==="json"){
          
            res.writeHead(200, {'Content-Type': 'text/plain'});
            if(aacallback===undefined)res.end(JSON.stringify(returnObject));
            else res.end(aacallback + "(" + JSON.stringify(returnObject)+ ")" );
            
        }
        else if(returnType==="html"){
            
            //get the stylesheet
            //console.log('/GenerateStylesheet?styleid=' +returnObject.stylesid +'&iswireless=' + isWirelessDevice + '&useragent=' +stylesheetType +'&app=false');
            
            var getStylesheetOptions={
                host:'localhost',
                port:process.env.PORT || 3000,
                path:'/GenerateStylesheet?styleid=' +returnObject.stylesid +'&iswireless=' + isWirelessDevice + '&useragent=' +stylesheetType +'&app=false'
            };
            
            
            
            var getStylesheetCallback=function(response){
               // console.log("in getStylesheetCallback");
                 var stylestring = '';

                        response.on('data', function (chunk) {
                    stylestring += chunk;
                });
                
                 response.on('end', function() {
                     //console.log("in getStylesheetCallback end")
                     var textAssetsCount=0;
                     //get text assets
                     for(var i in returnObject.assets){
                        
                        
                        var nA=returnObject.assets[i];
                      //  res.write(JSON.stringify(nextAsset));
                      
                     
                      
                      if(nA.assettypeid==0){ //text
                          
                          (function(nextAsset){
                          textAssetsCount++;
                          var textAssetRequest=http.request(nextAsset.url,function(response){
                              var textString='';
                              
                             // console.log('STATUS: ' + response.statusCode);
                             // console.log('HEADERS: ' + JSON.stringify(response.headers));
                              response.on('data',function(chunk){
                                  
                                  textString+=chunk;
                              });
                              response.on('end',function(){
                                  textAssetsCount--;
                                  nextAsset.assetText=textString;

                                  if(nextAsset.subtypeid===6){ //login widget
                                    nextAsset.assetTextObject=eval("(" + nextAsset.assetText + ")"); //eval the JSON content
                                    if(nextAsset.assetTextObject.anonymous)
                                            anonymousLogin=true;

                                  }
                                  else if(nextAsset.subtypeid===5){ //question
                                       nextAsset.assetTextObject=eval("(" + nextAsset.assetText + ")"); //eval the JSON content
                                  }

                                  //console.log("nextAsset.assetText: " + nextAsset.assetText);
                                  if(textAssetsCount===0){
                                     // console.log("Done all text Assets");
                                      outputHTMLPage(stylestring);
                                  }
                              });
                          });
                          textAssetRequest.on('error', function(e) {
                                console.log('problem with textAsset http request: ' + e.message);
                                
                             });
                            textAssetRequest.end();
                          
                          })(nA);
                          
                      }
                    }
                    
                    if(textAssetsCount==0){
                        console.log("Done all text Assets - there weren't any");
                         outputHTMLPage(stylestring);
                     }
                 
                 });
                
            }
            
            var outputHTMLPage=function(stylestring){
                   //console.log(str);
                    
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write("<html>");
                    res.write("<head>");
                    res.write("<title>" + returnObject.title + "</title>");
                   res.write("<style>");
                   res.write(stylestring);
                   res.write("</style>");
                   
                   
                   
                    
                     res.write("<link REL=\"SHORTCUT ICON\" HREF=\"favico.ico\">");
                     /*
                     if(!noStyleSheetS.equals("true")){
                     // out.print("<link href=\"" + stylesheetUrl + "\" type=text/css rel=stylesheet>");
                     out.print(stylestext);
                     }
                     if (nocache) {
                     out.print("<META HTTP-EQUIV=\"Pragma\" CONTENT=\"no-cache\">");
                     out.print("<META HTTP-EQUIV=\"Expires\" CONTENT=\"-1\">");
                     }
                     
                     if(addscript != null) out.println("<script type=\"text/javascript\" src=\"" + addscript + "\"></script>");
                     
                     out.println("<script> pageGlobalAssetAssemblyId=" +assetAssemblyIdS +";  pageGlobalAssetAssemblyIconId=" + layariconid + ";</script>");
                     
                     if(containsQuestion){
                     String treasureHuntScriptsUrl=getServletContext().getInitParameter("treasurehuntscriptsurl");
                     out.println("<script type=\"text/javascript\" src=\"" + treasureHuntScriptsUrl + "\"></script>");
                     }
                     
                     if(containsLogin){
                     String loginScriptsUrl=getServletContext().getInitParameter("loginscriptsurl");
                     out.println("<script type=\"text/javascript\" src=\"" + loginScriptsUrl + "\"></script>");
                     }*/

                     if(usesParse){
                      res.write("<script src=\"http://www.parsecdn.com/js/parse-1.2.13.min.js\"></script>");
                      res.write("<script>Parse.initialize(\"UBibVG5WBbXwa658BS1yVfCONmw3YKCRvpjx3wqy\", \"c7Ks1BrdmgWylo6wIP526DO67ne2E0HgD7TiYGPa\");</script>");
                     }
                     if(usesLogin){
                      res.write("<script type=\"text/javascript\" src=\"/javascripts/loginscripts.js\"></script>");
                     }
                     if(containsQuestion){
                      res.write("<script type=\"text/javascript\" src=\"/javascripts/treasurehunt-v1.0.js\"></script>");
                     }
                     
                     if(containsFlash){
                     //out.println("<link href=\"ghindaVideoPlayer.css\" type=text/css rel=stylesheet>");
                     res.write("<script type=\"text/javascript\" src=\"/jwplayer/jwplayer.js\" ></script>");
                     //res.write("<script type=\"text/javascript\" src=\"javascripts/swfobject.js\"></script>");
                     
                     }
                     
                     if (containsQuicktime) {
                         res.write("<script src=\"http://www.apple.com/library/quicktime/scripts/ac_quicktime.js\" language=\"JavaScript\" type=\"text/javascript\"></script>");
                         res.write("<script src=\"http://www.apple.com/library/quicktime/scripts/qtp_library.js\" language=\"JavaScript\" type=\"text/javascript\"></script>");
                         res.write("<link href=\"http://www.apple.com/library/quicktime/stylesheets/qtp_library.css\" rel=\"StyleSheet\" type=\"text/css\" />");
                     
                     }
                     
                     res.write("<script>function playSound(id,url){");
                     res.write("var thissounddiv=document.getElementById('audiodiv' + id);");
                     if(deviceOs.indexOf("iPhone")===-1){
                     if(deviceOs.indexOf("RIM OS")!== -1){ //it's a blackberry, use Object rather than embed
                     res.write("thissounddiv.innerHTML= \"<object   autostart='true' autoplay='true'  data='\" + url + \"' > </object>\"");
                     }
                     else {
                     res.write("thissounddiv.innerHTML=\"<embed  id='audio\"+ id + \"' src='\" + url + \"' autostart='true' autoplay='true' enablejavascript='true' width=0 height=0></embed>\"");
                     }
                     }
                     else{ //It's an iPhone
                     res.write("thissounddiv.innerHTML=\"<audio id='audio\" + id + \"'></audio>\"");
                     res.write("var thissound=document.getElementById('audio' +id);");
                     res.write("thissound.src=url;");
                     res.write("thissound.play();");
                     //out.println("var thissound=document.getElementById('audio' + id);");
                     //out.println("thissound.play();");
                     }
                     res.write("}");
                     
                     res.write("</script>");
                     /*
                     //to toggle long text
                     out.println("<script>function toggleDimpleTextElement(elementid1,elementid2,onoroff){");
                     out.println("var contentElement1=document.getElementById(elementid1);");
                     out.println("var contentElement2=document.getElementById(elementid2);");
                     out.println("if(onoroff=='on'){");
                     out.println("contentElement1.style.display='none';");
                     out.println("contentElement2.style.display='block';");
                     out.println("}");
                     out.println("else{");
                     out.println("contentElement1.style.display='block';");
                     out.println("contentElement2.style.display='none';");
                     out.println("}");
                     out.println("}");
                     
                     
                     out.println("</script>");
                     */

                    res.write("</head>");

                    // if(onloadfn != null){
                    //  res.write("<body style=\"text-align:center\" onload=\"" + onloadfn + "\">");
                    //}
                    //else 
                    var onloadString="";

                    if(anonymousLogin){
                      onloadString+="checkLoginAnonymous();";
                    }
                    else if(usesLogin){
                      onloadString+="checkLogin();";
                    }

                    if(onloadString!="")onloadString=" onload='" + onloadString + "'";

                    res.write("<body " + onloadString + " style=\"text-align:center\">");
                    
                     if(isWirelessDevice=="false"){ //It's a desktop/laptop device
                     res.write("<div id=\"nwwrapper\" class=\"dimple-body\" style=\"margin: 0 auto;width:800;text-align:center\"> ");
                     }
                     
                    if (returnObject.bannerassetid != 0) {
                        res.write("<div id=\"pageheader\" class=\"pageheader\"><img style=\"margin-bottom:0px\" src=\"" + returnObject.bannerasseturl + "\" width=\"100%\" ></img></div>");
                        res.write(" <span id='useridspan' width:10% style=\"float:right;text-align:right;\"></span>");
                    }
                    else {
                        res.write("<div id=\"pageheader\" class=\"pageheader\"><span width:90%><h2>" + returnObject.pagetitle + "</h2></span><span id='useridspan' width:10% style=\"float:right;text-align:right;\"></span></div>");
                    }
                    // out.print("<table><tr><td><div class='edittext'></td><td></div><div class=\"asset-assembly-title\">" + titleS + "</div></td></tr></table>");
                    /*
                     String onclickText="";
                     if(textOnclickFunction != null)onclickText="onclick='" + textOnclickFunction + ";'";
                     */
                    
                    
                    res.write("<div id=\"asset-assembly-title\" class=\"asset-assembly-title\"  >" + returnObject.title + "</div>");
                    if(returnObject.subtitle !=="null")res.write("<div id=\"asset-assembly-subtitle\" class=\"asset-assembly-subtitle\"  >" + returnObject.subtitle + "</div>");

                    //res.write(JSON.stringify(returnObject.assets));
                    //now output the assets
                    
                    var nextVideoAssetIndex=0;
                    var flashAssetId=0;
                    var nextAudioAssetId=0;
                    for(var i in returnObject.assets){
                        
                        
                        var textOnclickFunction=null;
                        
                        var nextAsset=returnObject.assets[i];
                      //  res.write(JSON.stringify(nextAsset));
                      
                      if(nextAsset.assettypeid===0){ //text

                          if(nextAsset.subtypeid===6){ //it's a login widget
                                //nextAsset.assetTextObject=eval("(" + nextAsset.assetText + ")");

                                if(nextAsset.assetTextObject.anonymous){
                                  //console.log("Anonymous login");
                                }

                                else res.write("<div id='dimple-signup-login-widget-div'>");
                            }

                          
                          var onclickText="";
                           if ((nextAsset.assetcaption === null) || nextAsset.assetcaption===""||(nextAsset.assetcaption===("null"))) { //no caption
                    
                            res.write("<div class=\"text-item-title\" style=\"display:none\"></div>");//hide it if it's empty
           
                            } else {
                                    res.write("<div class=\"text-item-title\" " + onclickText + ">");
                                     res.write(nextAsset.assetcaption);
                                    res.write("</div>");
                            }
                            res.write("<div class=\"text-item\" " + onclickText +">");

                            if(nextAsset.subtypeid===6){ //it's a login widget
                                
                                if(nextAsset.assetTextObject.anonymous){
                                  //console.log("Anonymous login");
                                  res.write("<div id='dimple-remaining-content-div' style='display:none'>" );
                                }
                                else{
                                res.write("<div id='dimple-login-div'>");
                                res.write("<span id='dimple-login-name'>name*:</span><input id='dimple-login-name-input' type='text'><br>");
                                res.write("<span id='dimple-login-password'>password*: </span><input id='dimple-login-password-input' type='password'><br>");
                                res.write("<input type='submit' onclick='parseLogin();'>or <a onclick='showSignupDiv()'>sign up</a>");
                                 res.write("<span id='dimple-login-message' style='color:red;display:none'></span>");
                                res.write("</div>"); //login div
                                res.write("<div id='dimple-signup-div' style='display:none'>");
                                res.write("<span id='dimple-signup-name'>name:*</span><input id='dimple-signup-name-input' type='text'><br>");
                                res.write("<span id='dimple-signup-pw'>password:*</span> <input id='dimple-signup-pw-input' type='password'><br>");
                                 res.write("<span id='dimple-signup-pw-confirm'>confim:*</span> <input id='dimple-signup-pw-confirm-input' type='password'><br>");
                                res.write("<input type='submit' onclick='parseSignup()'>");
                                res.write("<span id='dimple-signup-message' style='color:red;display:none'></span>");
                                res.write("</div>"); //signup div
                                res.write("</div>"); //login signup div
                                res.write("</div>"); //text item

                                
                                res.write("<div id='dimple-remaining-content-div' style='display:none'>" );
                              }
                                

                            }
                            else if(nextAsset.subtypeid===5){ //It's a question widget

                              var questionText=nextAsset.assetTextObject.questiontext;
                              var questionTask=nextAsset.assetTextObject.questiontask;
                              var questionTaskLink=nextAsset.assetTextObject.questiontasklink;
                              var defaultBadgeId=nextAsset.assetTextObject.defaultbadgeid;
                              var badgeId=nextAsset.assetTextObject.badgeid;
                              var correctAnswerId=nextAsset.assetTextObject.correctanswerid;
                              var incorrectAnswerId=nextAsset.assetTextObject.incorrectanswerid;

                              var dbUrl="/SelectImageAP?assetid=" + defaultBadgeId + "&maxwidth=130"; //default badge url
                              var caUrl="/SelectImageAP?assetid=" + correctAnswerId + "&maxwidth=130";  //correct answer image url
                              var badgeUrl="/SelectImageAP?assetid=" + badgeId + "&maxwidth=130";
                              var iaUrl="/SelectImageAP?assetid=" + incorrectAnswerId + "&maxwidth=130";
                              //console.log("Question Text: " + questionText);


                              res.write("<div class='dimple-question'>");
                              res.write("<span class='dimple-question-text'>" + questionText + "</span>");
                              res.write("<table><tbody>"); 
                              res.write( "<tr>");
                              //placeholder for response image
                              res.write( "<td><img id='responseimg" + nextAsset.assetindex + "' class='dimple-question-response-image' style=\"visibility:hidden;\"   src=\"http://d3ox1gfjdlf15b.cloudfront.net/DeneTreasureHunt/Badges/blank.png\"></td>");
                              res.write( "<td>");// id='dimple-questions-td-" + taid + "'>"); //td for answers

                              //answers here

                              for(var i in nextAsset.assetTextObject.answers){
                                var answer=nextAsset.assetTextObject.answers[i];
                        
                                var answerText=answer.answer;
                                var checked=answer.checked;
                                
                                var onclickFn="reportIncorrect(this,'" +iaUrl+"','" + dbUrl + "'," + nextAsset.assetindex +")";
                       
                                if(checked)onclickFn="reportCorrect(this,'" + badgeUrl + "','"+caUrl + "'," + returnObject.projectid+ ",'" + questionTask + "','" + questionTaskLink + "'," + returnObject.assetassemblyid +"," + nextAsset.assetindex + "," + i +")";
                               //res.write("<br>" + answerText + " " + checked);
                                res.write("<input id=\"radio" +nextAsset.assetindex +"-"+ i +"\" type=\"radio\" name=\"multichoice" + nextAsset.assetindex +"\" onclick=\"" +onclickFn + ";\"></input>");
                                res.write("<span class='dimple-answer-text'>" + answerText + "</span>");
                               res.write("<br><br>");
                              }



                              res.write( " </td>"); //td for answers
                      
                              res.write("<td id='badgeholder" + nextAsset.assetindex+"'>");
                              res.write( "<img class='dimple-badge-image'  src=\"" +dbUrl +"\"></img>");
                              res.write( "</td>");
                              res.write( "</tr>");
                              res.write( "</tbody>");
                              res.write( "</table>");
                              res.write( "<p><span class='congrats' id=\"congratsspan" + nextAsset.assetindex + "\" style=\"visibility:hidden\">Well Done! You just earned a new badge!</span></p>");
                              res.write("<script>checkIfUserHasBadge('project"+ returnObject.projectid+"'," +returnObject.assetassemblyid +"," + nextAsset.assetindex +",'" + caUrl + "');</script>");
                              res.write("<div>");//dimple-question



                            }

                            else if(nextAsset.assetText !== undefined){
                                res.write(nextAsset.assetText);
                                res.write("</div>");
                            }
                            else{
                                console.log("No asset text: " + JSON.stringify(nextAsset));
                            }
                           
                      }
                      else if((nextAsset.assettypeid===3)||(nextAsset.assettypeid===4)){//image or webbcam
                         res.write("<div class=\"dimple-image-asset-div\"><img class=\"dimple-image-asset\" src=\"" + nextAsset.url + "\"></img></div>");
                        if ((nextAsset.assetcaption !== null)&&!(nextAsset.assetcaption==="null")) {
                             var onclickText="";
                            if(textOnclickFunction !== null)onclickText="onclick='" + textOnclickFunction + ";'";
                                res.write("<div class=\"image-caption-below\" " + onclickText + ">" + nextAsset.assetcaption + "</div>");
                        }
                        else {
                         res.write("<div class=\"image-caption-below\" style=\"display:none\"></div>");
                        }  
                      }
                      else if(nextAsset.assettypeid===1){ //video
                          if ((nextAsset.mimetype === "video/mp4") || ((nextAsset.mimetype === "video/3gpp"))) {
                            var posterUrl = null;
                            if (nextAsset.posterurl === null) {
                                //posterUrl = "images/playvideo.jpeg";
                            } else {
                                posterUrl = nextAsset.posterurl;
                            }
                            if ((nextAsset.assetcaption !== null) && !(nextAsset.assetcaption==="null")) {
                                var onclickText = "";
                                if (textOnclickFunction !== null)
                                    onclickText = "onclick='" + textOnclickFunction + ";'";
                                res.write("<div class=\"image-caption-above\" " + onclickText + ">" + nextAsset.assetcaption + "</div>");
                            }
                            else {
                                res.write("<div class=\"image-caption-above\" style=\"display:none\"></div>");
                            }
                            res.write("<div id=\"videoasset" + nextVideoAssetIndex++ + "\"><video controls=\"controls\" width=\"100%\" src=\"" + nextAsset.url + "\" poster=\"" + posterUrl + "\" onclick=\"this.play();\" >");

                            
                            res.write("<a href=\"" + nextAsset.url + "\"><img src=\"" + posterUrl + "\"></img></a>");
                            res.write("</video></div>");
                        }
                        else if(nextAsset.mimetype ==="video/x-flv"){
                            if ((nextAsset.assetcaption !== null) && !(nextAsset.assetcaption==="null")) {
                                var onclickText = "";
                                if (textOnclickFunction !== null)
                                    onclickText = "onclick='" + textOnclickFunction + ";'";
                                res.write("<div  class=\"image-caption-above\" " + onclickText + ">" + nextAsset.assetCaption + "</div>");
                            }
                            else {
                                res.write("<div class=\"image-caption-above\" style=\"display:none\" ></div>");
                            }
                            
                           /* 
                            <div id="myElement">Loading the player...</div>

                            <script type="text/javascript">
                                jwplayer("myElement").setup({
                                 file: "/uploads/myVideo.mp4",
                                image: "/uploads/myPoster.jpg"
                                });
                            </script>*/
                            
                            
                            
                            
                            
                            res.write("<div style=\"text-align:center;\" id=\"videoasset" +  nextVideoAssetIndex++ + "\" class=\"jwflashasset\"style=\"width:500px;margin-left:auto;margin-right:auto\">");
                            res.write("<div id=\"container" + flashAssetId + "\" style=\"margin-left:auto;margin-right:auto\">Loading the player ...</div>");
                            res.write("<script type=\"text/javascript\">");

                            res.write("jwplayer(\"container" + flashAssetId + "\").setup({");
                            //res.write("flashplayer: \"player.swf\",");
                            res.write("file: \"" + nextAsset.url + "\",");
                            res.write("width:\"100%\"");
                            if((nextAsset.posterurl !== undefined)&&(nextAsset.posterurl!=="")){
                                res.write(",\nimage: \"" + nextAsset.posterurl + "\"");
                            }
                           // res.write("height:\"100%\",");
                           // res.write("width:\"100%\"");
                            res.write("});");
                            res.write("</script>");
                            res.write("</div>");
                            
                        }
                        else if(nextAsset.mimetype ==="application/x-shockwave-flash"){
                            //not (yet) implemented
                        }
                          
                          
                      }
                      else if(nextAsset.assettypeid===2){ //audio
                          if((nextAsset.mimetype==="audio/mpeg") || (nextAsset.mimetype==="audio/x-wav") || (nextAsset.mimetype==="audio/x-aac") || (nextAsset.mimetype==="audio/3gpp")){
                            var posterUrl = nextAsset.posterurl;
               
                            if ((nextAsset.assetcaption !== null) && !(nextAsset.assetcaption=="null")) {
                                var onclickText = "";
                                if (textOnclickFunction !== null)onclickText = "onclick='" + textOnclickFunction + ";'";
                                    res.write("<div class=\"image-caption-above\" " + onclickText + ">" + nextAsset.assetcaption + "</div>");
                            }
                            else {
                                res.write("<div class=\"image-caption-above\" style=\"display:none\"></div>");
                            }

                            if (html5audio){ //force render as html5 audio - for Simple Dimple
                                    if (useragent.indexOf("Firefox") != - 1){
                                        res.write("<div class=\"audiodiv\" id=\"audiodiv" + nextAudioAssetid + "\"><embed controls=\"true\" src=\"" + nextAsset.url + "\" autoplay=\"false\"></embed></div>");
                                     }
                                     else res.write("<div class=\"audiodiv\" id=\"audiodiv" + nextAudioAssetid + "\"><audio style=\"width:100%\" controls=\"controls\"><source src=\"" + nextAsset.url + "\" type=\"" + nextAsset.mimetype + "\"></source></audio></div>");
                            }
                            else{
            
                                if (deviceOs.indexOf("Android") !== - 1) {
                                        if (posterUrl == null) posterUrl = "images/audio_icon-150x150.png"; //default poster
                                            res.write("<video src=\"" + nextAsset.url + "\" poster=\"" + posterUrl + "\" onclick=\"this.play();\" ></video>");
                                }

                                else {
                                     if (posterUrl == null){
                                            res.write("<div id=\"audiombed" + nextAudioAssetId + "\"><embed controls=\"true\" src=\"" + nextAsset.url + "\" autoplay=\"false\"></embed></div>");
                                        }
                                    else {
                                         if (deviceOs.indexOf("iPhone") != - 1){
                                                res.write("<div style=\"display:none\" id=\"audiodiv" + nextAudioAssetId + "\" ></div>");
                                          }
                                        else if (deviceOs.indexOf("RIM OS") != - 1){
                                              res.write("<div style=\"width:100px;height200px;\" id=\"audiodiv" + nextAudioAssetId + "\"></div>");
                                        }
                                        else {
                                            res.write("<div id=\"audiodiv" + nextAudioAssetId + "\"></div>");
                                        }


        
                                        res.write("<div class=\"audioimgdiv\"><img id=\"audioimg" + nextAudioAssetId + "\"  width=\"150px\" src=\"" + posterUrl + "\" onClick= \"playSound(" + nextAudioAssetId + ",'" + nextAsset.url + "');\"></img></div>");
                                    }
                                }
                             }   
                             
                            
                            nextAudioAssetId++;
                          }
                      }
                    }

                    if(usesLogin) res.write("</div>"); //closes the div containing the rest of the assets
                    res.write("</body>");
                    res.end();

                
            };
            
            var styleHttpRequest=http.request(getStylesheetOptions, getStylesheetCallback);
         
            styleHttpRequest.on('error', function(e) {
                console.log('problem with http request: ' + e.message);
                doneAllQueries("Error","stylesheeterror");
                });
            styleHttpRequest.end();
            
            
           
        }
        
        
    };
   
   
   
    var projectId;
    var returnType="html";//by default
    var app;
     var aaid;
     var languageCode;
     var plaintext;
    var isWirelessDevice;
    var audio_aac;
    var audio_amr;
    var audio_mp3;
    var audio_wav;
    var deviceOs;
    var deviceId;
    var playback_flv;
    var playback_mov ;
    var flash_lite_version;
    var playback_mp4;
    var stylesheetType;
    
     
     var max_image_width;
    
    var parsedUrl= require('url').parse(req.url,true);
    var query=parsedUrl.query;
    aacallback=query.callback;
   
    //get the UserAgent
    var ua=encodeURIComponent(req.headers['user-agent']);

  //  var ua="Mozilla/5.0 (Macintosh; U; Safari/525";
  //  var ua="fee fa foo";
    
   // console.log('useragent: ' + encodeURIComponent(ua));
    
    //   var device=new Device(wurflserviceurl);
    
    
    var wurfloptions = {
        host: 'www.tera-wurfl.com',
        path: '/Tera-Wurfl/webservice.php?ua=' + ua
    };
    
    //console.log('www.tera-wurfl.com//Tera-Wurfl/webservice.php?ua=' + ua);
    callback = function(response) {
        var str = '';

        
        
        
        response.on('data', function (chunk) {
            str += chunk;
        });
        
       
        response.on('end', function () {
            // console.log(str);
            
            var parseString = require('xml2js').parseString;
            
            parseString(str, function (err, result) {

                if(err){
                    doneAllQueries("Error","Internal XML Parse Error");
                    return;
                    
                }
                
                //get query paramaters
                 projectId=query.projectid;
                 if(query.return != undefined)returnType=query.return;
                 app=query.app;
                 aaid=query.assetassemblyid;
                 languageCode=query.languagecode;
                 plaintext=query.plaintext;
                 if(plaintext===undefined)plaintext="false";
                 if(languageCode == undefined)languageCode='en';
                
             //   console.log("projectid: " + projectId + "returnType: " + returnType + " app= " + app + " aaid= " + aaid);
              
                
                //res.write(JSON.stringify(result.TeraWURFLQuery.device.capability));
                //device.setDataForUserAgent(result);
               
                 deviceOs = getCapability(result,"device_os");
                 deviceId = getCapability(result,"id");
               //  console.log("deviceID: " + deviceId);
                 isWirelessDevice = getCapability(result,"is_wireless_device");
              //  res.write("deviceOs: "  +deviceOs +  " deviceId: " + deviceId + "isWirelessDevice: " +isWirelessDevice);
                var resolution_width = getCapability(result,"resolution_width");
                var resolution_height = getCapability(result,"resolution_height");
                 max_image_width = getCapability(result,"max_image_width");
                if(deviceId.indexOf("iphone_ver4")!= -1){
                    max_image_width=640;
                }
                if (isWirelessDevice=="false"){
                    max_image_width=800;
                }
                var max_image_height = getCapability(result,"max_image_height");
                var dual_orientation = getCapability(result,"dual_orientation");
                
                //video
                 playback_flv = getCapability(result,"fl_browser");
                 playback_mov = getCapability(result,"playback_mov");
                 flash_lite_version = getCapability(result,"flash_lite_version");
                 playback_mp4 = getCapability(result,"playback_mp4");
                if(deviceId.indexOf("google_chrome")!= -1){
                    playback_mp4 ="true";
                }
                if(deviceId.indexOf("safari") != -1){
                    playback_mp4="true";
                    playback_mov="true";
                    
                    
                    
                }
              //   console.log("Playback_flv: " + playback_flv + " playback_mov: " + playback_mov + " playback_mp4: " + playback_mp4) ;
                // out.print("playback_mp4: " + playback_mp4);
                //audio
                 audio_aac = getCapability(result,"aac");
                 audio_amr = getCapability(result,"amr");
                 audio_mp3 = getCapability(result,"mp3");
                 audio_wav = getCapability(result,"wav");
                
                //device/os specific corrections
                //only serve mp3 audio to android devices
                if (deviceOs.indexOf("Android") != -1)  {
                    audio_aac="false";
                    audio_amr="false";
                    audio_mp3="true";
                    audio_wav="false";
                    
                }
                if(deviceId.indexOf("blackberry9930")!= -1){
                    audio_mp3="true";
                }
                if(deviceId.indexOf("blackberry9900")!= -1){
                    audio_mp3="true";
                }
                
           // }); moved this to 1111

                stylesheetType=getStylesheetTypeForUserAgent(deviceOs,deviceId,isWirelessDevice);


            
            //Get project data from DB

          

            pool.getConnection(function(err, connection) {
        
                  var projectQuery = "select title,bannerassetid,stylesid from project where projectid=" + projectId;    
                  var visibleQuery="select visible from projectassetassembly where projectid=" + projectId + " and assetassemblyid=" + aaid;
                var  assemblyQuery = "select assetassemblydescription,assetassemblytitle,layariconid,assetassemblysubtitle, summarytext1,summarytext2,summarytext3,summarytext4,summaryimageassetid,asset.assetid,assetdescription,assetindex,rating,posterassetid,asset.assettypeid,assettypedescription, asset.assetsubtypeid as subtypeid,assetcaption,version from assetassemblytextelements inner join assetassembly on assetassemblytextelements.assetassemblyid=assetassembly.assetassemblyid inner join assetassemblyallocation on assetassembly.assetassemblyid=assetassemblyallocation.assetassemblyid inner join asset on assetassemblyallocation.assetid=asset.assetid inner join assettype on asset.assettypeid=assettype.assettypeid left join assetcaption on asset.assetid= assetcaption.assetid where assetassembly.assetassemblyid=" + aaid + " and assetassemblytextelements.languagecode ='" + languageCode + "' and (assetcaption.languagecode='" + languageCode + "' or assetcaption is null)  order by assetindex;";
              //  var assetQuery = "select mimetype, url,localurl,posterurl,localposterurl,quality,width,height,languagecode from assetpresentation where assetid=" + assetid;
            
               if (err){
                            console.log("getConnection error: " + err);
                            doneAllQueries("Error","Internal Database Connection Error");
                            return; //we're done
                        }
                
                connection.query(projectQuery, 
                    function(err, rows) {

                        //console.log("project query rows: " + JSON.stringify(rows));
                        //console.log("In get project query");
                        if (err){
                            console.log("query error: " + err);
                            
                            
                            doneAllQueries("Error","Internal Database Query Error");
                            return;
                        }
             
                        if(rows[0] != null){
                            if((rows[0].bannerassetid===0)||(rows[0].bannerassetid===null)){
                                bannerAssetUrl="";
                            }
                            else{ //get the bannerasseturl
                                  var bannerAssetQuery = "select " + max_image_width + " as maxwidth, url,width from assetpresentation where assetid=" + rows[0].bannerassetid;

                                  connection.query(bannerAssetQuery, 
                                         function(err, rows) {
                                            if (err){
                                                console.log("query error: " + err);
                            
                            
                                                 doneAllQueries("Error","Internal Database Query Error");
                                            return;
                                            }
                                          var selectedPresentation;//=rows[0];
                                         //console.log(rows);
                                      
                                         for(var rowIndex in rows){
                                                var thisAssetData=rows[rowIndex]; 
                                                 if(selectedPresentation==undefined){
                                                        if(thisAssetData.width < thisAssetData.maxwidth){
                                                            selectedPresentation=thisAssetData;
                                                        }
                                             
                                                }
                                             
                                              else   if(thisAssetData.width > selectedPresentation.width){
                                                        selectedPresentation = thisAssetData;
                                                }
                                                 
                                             }
                                             
                                             if(selectedPresentation!= undefined){
                                                 bannerAssetUrl=selectedPresentation.url;
                                             }
                                                
                                            
                                             
                                            if(allQueriesDone()){  
                                                    doneAllQueries("OK");
                                            }   
                                         });
                                         
                            }
                         
                             projectData=rows[0];
                            // console.log(projectData);
                             
                             if(allQueriesDone()){
                                 doneAllQueries("OK");
                                }
                         
                        }
                        else{
                            bannerAssetUrl="";
                            //console.log("project rows is null");
                            projectData=new Object();
                           // console.log("summaryImageUrl: " + summaryImageUrl + " aaIsVisible: " + aaIsVisible + " projectData: " + projectData + " assetAssembyData: " + assetAssemblyData + " noOfAssets: " + noOfAssets);
                               if(allQueriesDone()){  
                                   doneAllQueries("OK");
                                }
                        }
                    });
                    
                     connection.query(visibleQuery, 
                    function(err, rows) {
                        //console.log("In get project query");
                        if (err){
                           if (err){
                            console.log("query error: " + err);
                            
                            
                            doneAllQueries("Error","Internal Database Query Error");
                            return;
                        }
                        }
             
                        if(rows[0] != null){
                         
                             aaIsVisible=rows[0].visible;
                           //  console.log(rows[0]);
                             
                                if(allQueriesDone()){
                                    doneAllQueries("OK");
                                }
                         
                        }
                        else{
                            aaIsVisible=false;
                         //   console.log("summaryImageUrl: " + summaryImageUrl + " aaIsVisible: " + aaIsVisible + " projectData: " + projectData + " assetAssembyData: " + assetAssemblyData + " noOfAssets: " + noOfAssets);

                              if(allQueriesDone()){
                                  doneAllQueries("OK");
                                }
                        }
                    });
                    
                      connection.query(assemblyQuery, 
                    function(err, rows) {


                         
                         
                         
                        // console.log("noOfAssets: " + noOfAssets);
                        //console.log("In get project query");
                      
                            if (err){
                            console.log("query error: " + err);
                            
                            
                            doneAllQueries("Error","Internal Database Query Error");
                            return;
                        }

                        noOfAssets= 2 * rows.length;//no of assets and posterasseturls to deal with
                         assetsData=new Array(rows.length);
                         posterUrls=new Array(rows.length);
                        

                       //Video playback settings

                        var serveFlash = false;
                        var serveQuicktime = false;
                        var serveMp4 = false;
                        //is it a desktop/laptop browser
                        //serve flash content
                        //last part of test is for IE6,, which is misattributed by wurfl
                        if ((deviceId.indexOf("msie") == 0) || (deviceId.indexOf("opera") == 0) || (deviceId.indexOf("firefox") == 0) || ((deviceId.indexOf("generic") == 0) && (deviceId.indexOf("android") == -1)) || (deviceId.indexOf("htc_st6356_ver1_submsie") == 0)) {
                               serveFlash = true;
                        } 
                        else if (deviceId.indexOf("safari") == 0) {
                                  serveQuicktime = true;
                                  serveMp4=true;
                        } else {
                                 if (!flash_lite_version=="") {
                    
                                         serveFlash = true;
                                 } 
                                 if (playback_mov=="true") {
                                              serveQuicktime = true;
                                 } 
                                 if (playback_mp4.endsWith("true")) {
                                              serveMp4 = true;
                                 }
                                }
                               // console.log("serve flash: " + serveFlash + " ServeQuicktime: " + serveQuicktime + " serveMP4: " + serveMp4);
                       
                     if(rows[0]==null){ //no asssets or assembly
                            doneAllQueries("OK");
                      }
                     else if(rows[0] != null){
                         
                           // console.log("summaryassetid: " + rows[0].summaryimageassetid);
                            var siaid=rows[0].summaryimageassetid;
                            if(siaid != 0){ //get the url of the summary image
                                var summaryImageQuery="select assetpresentationid,assetpresentation.assetid,assettypedescription,mimetype ,url,localurl,posterurl ,localposterurl,quality ,width ,height ,languagecode,version from asset inner join assetpresentation on asset.assetid=assetpresentation.assetid inner join assettype on asset.assettypeid=assettype.assettypeid and assetpresentation.assetid=" +siaid + " and width > 0 order by width asc"
                                connection.query(summaryImageQuery, 
                                         function(err, rows) {
                                         if (err){
                                            console.log("query error: " + err);
                            
                            
                                            doneAllQueries("Error","Internal Database Query Error");
                                            return;
                                           }
                                         
                                            if((rows !== undefined)&&(rows[0] !== undefined))summaryImageUrl=rows[0].url;
                                           // console.log("summaryImageQuery summaryImageUrl: " + summaryImageUrl + " aaIsVisible: " + aaIsVisible + " projectData: " + projectData + " assetAssembyData: " + assetAssemblyData + " noOfAssets: " + noOfAssets);

                                              if(allQueriesDone()){
                                                  doneAllQueries("OK");
                                            }
                                         }
                                );
                            
                            }
                            else{
                                summaryImageUrl="";
                               // console.log("summaryImageQuery summaryImageUrl: " + summaryImageUrl + " aaIsVisible: " + aaIsVisible + " projectData: " + projectData + " assetAssembyData: " + assetAssemblyData + " noOfAssets: " + noOfAssets);

                                              if(allQueriesDone()){
                                                  doneAllQueries("OK");
                                            }
                            }

                             assetAssemblyData=rows;
                            // console.log(assetAssemblyData);
                           
                             for(var i in assetAssemblyData){
                             //now get the assets
                                
                                    var assetData=assetAssemblyData[i];
                                    var assetId=assetData.assetid;
                                    var posterAssetId=assetData.posterassetid;
                                    var assetTypeId=assetData.assettypeid;
                                    var assetTypeDescription=assetData.assettypedescription;
                                     var assetQuery = "select "+ i + " as assetindex, " + max_image_width + " as maxwidth, '"+ assetTypeDescription + "' as assettypedescription, mimetype, url,localurl,posterurl,localposterurl,quality,width,height,languagecode from assetpresentation where assetid=" + assetId;
                                  //   console.log("Asset Query: " + assetQuery + " " + assetTypeDescription);
                                      

                                  if(posterAssetId > 0){
                                    //console.log("Get poster for: " + posterAssetId);
                                    var posterAssetQuery = "select "+ i + " as theindex,"  + max_image_width + " as maxwidth, mimetype, url,localurl,posterurl,localposterurl,quality,width,height,languagecode,version from assetpresentation,asset where assetpresentation.assetid=" + posterAssetId + " and asset.assetid=" + posterAssetId + " order by width desc;";
                                   // console.log("posterAssetQuery: " + posterAssetQuery);
                                    var selectedPosterAsset;
                                    connection.query(posterAssetQuery,function(err,rows){
                                    if (err){
                                            console.log("query error: " + err);
                            
                            
                                            doneAllQueries("Error","Internal Database Query Error");
                                            return;
                                           }
                                    
                                        for(var rowIndex in rows){  
                                            var thisPosterAsset=rows[rowIndex];
                                            if((selectedPosterAsset==undefined)&&(thisPosterAsset.width <= thisPosterAsset.maxwidth)) selectedPosterAsset=thisPosterAsset;
                                            else if((thisPosterAsset.width <=thisPosterAsset.maxwidth)&&(thisPosterAsset.width > selectedPosterAsset.width)){
                                                selectedPosterAsset=thisPosterAsset;
                                            }
                                        }
                                        if(selectedPosterAsset != undefined){
                                            //console.log("posterAssetUrl=" + selectedPosterAsset.url);
                                            posterUrls[selectedPosterAsset.theindex]=selectedPosterAsset.url;
                                        }
                                        noOfAssets-=1;
                                        //console.log("posterassetquery summaryImageUrl: " + summaryImageUrl + " aaIsVisible: " + aaIsVisible + " projectData: " + projectData + " assetAssembyData: " + assetAssemblyData + " noOfAssets: " + noOfAssets);

                                              if(allQueriesDone()){
                                                  doneAllQueries("OK");
                                            }
                                    });
                                    
                                  }
                                  else{
                                    //console.log("No Poster");
                                        noOfAssets-=1;
                                       // console.log("posterassetquery summaryImageUrl: " + summaryImageUrl + " aaIsVisible: " + aaIsVisible + " projectData: " + projectData + " assetAssembyData: " + assetAssemblyData + " noOfAssets: " + noOfAssets);

                                             if(allQueriesDone()){
                                                 doneAllQueries("OK");
                                            }
                                  }
                                  



                                     connection.query(assetQuery,function(err,rows){
                                        //console.log("Asset Query: " + assetQuery + " " + assetTypeDescription);
                                         if (err){
                                            console.log("query error: " + err);
                            
                            
                                            doneAllQueries("Error","Internal Database Query Error");
                                            return;
                                           }
                                          var selectedPresentation;//=rows[0];
                                         //console.log(rows);
                                      
                                         for(var rowIndex in rows){
                                                var thisAssetData=rows[rowIndex];
                                                // console.log("thisAssetdata: " + JSON.stringify(thisAssetData));
                                             //console.log("languageCode:" + languageCode + " plaintext:" + plaintext);
                                             if(thisAssetData.assettypedescription=="text"){
                                                 //console.log("Its text");
                                                // console.log("thisAssetdata: " + JSON.stringify(thisAssetData));
                                                 if(plaintext=='false'){
                                                     //console.log("plaintext is false");
                                                     
                                                     if((thisAssetData.mimetype=="text/html")&&(thisAssetData.languagecode==languageCode)){
                                                        selectedPresentation=thisAssetData;
                                                        break;
                                                    }
                                                    //else {
                                                   //    console.log("mimetype: " + thisAssetData.mimetype + " languagecode: " + thisAssetData.languagecode + "tested against: " + languageCode);
                                                    //}
                                                 }
                                                 else{
                                                      if((thisAssetData.mimetype=="text/plain")&&(thisAssetData.languagecode==languageCode)){
                                                        selectedPresentation=thisAssetData;
                                                        break;
                                                    }
                                                     
                                                 }
                                             }
                                             else if((thisAssetData.assettypedescription=="image")||(thisAssetData.assettypedescription=="webcam")){
                                                 //console.log("its image");
                                                // console.log("current image Presentation: " + JSON.stringify(thisAssetData));
                                             if(selectedPresentation==undefined){
                                                 if(thisAssetData.width < thisAssetData.maxwidth){
                                                    selectedPresentation=thisAssetData;
                                                }
                                             
                                            }
                                             
                                              else   if(thisAssetData.width > selectedPresentation.width){
                                                        selectedPresentation = thisAssetData;
                                                }
                                                 
                                             }
                                             else if(thisAssetData.assettypedescription=="audio"){
                                                    if ((isWirelessDevice=="false") && (thisAssetData.mimetype=="audio/mpeg")) {
                                                      if (thisAssetData.languagecode==languageCode) {
                                                             selectedPresentation = thisAssetData;
                                                             break;
                                                        }
                                                    }
                                                    if ((isWirelessDevice=="false") && (thisAssetData.mimetype=="audio/x-wav")) {
                                                      if (thisAssetData.languagecode==languageCode) {
                                                             selectedPresentation = thisAssetData;
                                                             break;
                                                        }
                                                    }
                                                    if ((audio_aac=="true") && (thisAssetData.mimetype=="audio/x-aac")) {
                                                         if (thisAssetData.languagecode==languageCode) {
                                                            selectedPresentation = thisAssetData;
                                                             break;
                                                         }
                                                     }
                                                     if ((audio_amr=="true") && (thisAssetData.mimetype=="audio/3gpp")) {
                                                         if (thisAssetData.languagecode==languageCode) {
                                                            selectedPresentation = thisAssetData;
                                                             break;
                                                         }
                                                     }
                                                    if ((audio_mp3=="true") && (thisAssetData.mimetype=="audio/mpeg")) {
                                                         if (thisAssetData.languagecode==languageCode) {
                                                            selectedPresentation = thisAssetData;
                                                             break;
                                                         }
                                                     }
                                                     if ((audio_wav=="true") && (thisAssetData.mimetype=="audio/x-wav")) {
                                                         if (thisAssetData.languagecode==languageCode) {
                                                            selectedPresentation = thisAssetData;
                                                             break;
                                                         }
                                                     }
                                                    
                                                  
                                             }//audio

                                             else if(thisAssetData.assettypedescription=="video"){
                                                
                                                //quicktime trumps all
                                                if ((thisAssetData.mimetype=="video/quicktime") && (serveQuicktime == true) && (thisAssetData.languagecode==languageCode)) {
                                                    //  containsQuicktime = true;
                           
                                                    selectedPresentation = thisAssetData;
                                                    // out.println("<br>clause1");
                                                    break; //allways serve .mov if it is available
                                                }

                                                  //mp4 trumps 3gpp and flash
                                              
                                                   if ((thisAssetData.mimetype=="video/mp4") && (serveMp4 == true) && (thisAssetData.languagecode != null) &&(thisAssetData.languagecode==languageCode)) {
                                                        // containsMp4 = true;
                                                        //  out.print("Its mp4");
                                                        if(selectedPresentation==null){
                                                             selectedPresentation = thisAssetData;
                                                            // out.println("<br>clause2");
                                                        }
                                                        else if((selectedPresentation.mimetype=="video/3gpp") ||(selectedPresentation .mimetype=="application/x-shockwave-flash")){
                                                             // out.println("<br>clause3");
                                                                selectedPresentation = thisAssetData;
                                                        }
                                                        else if((deviceId.indexOf("iphone") != -1)&&(thisAssetData.url.indexOf("/iphone/") != -1)){ //iphone gets the iphone version
                                                                 selectedPresentation = thisAssetData;
                                
                                                        }
                                                        else if((deviceId.indexOf("ipad") != -1)&&(thisAssetData.url.indexOf("/ipad/") != -1)){ //ipad gets the ipad version
                                                                selectedPresentation = thisAssetData;
                                
                                                        }
                                                        //break;
                                                     }

                                                         //3gpp trumps flash
                                                    if ((thisAssetData.mimetype=="video/3gpp") && (serveMp4 == true) && (thisAssetData.languagecode==languageCode)) {
                                                         //containsMp4 = true;
                            
                                                        if((deviceOs.indexOf("Android") != -1)&&(thisAssetData.url.indexOf("/android/") != -1)){ //iphone gets the iphone version
                                                                selectedPresentation = thisAssetData;
                                                         break;                                             //we've got the one we want
                                
                                                        }
                            
                                                         if(selectedPresentation==null){
                                                             selectedPresentation = thisAssetData;
                                                            //out.println("<br>clause4");
                                                         }
                                                        else if(selectedPresentation.mimetype=="application/x-shockwave-flash"){
                                                            //out.println("<br>clause5");
                                                            selectedPresentation = thisAssetData;
                                                        }
                          
                                                             // break;
                                                    }   
                                                   //flash fallback 

                                                    if ((thisAssetData.mimetype=="video/x-flv")  && (thisAssetData.languagecode==languageCode)) {
                                                   // if ((thisAssetData.mimetype=="video/x-flv") && (serveFlash == true) && (thisAssetData.languagecode==languageCode)) {

                                                        // containsFlash = true;
                                                        if(selectedPresentation==null){
                                                            selectedPresentation = thisAssetData;
                                                            // out.println("<br>clause6");
                                                        }
                            //break;
                                                    }



                                             
                                             }//video

                                             
                                         }
                                       // console.log("Selected Presentation: " + JSON.stringify(selectedPresentation));
                                         if(selectedPresentation !== undefined){
                                                assetsData[selectedPresentation.assetindex]=selectedPresentation;
                                                if (selectedPresentation.mimetype==="application/x-shockwave-flash")
                                                    containsFlash = true;
                                                if (selectedPresentation.mimetype==="video/x-flv")
                                                    containsFlash = true;
                                                if (selectedPresentation.mimetype==="video/mp4")
                                                    containsMp4 = true;
                                                if (selectedPresentation.mimetype==="video/3gpp")
                                                    containsMp4 = true;
                                                if (selectedPresentation.mimetype==="video/quicktime")
                                                    containsQuicktime = true;

                                         }
                                           noOfAssets-=1;
                                           //console.log("noOfAssets: " + noOfAssets);
                                          // console.log("AssetQuery summaryImageUrl: " + summaryImageUrl + " aaIsVisible: " + aaIsVisible + " projectData: " + projectData + " assetAssembyData: " + assetAssemblyData + " noOfAssets: " + noOfAssets);
                               


                                              if(allQueriesDone()){
                                                  doneAllQueries("OK");
                                            }
                                           
                                       
                                     });
                                }
                             
                                  


                                 if(allQueriesDone()){
                                    
                                   // console.log("done all queries");
                                  doneAllQueries("OK");
                                }
                         
                        }
                    });
                    
                  
                    
                    
                    
                    
                    // And done with the connection.
                    connection.release();
                   // console.log("Release the connection");
                    
                    // });
                    
                    
                    
                });

                  }); // 1111
                
                
              //  res.end();
            });
        }
        
        var httpRequest=http.request(wurfloptions, callback);
         
        httpRequest.on('error', function(e) {
            console.log('problem with http request: ' + e.message);
        doneAllQueries("Error","wurflerror");
         });
        httpRequest.end();
       
        
    }
    
    
    function getCapability(parsedObject,capability){
        //console.log('getCapability ' + capability );
        
        var obj=parsedObject.TeraWURFLQuery.device[0].capability;
        for(var k in obj){
            //console.log("KEY: " + k + "VALUE:"  +  obj[k]);
            var cap=obj[k];
            // console.log(JSON.stringify(cap["$"]));
            var name=cap["$"].name;
            var value=cap["$"].value;
           // console.log("KEY: " + k + "VALUE:"  +  obj[k] + " capacity: " + name + " capacity value: " + value);
            if(name==capability) {
           // console.log('getCapability ' + capability + " = " + value);
                return(value);
            }
            
        }
        return(null);

        
    }

    function uploadImageFromUrl(req,res){
      var url=req.body.url;

     
      var fname= randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
      var extension=fileExtension(url);

      var pathToUpload=__dirname +"/public/uploads/" + fname +'.' + extension;

       console.log("upload to " + pathToUpload + " from: " + url);

       download(url,pathToUpload,function(){
          res.end("{url:'" +"/uploads/" + fname +'.' + extension +"'}");
       });
       
    }

    function download(uri, filename, callback){
          request.head(uri, function(err, res, body){
              console.log('content-type:', res.headers['content-type']);
              console.log('content-length:', res.headers['content-length']);

          request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
          });
    };

    

  function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  }
  

   function fileExtension(url) {
    return url.split('.').pop().split(/\#|\?/)[0];
  }


// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// Attach the Express app to Cloud Code.
app.listen(app.get('port'));
