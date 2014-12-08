


if(typeof String.prototype.endsWith !== "function") {
    /**
     * String.prototype.endsWith
     * Check if given string locate at the end of current string
     * @param {string} substring substring to locate in the current string.
     * @param {number=} position end the endsWith check at that positionusers
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



//nconf is used globally
nconf=require('nconf');

var AWS = require('aws-sdk'); 

var UAParser=require('ua-parser-js');

var uaParser=new UAParser();




//favour environment variables and command line arguments
nconf.env().argv();

//if 'conf' environment variable or command line argument is provided, load 
//the configuration JSON file provided as the value
if(path=nconf.get('conf')){
  //logger.info("use file: " + path);
  nconf.file({file:path});
 
}

//nconf.defaults({
  
 //   databasehost     : 'dimpledbinstance.ck95qqenkefj.eu-west-1.rds.amazonaws.com',
 //   databaseuser     : 'dimpledbuser',
 //   databasepassword : 'dimpledbpw',
  //  database: 'dimpledb'
    
  
//});


//AWS.config.loadFromPath('AWSCredentials.json');



//var mongooseConnection=mongoose.connect(nconf.get('databaseurl'));
//autoIncrement.initialize(mongooseConnection);


//configure logging
var winston=require('winston');
var loggingConfig=nconf.get('logging');


var fileAndLine=loggingConfig.fileandline;



Object.keys(loggingConfig).forEach(function(key){
   
    if(key!= "fileandline")winston.loggers.add(key,loggingConfig[key]);

});

//logger is used globally

logger=require('winston').loggers.get('logger');
logger.exitOnError=false;

if(fileAndLine){
  var logger_info_old=logger.info;
  logger.info=function(msg){
    var fandl=traceCaller(1);
    return(logger_info_old.call(this,fandl + " " + msg));
  }


  var logger_error_old=logger.error;
  logger.error=function(msg){
    var fandl=traceCaller(1);
    return(logger_error_old.call(this,fandl + " " + msg));
  }
 
}

function traceCaller(n) {
    if( isNaN(n) || n<0) n=1;
    n+=1;
    var s = (new Error()).stack
      , a=s.indexOf('\n',5);
    while(n--) {
      a=s.indexOf('\n',a+1);
      if( a<0 ) { a=s.lastIndexOf('\n',s.length); break;}
    }
    b=s.indexOf('\n',a+1); if( b<0 ) b=s.length;
    a=Math.max(s.lastIndexOf(' ',b), s.lastIndexOf('/',b));
    b=s.lastIndexOf(':',b);
    s=s.substring(a+1,b);
    return s;
  }

//end logging config

var models=require('./mongoosemodels');




AWS.config.update({accessKeyId: nconf.get("awsaccessKeyId"), secretAccessKey: nconf.get("awssecretAccessKey"),region: 'eu-west-1'});
var s3 = new AWS.S3();



/*

var elastictranscoder=new AWS.ElasticTranscoder();

var params={
  Id:'1416055890519-01305a'
}

elastictranscoder.readPreset(params, function(err, data) {
  if (err) logger.info(err, err.stack); // an error occurred
  else     logger.info("PRESET:" + JSON.stringify(data));           // successful response
});

*/


/*Authentication*/
 var authenticateAPI = function(req, res, next){
  //logger.info("authenticate API");
  if (req.isAuthenticated()) { //we're logged in
     // logger.info("We're authenticated");
      return next(); 
    }
    else{ //see if username/parameters match

      
      //logger.info("req: " + JSON.stringify(req.query));
      var username=req.param('username');
      var apikey=req.param('apikey');
     // logger.info("check call username " + username + " api key " + apikey);

     // logger.info("username: " + username + " apikey: " + apikey);

      if((username !== undefined)&&(users.getUserApiKey(username)===apikey)){
       // logger.info("API auth OK");
        return next();
      }
     // else{
       // logger.info("API auth not OK");
      //  res.send(401,{status:401,message:"Not Authorised",type:"Authorisation Error"});
      //}

    }
  //res.redirect('/login.html');
  res.send(401,{status:401,message:"Not Authorised",type:"Authorisation Error"});
};

var authenticate=function(req,res,next){
  if (req.isAuthenticated()) { //we're logged in
      //logger.info("req[user]: " + JSON.stringify(req["user"]));
      res.cookie('dimpleuserid',req["user"]._id,{maxAge:2592000000});
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
var assetassemblies=require('./api/v1/routes/assetassemblies');
var gm=require('gm');
var mime=require("mime");
var util=require('util');
passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
 var dig = require('./http-digest-client');

var collections = ["counters"]
db = require("mongojs").connect(nconf.get('databaseurl'), collections);

var fs = require('fs'),
request = require('request');

app.set('port', process.env.PORT || 3000);
app.set('views',__dirname + '/views');
app.set('view engine','jade');

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
app.get('/GetProjectDetails',getProjectDetails);
app.get('/AssembleAssets', assembleAssets); 
app.get('/DimpleMap_v1',dimpleMap_v1);
app.get('/GenerateStylesheet',generateStylesheet);


app.post('/UploadImageFromUrl',authenticateAPI,uploadImageFromUrl);



app.post('/UploadLocalImage',authenticateAPI,uploadLocalImage);




//RESTful API

//projects
app.get('/api/v1/projects/',projects.getProjects);


app.get('/api/v1/projects/:projectid',projects.getProject);
app.put('/api/v1/projects/:projectid',projects.updateProject);
app.post('/api/v1/projects/',projects.addProject);
app.get('/api/v1/projects/:projectid/assetassemblies',projects.getProjectAssetAssemblies);
app.delete('/api/v1/projects/:projectid',projects.deleteProject);


//app.use('/api/v1/projects/',projects.handleError);





//app.use(function(err, req, resp, next) {
 //   resp.send('Ooops, something went wrong with a project');
//});

//users
app.get('/api/v1/users/',authenticateAPI,users.getUsers);
app.get('/api/v1/users/:userid',authenticateAPI,users.getUser);
app.get('/api/v1/users/:userid/projects/',authenticateAPI,users.getUserProjects);
app.post('/api/v1/users/:userid/projects/',authenticateAPI,users.addUserProject);
app.delete('/api/v1/users/:userid/projects/:projectid',authenticateAPI,users.deleteUserProject);
app.put('/api/v1/users/:userid/projects/:projectid',authenticateAPI,users.updateUserProject);


//assets

app.get('/api/v1/assets/',assets.getAssets);
app.get('/api/v1/assets/:assetid',authenticateAPI,assets.getAsset);
app.post('/api/v1/assets',authenticateAPI,assets.addAsset);
app.put('/api/v1/assets/:assetid',authenticateAPI,assets.updateAsset);


//assetassemblies
app.get('/api/v1/assetassemblies/',authenticateAPI,assetassemblies.getAssetAssemblies);
app.post('/api/v1/assetassemblies/',authenticateAPI,assetassemblies.addAssetAssembly);
app.put('/api/v1/assetassemblies/:assetassemblyid',assetassemblies.updateAssetAssembly);
app.delete('/api/v1/assetassemblies/:assetassemblyid',assetassemblies.deleteAssetAssembly);

app.get('/api/v1/assetassemblies/:assetassemblyid',assetassemblies.getAssetAssembly);


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


//logger.info("database: " + nconf.get('databaseurl'));

 pool  = mysql.createPool({
    host     : nconf.get('databasehost'),
    user     : nconf.get('databaseuser'),
    password : nconf.get('databasepassword'),
    database: nconf.get('database')
});

/*Authentication*/
 
function check_auth_user(username,password,done,public_id){
  models.UserModel.findOne({ userName:username,userPassword:password}, function (err, doc){
   // logger.info("Err: " + err);
    //logger.info("doc: " + doc);
    if(typeof doc =='undefined'){

       return done(null, false);
    }
    else{

      passport.serializeUser(function(res, done) {
              done(null,doc);
        });
 
      passport.deserializeUser(function(id, done) {
              done(null,doc);
 
        });
      return done(null, doc);

    }
  // doc is a Document
  });

}
    




function selectImageAP(req,res){
    var parsedUrl= require('url').parse(req.url,true);
    var pathName=parsedUrl.pathname;
    var query = parsedUrl.query;

    var assetid=query.assetid;
    var maxwidth=query.maxwidth;

    models.AssetModel.findOne({_id:assetid},function(err,doc){

        if(err){
           res.status(404).send('Not found');
          return; //we're done
        }
        if(doc==null){
          res.status(404).send('Not found');
          return; //we're done
        }

        var presentations=doc.presentations;

        presentations.sort(function(a,b){
            return(b.width - a.width);
        });

       // logger.info("sorted presentations: " + presentations);

        var redirectUrl;
        for(var p in presentations){
          //logger.info(" width: " + presentations[p].width + " maxwidth: " + maxwidth);
          if(presentations[p].width <= maxwidth){
            redirectUrl=presentations[p].url;
            break;

          }
        }

        if(typeof redirectUrl === 'undefined'){
         // logger.info("no presentation, presentations: " + JSON.stringify(presentations));
          if(typeof presentations[0] === 'undefined'){
            redirectUrl='/images/noimage50x50.png';
          }
          else redirectUrl=presentations[presentations.length -1].url;
        }

        res.writeHead(302, {'location':redirectUrl});
                    res.end();

    });

}



/*GenerateStylesheet*/

function generateStylesheet(req,res){
  var parsedUrl= require('url').parse(req.url,true);
    var pathName=parsedUrl.pathname;
    var query = parsedUrl.query;

    //var specis;
    //var rais;
    //var atisPerRule;
    //var cssRules=new Object();

    var useragent=query.useragent;
    var styleid=query.styleid;
    var isWirelessDevice=query.iswireless;
    var app=query.app;

    var count=0;//number of calls to make

    models.RuleAttrInstanceModel.findOne({_id:styleid},function(err,raim){
      if(raim != null){
          var nRules=0;
          
          for(rule in raim.rules){
            //logger.info("rule: " + rule);
            nRules++;
          }
         // logger.info(nRules + " rules");

          //count how many calls we will need to make
          for(rule in raim.rules){
            for(attribute in raim.rules[rule]){
              var type=raim.rules[rule][attribute].type;
              if(type != "string") count+=2;//2 calls per attribute
            }
          }




          for(rule in raim.rules){
           // logger.info("rule: " + rule);
            //cssRules[rule]={};              //create an entry for this rule
            var attributes=raim.rules[rule];
            //logger.info("attributes: " + JSON.stringify(attributes));
            for(attribute in raim.rules[rule]){
              
              var type=raim.rules[rule][attribute].type;
             // logger.info("attribute: " + JSON.stringify(attribute) + JSON.stringify(type) + " " + JSON.stringify(raim.rules[rule][attribute]));
              if(type=="string"){ //do nothing

              }
              else{
               // count++;
                fn =function(obj,r,a){
                     models.RuleAttrSpecInstanceModel.findOne({rulename:r},function(err,rasim){
                        //logger.info("RASIM: " + JSON.stringify(rasim));
                        var rasimObj=rasim.attributes[a][useragent];
                        if(typeof rasimObj != 'undefined'){

                              //logger.info("RASIMOBJECT: " + JSON.stringify(rasimObj) + " rule: " + r + "attr: " + a + "useragent: " + useragent);
                              obj.floorf=rasimObj.floorf;
                              obj.floori=rasimObj.floorf;
                              obj.maxf=rasimObj.maxf;
                              obj.maxi=rasimObj.maxi;
                             
                              //logger.info("count now: " + count);
                          }
                           count--;
                        if(count==0){
                            var outputCSS=formatCss(raim.rules,useragent,app);

                            res.end(outputCSS);
                        }

                      });
                   }(raim.rules[rule][attribute],rule,attribute);


                    fn2 =function(obj,r,a){
                     models.RuleAttrSpecModel.findOne({rulename:r},function(err,rasim){
                        //logger.info("RASIM: " + JSON.stringify(rasim));
                        var rasimObj=rasim.attributes[a];
                        if(typeof rasimObj != 'undefined'){
                            //logger.info("RASIMOBJECT2: " + JSON.stringify(rasimObj) + " rule: " + r + "attr: " + a );
                            obj.maxincrements=rasimObj.nincrements;
                          }
                        
                        count--;
                       // logger.info("count now: " + count);
                        if(count==0){
                            var outputCSS=formatCss(raim.rules,useragent,app);

                            res.end(outputCSS);
                        }

                      });
                   }(raim.rules[rule][attribute],rule,attribute);




                //process further
              }
            }
          }

          //var outputCSS=formatCss(raim.rules);

         // res.end(outputCSS);
        }
        else{
          res.end();
        }

    });


}


//var unit=si.unit;
//var valOutput=(value.nincrements * ((si.maxi - si.floori)/si.maxincrements)) + si.floori;
//if((useragent=="iphone-ipod")&&(app=="true")&&(attribute=="font-size")&&(key==".dimple-body")){
  
//    valOutput=valOutput/3;

function formatCss(rules,useragent,app){
  outString="";

  for(rule in rules){
    outString =outString + rule.replace(/\_/g,".") + "{\n";

    for(attribute in rules[rule]){
      outString+=attribute + ":";
      var type=rules[rule][attribute].type;
      if(type=="string"){
        outString+=rules[rule][attribute].valuestring + ";\n";
      }
      else if(type=="integer"){
        //outString+=JSON.stringify(rules[rule][attribute]) +"\n";
        var nincrements=rules[rule][attribute].nincrements;
        var maxi=rules[rule][attribute].maxi;
        var floori=rules[rule][attribute].floori;
        var maxincrements=rules[rule][attribute].maxincrements;
        var value=(nincrements * ((maxi - floori)/maxincrements)) + floori;

        if((useragent=="iphone-ipod")&&(app=="true")&&(attribute=="font-size")&&(rule=="_dimple-body")){
                          
                            value=value/3;
                        
        }
        var unit=rules[rule][attribute].unit;

        outString+=value+unit + ";\n";

      }
      else if(type=="float"){
        //outString+=JSON.stringify(rules[rule][attribute]) +"\n";
        var nincrements=rules[rule][attribute].nincrements;
        var maxf=rules[rule][attribute].maxf;
        var floorf=rules[rule][attribute].floorf;
        var maxincrements=rules[rule][attribute].maxincrements;
        var value=(nincrements * ((maxf - floorf)/maxincrements)) + floorf;
        var unit=rules[rule][attribute].unit;

        outString+=value+unit + ";\n";

      }

    }


    outString=outString+"}\n";
  }
  return(outString);

}


function getProjectDetails(req,res){
  var parsedUrl= require('url').parse(req.url,true);
  var pathName=parsedUrl.pathname;
  var query = parsedUrl.query;

  var projectid=query.projectid;
  var callback=query.callback;
   var returnObject=new Object();

   //get the project
  models.ProjectModel.findOne({_id:projectid},function(err,project){ 
    if(err){
      returnObject.status="ERROR";
      if(typeof callback != 'undefined'){
        res.end(callback + '(' + JSON.stringify(returnObject) + ')');
      }
      else res.end(JSON.stringify(returnObject));

    }
    else if(project != null){
      returnObject.status='OK';

      returnObject.projectid=project._id;
      returnObject.title=project.title=project.projectTitle;
      returnObject.description=project.description;
      returnObject.bannerassetid=project.bannerAsset;
      returnObject.stylesid=project.styles;


      if(typeof callback != 'undefined'){
        res.end(callback + '(' + JSON.stringify(returnObject) + ')');
      }
      else res.end(JSON.stringify(returnObject));

    }
    else{
      returnObject.status="ERROR";
      if(typeof callback != 'undefined'){
        res.end(callback + '(' + JSON.stringify(returnObject) + ')');
      }
      else res.end(JSON.stringify(returnObject));
    }

  });

}


function getAllProjectAssemblies(req,res){
  var parsedUrl= require('url').parse(req.url,true);
  var pathName=parsedUrl.pathname;
  var query = parsedUrl.query;
  var projectid=query.projectid;
  var language=query.language;
  var iconsize=query.iconsize
  var callback=query.callback;
  if(language==undefined)language="en";


  var host=req.headers.host;

  var returnObject=new Object();
  var assembliesData=new Object();

  //get the project
  models.ProjectModel.findOne({_id:projectid},function(err,project){ 
    returnObject.projectid=projectid;
    returnObject.projecttitle=project.projectTitle;
    returnObject.ip=host;
    returnObject.iconsize=iconsize;
    returnObject.assemblies=[];


    var l=Object.keys(project.assetAssemblies).length;

    console.log("Naas: " + l);


    for(aaid in project.assetAssemblies){
      console.log("aaid: " + aaid);

      models.AssetAssemblyModel.findOne({_id:aaid},function(err,assetAssembly){
        console.log("AA: " + JSON.stringify(assetAssembly));
        var newAA=new Object();
        newAA.longitude=assetAssembly.location[0];
        newAA.latitude=assetAssembly.location[1];
        newAA.layariconid=assetAssembly.icon;
        newAA.assetassemblytitle=assetAssembly.textElements[language].title;
        newAA.assetassemblysubtitle=assetAssembly.textElements[language].subtitle;
        newAA.summarytext1=assetAssembly.textElements[language].summarytext1;
        newAA.summarytext2=assetAssembly.textElements[language].summarytext2;
        newAA.summarytext3=assetAssembly.textElements[language].summarytext3;
        newAA.summarytext4=assetAssembly.textElements[language].summarytext4;

        newAA.visible=project.assetAssemblies[assetAssembly._id].visible;
        newAA.layarurl=assetAssembly.layarImageUrl;
        newAA.assetassemblydescription=assetAssembly.assetAssemblyDescription;
        newAA.assetassemblyid=assetAssembly._id;
        returnObject.assemblies.push(newAA);


        l--;
        if(l==0){
           returnObject.response="OK";
          res.writeHead(200, {'Content-Type': 'application/json'});

          if(typeof callback != 'undefined'){


            res.end(callback + '(' + JSON.stringify(returnObject) + ')');
          }
          else {
             res.end(JSON.stringify(returnObject));
          }
        }

      });
    }

   


  });



}



/*GetAllProjectAssemblies*/
/*function getAllProjectAssembliesOld(req,res){
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
       // logger.info("GetAllProjectAssemblies doneAllQueries");
        projectData.assemblies=assembliesData;
        

         res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify(projectData));
    }
   pool.getConnection(function(err, connection) {

            // var returnObject=new Object();

             if (err){
                            logger.info("getConnection error: " + err);
                           var returnObject=new Object();
                            returnObject.response="Error";
                            returnObject.message="Internal Database Connection Error";
                            res.end(JSON.stringify(returnObject));
                            return; //we're done
             }
            
                       
             
                
                //get the project details
                connection.query( 'SELECT projectid,title,description,startdate,enddate,bannerassetid,stylesid from project where projectid=' +projectid, function(err, rows) {
                   // logger.info("In get project query");

                     if (err){
                            logger.info("database query error: " + err);
                            var returnObject=new Object();
                            returnObject.response="Error";
                            returnObject.message="Internal Database Query Error";
                             res.end(JSON.stringify(returnObject));
                            return; //we're done
                        }
                    
                  
                    if(rows[0] != null){
                        projectData=rows[0];
                        //logger.info("There are rows");
                     
                    }
                    
                    if((projectData != undefined) &&(assembliesData != undefined)&&(assembliesCount==0))doneAllQueries();
                    
                   
                });
                

             var sqlQueryString= "select title,DATE_FORMAT(project.startdate,'%Y%/%m%/%d %T') as startdate,DATE_FORMAT(project.enddate,'%Y%/%m%/%d %T') as enddate,assetassemblydescription,assetassembly.assetassemblyid as assetassemblyid,layariconid,layarimageurl,summaryimageassetid,latitude,longitude,visible from project left join projectassetassembly on project.projectid=projectassetassembly.projectid  left join assetassembly on projectassetassembly.assetassemblyid=assetassembly.assetassemblyid  where  project.projectid=" + projectid + " order by assetassemblyid asc  ;";

                connection.query( sqlQueryString, function(err, assemblyRows) {
                   if (err){
                            logger.info("database query error: " + err);
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
                                             logger.info("database query error: " + err);
                                             returnObject=new Object();
                                            returnObject.response="Error";
                                            returnObject.message="Internal Database Query Error";
                                            res.end(JSON.stringify(returnObject));
                                            return; //we're done
                                    }
                                
                                    var textElements=rows[0];
                                  //  logger.info(textElements +" " + JSON.stringify(textElements));
                                    if(textElements != undefined){
                                        assemblyRows[textElements.rowindex].assetassemblytitle=textElements.assetassemblytitle;
                                        assemblyRows[textElements.rowindex].assetassemblysubtitle=textElements.assetassemblysubtitle;
                                        assemblyRows[textElements.rowindex].summarytext1=textElements.summarytext1;
                                        assemblyRows[textElements.rowindex].summarytext2=textElements.summarytext2;
                                        assemblyRows[textElements.rowindex].summarytext3=textElements.summarytext3;
                                        assemblyRows[textElements.rowindex].summarytext4=textElements.summarytext4;
                                    }
                                    assembliesCount-=1;
                                   // logger.info("assembliesCount: " + assembliesCount);
                                    
                                      if((projectData != undefined) &&(assembliesData != undefined)&&(assembliesCount==0))doneAllQueries();

                                });

                          if(row.summaryimageurl == undefined)row.summaryimageurl="";
                            //get the summary image url
                          


                          var summaryImageQuery="select " + i + " as rowindex, assetpresentationid,assetpresentation.assetid,assettypedescription,mimetype ,url,localurl,posterurl ,localposterurl,quality ,width ,height ,languagecode from asset inner join assetpresentation on asset.assetid=assetpresentation.assetid inner join assettype on asset.assettypeid=assettype.assettypeid and assetpresentation.assetid=" +row.summaryimageassetid + " and width > 0 order by width asc";
                           //logger.info(summaryImageQuery);
                            connection.query( summaryImageQuery, function(err, saurlRows) {
                            if (err){
                                    logger.info("database query error: " + err);
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
                                //logger.info("summaryImageUrl: " + summaryImageUrl);
                                //assemblyRows[saurlRows[0].rowindex].summaryimageurl=summaryImageUrl;

                                assembliesCount-=1;

                               if((projectData != undefined) &&(assembliesData != undefined)&&(assembliesCount==0))doneAllQueries();
  
                            });

                                

                        }

                        
                        
                   
                

                  if((projectData != undefined) &&(assembliesData != undefined)&&(assembliesCount==0))doneAllQueries();

                  
                 
                });

              
                
                                          
                
                
                  // And done with the connection.
                    connection.release();
                    //logger.info("Release the connection");
                
          
            
            
            
        });

}*/


function assembleAssets(req,res){

  getDevice(req,res,renderAssetAssembly);


}



function dimpleMap_v1(req,res){
  getDevice(req,res,renderWebMap_v1);
}



function getDevice(req,res,renderFunction){

   //get the UserAgent
    var ua=encodeURIComponent(req.headers['user-agent']);
   
    //logger.info("ua: " + req.headers['user-agent']);

    //logger.info("digest client: " + dig.createDigestClient);

    digest=dig.createDigestClient("5184b7b9ed","x456ct4K8jXBkYY3");

    digest.request({
        method:"POST",
       
        host:"http://api.handsetdetection.com",
         path:'/apiv3/site/detect/53622.json',
         headers: {'content-type' : 'application/json'},
         json:true,
        body:    {'user-agent':ua},
    },function(response){

       // logger.info(response);
       // res.end(response.message);
        var device=new Object();

       /* var projectId;
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
        var max_image_width;*/
    
        var parsedUrl= require('url').parse(req.url,true);
        var query=parsedUrl.query;
        device.aacallback=query.callback;
        device.ua=ua;

        //get query paramaters
         device.projectId=query.projectid;

         //for asset assemblies
         if(query.return != undefined)device.returnType=query.return;
         else device.returnType='html';


         
         device.app=query.app;
         device.aaid=query.assetassemblyid;
         device.languageCode=query.languagecode;
         device.plaintext=query.plaintext;
         if(typeof device.plaintext==='undefined')device.plaintext="false";


         //for v1 maps


         device.markersurl=query.markersurl;
         device.iconsize=query.iconsize;
         device.title=query.title;
         device.subtitle=query.subtitle;

         

         if(typeof device.languageCode == 'undefined')device.languageCode='en';



         if(response.message=="OK"){  //device was recognised
            device.deviceOs=response.hd_specs.general_platform;
            device.model=response.hd_specs.general_model;
            if((response.class=='Mobile')||(response.class=="Tablet"))
              device.isWirelessDevice=true;

              //images
              device.resolution_width=response.hd_specs.display_x;
              device.resolution_height=response.hd_specs.display_y;
              device.max_image_width=response.hd_specs.display_x;
              device.max_image_height=response.hd_specs.display_y;

              //video

              if(response.hd_specs.media_videoplayback.indexOf("MOV")!=-1)
                  device.playback_mov=true;
              if(response.hd_specs.media_videoplayback.indexOf("MPEG4")!=-1)
                  device.playback_mp4=true;


              //audio
              if(response.hd_specs.media_audio.indexOf("MP3")!=-1)
                  device.playback_mp3=true;
              if(response.hd_specs.media_audio.indexOf("WAV")!=-1)
                  device.playback_wav=true;
              if(response.hd_specs.media_audio.indexOf("AAC")!=-1)
                  device.playback_aac=true;
              if(response.hd_specs.media_audio.indexOf("AMR")!=-1) //need to check this
                  device.playback_amr=true;



                //Mobile device Special cases

                //iOS can serve MOV

                if(device.deviceOs=="iOS"){
                  device.playback_mov=true;
                }





         }
         else{ //Non mobile devices - special cases

            //parse the ua

            uaParser.setUA(req.headers['user-agent']);
            var parseUAResult=uaParser.getResult();

            logger.info("parse UA: " + JSON.stringify(parseUAResult));

            device.max_image_width=800;
            device.isWirelessDevice=false;
            device.playback_mp3=true;

            //special cases

            logger.info("DEVICE UA: " + device.ua);
            if(parseUAResult.browser.name == 'Safari'){
              device.playback_mov=true;

            }
         }


         device.stylesheetType=getStylesheetTypeForUserAgent(device.deviceOs,device.model,device.isWirelessDevice);


         models.ProjectModel.findOne({_id:device.projectId},function(err,project){ //get the project
              logger.info("project: " + JSON.stringify(project.assetAssemblies));
              var maxWidth=device.max_image_width;
              /*for(var i=0;i<project.assetAssemblies.length;i++){
                var aa=project.assetAssemblies[i];
                logger.info("aaid:" + device.aaid + " aa: " + JSON.stringify(aa));
                if(aa.assetAssemblyId==device.aaid){
                  device.visible=aa.visible;
                }
              }*/
              if(typeof device.aaid != 'undefined')device.visible=project.assetAssemblies[device.aaid];

              device.projectData=project;

              device.styleid=project.styles;

              //get the stylestring

              var stylesheetUrl='http://127.0.0.1:' + app.get('port') + '/GenerateStylesheet?styleid=' + device.styleid + "&iswireless=" + device.isWirelessDevice + "&useragent=" + device.stylesheetType + "&app=false";

              //logger.info("stylesheetUrl: " + stylesheetUrl);
              request.get(stylesheetUrl,function(err,response,body){
                  //logger.info("err: " + err + " response: " + response);
                  logger.info("stylesheet body: " + body);
                  device.stylestring=body;
              
                        

                        models.AssetModel.findOne({_id:project.bannerAsset},function(err,bannerasset){ //get the banner asset



                              var bannerUrl;
                              if(bannerasset !== null){
                                     var presentations=bannerasset.presentations;

                                      presentations.sort(function(a,b){
                                          return(b.width - a.width);
                                      });

                                     // logger.info("sorted presentations: " + presentations);

                                      
                                      for(var p in presentations){
                                        //logger.info(" width: " + presentations[p].width + " maxwidth: " + maxwidth);
                                        if(presentations[p].width <= maxWidth){
                                          bannerUrl=presentations[p].url;
                                          break;

                                        }
                                      }

                                      if(typeof bannerUrl === 'undefined'){
                                       // logger.info("no presentation, presentations: " + JSON.stringify(presentations));
                                        if(typeof presentations[0] === 'undefined'){
                                          bannerUrl='/images/noimage50x50.png';
                                        }
                                        else bannerUrl=presentations[presentations.length -1].url;
                                      }

                                      device.bannerUrl=bannerUrl;
                                      //renderAssetAssembly(device,res);

                                     // res.end(JSON.stringify(device));

                              }
                              else{
                                //renderAssetAssembly(device,res);
                                //res.end(JSON.stringify(device));
                              }


                              //get the Asset Assembly asset, if there is one


                              if(typeof device.aaid != 'undefined'){

                                      models.AssetAssemblyModel.findOne({_id:device.aaid},function(err,assetAssembly){
                                        device.assetAssembly=assetAssembly;


                                        var summaryImageId=assetAssembly.imageAsset;

                                        //find the summary image

                                        models.AssetModel.findOne({_id:summaryImageId},function(err,imageAsset){
                                            var summaryImageUrl;
                                            if(imageAsset !== null){
                                                var presentations=imageAsset.presentations;

                                                  presentations.sort(function(a,b){
                                                      return(b.width - a.width);
                                                  });
                                                  summaryImageUrl=presentations[0].url;
                                            }
                                            device.summaryImageId=summaryImageId;
                                            device.summaryImageUrl=summaryImageUrl;

                                            renderFunction(device,res);

                                        });

                                      });
                              }
                              else{
                                renderFunction(device,res);
                              }

                             

                          });
                });

            
         });


         


    });

}

function renderAssetAssembly(device,res){

  var returnObject=new Object();
        
  //logger.info("done all queries");
 // logger.info(projectData);
  //logger.info(aaIsVisible);
  //logger.info("AssetAssmblyData: " + assetAssemblyData);
 // logger.info(assetsData);
 // logger.info(summaryImageUrl);

 logger.info("renderAssetAssembly " + JSON.stringify(device));
 
  returnObject.response="OK";
 
  returnObject.pagetitle=device.projectData.projectTitle;
  returnObject.bannerassetid=device.projectData.bannerassetid;
  returnObject.bannerasseturl=device.bannerUrl;
  returnObject.stylesid=device.projectData.styles;
  returnObject.projectid=device.projectId;
  returnObject.assetassemblyid=device.aaid;
  returnObject.language=device.languageCode;
  returnObject.visible=device.visible;

  returnObject.title=device.assetAssembly.textElements[device.languageCode].title;
  returnObject.subtitle=device.assetAssembly.textElements[device.languageCode].assetassemblysubtitle;
  returnObject.summarytext1=device.assetAssembly.textElements[device.languageCode].summarytext1;
  returnObject.summarytext2=device.assetAssembly.textElements[device.languageCode].summarytext2;
  returnObject.summarytext3=device.assetAssembly.textElements[device.languageCode].summarytext3;
  returnObject.summarytext4=device.assetAssembly.textElements[device.languageCode].summarytext4;

  returnObject.summaryimageassetid=device.summaryImageId;
  if(typeof device.summaryImageUrl=='undefined')
    returnObject.summaryimageurl="";
  else returnObject.summaryimageurl=device.summaryImageUrl;


  returnObject.layariconid=device.assetAssembly.icon;

  returnObject.stylestring=device.stylestring;
  returnObject.deviceOs==device.deviceOs;
  returnObject.iswirelessdevice=device.isWirelessDevice

  

  var nAssets=device.assetAssembly.assets.length;

  
  var sortedAssets=device.assetAssembly.assets.sort(function(a,b){
            return(a.index - b.index);
        });

  var count=nAssets; //number of callbacks

  returnObject.assets=new Array(nAssets);

  for(var i=0;i<nAssets;i++){

    logger.info("asset: " + JSON.stringify(sortedAssets[i]));
     var assetIndex=sortedAssets[i].index;

    //find the asset

    var fn = function(index,assetIndex){
        models.AssetModel.findOne({_id: sortedAssets[i].assetid},function(err,asset){


          //Get the poster asset url
          logger.info("posterAsset: " + asset.posterAsset);
          if((typeof asset.posterAsset !== 'undefined')&&(asset.posterAsset != null)&&(asset.posterAsset > 0)) {
            logger.info("Go Get posterasset posterAsset: " + asset.posterAsset);
            count++;

            models.AssetModel.findOne({_id:asset.posterAsset},function(err,posterAsset){
               var selectedPresentation;
              
              var presentations=posterAsset.presentations;
              var nPresentations=presentations.length;

              for(var i=0;i<nPresentations;i++){
              var thisPresentation=presentations[i];

              if(typeof selectedPresentation=='undefined'){
                if(thisPresentation.width <= device.max_image_width)
                    selectedPresentation=thisPresentation;
              }
              else if((thisPresentation.width > selectedPresentation.width)&&(thisPresentation.width <= device.max_image_width)){
                selectedPresentation=thisPresentation;

              }
              }

               returnObject.assets[index].posterurl=selectedPresentation.url;

              count--;

              console.log("Count= " + count);

              if(count==0){ //we're done
                  if(device.returnType == 'json'){
                    returnObject.assemblies=returnObject.assets;

                    if(typeof device.aacallback == 'undefined')
                      res.json(returnObject);
                    else res.end(device.aacallback + '(' + JSON.stringify(returnObject) + ')');
                  }
                  else if(device.returnType=='html'){
                    //render through a jade template
                    //logger.info("output html");
                   // logger.info("stylestring: " + returnObject.stylestring);
                    res.render('assetassembly',returnObject);
                  }
                  else res.end();

              }
            });


          }




          var typeid=asset.assetTypeId;
          var selectedPresentation;
           var sp=new Object();
          var presentations=asset.presentations;
          var nPresentations=presentations.length;
          logger.info("Asset: " + JSON.stringify(asset));

          if(typeid==0){//text
            for(var i=0;i<nPresentations;i++){
                var thisPresentation=presentations[i];
                //logger.info("thisPresentation: " + JSON.stringify(thisPresentation));
                if(thisPresentation.languageCode==device.languageCode){
                  selectedPresentation=thisPresentation;

                

                  break;
                }
            }
          }
          else if(typeid==1){ //video
            var videoPresentations=new Object();
            for(var i=0;i<nPresentations;i++){
              var thisPresentation=presentations[i];
              //logger.info("presentation: " + JSON.stringify(thisPresentation));
              if(thisPresentation.languageCode==device.languageCode){
                if((thisPresentation.mimetype=='video/quicktime')&&(device.playback_mov)){
                  videoPresentations["mov"]=thisPresentation;

                }
              }
              if(thisPresentation.languageCode==device.languageCode){
                //logger.info(JSON.stringify(thisPresentation) + " Language OK");
                if(thisPresentation.mimetype=='video/mp4'){
                  //logger.info("Its mp4")
                  if((thisPresentation.url.indexOf('/web/')!=-1)&&(!device.isWirelessDevice)){ //not amobile device
                    //logger.info("its web and not mobile");
                    if(typeof videoPresentations["web"] != 'undefined'){
                        videoPresentations["web"].push(thisPresentation);
                    }
                    else {
                      videoPresentations["web"] = new Array();
                      videoPresentations["web"].push(thisPresentation);
                    }


                  }
                  else{
                    videoPresentations["mp4"]=thisPresentation;
                  }

                }
                else if(thisPresentation.mimetype=="video/webm"){
                  if((thisPresentation.url.indexOf('/web/')!=-1)&&(!device.isWirelessDevice)){ //not amobile device
                  //  logger.info("its web and not mobile");
                    if(typeof videoPresentations["web"] != 'undefined'){
                        videoPresentations["web"].push(thisPresentation);
                    }
                    else {
                      videoPresentations["web"] = new Array();
                      videoPresentations["web"].push(thisPresentation);
                    }


                  }

                }
              }

            }
           // logger.info("videoPresentations: " + JSON.stringify(videoPresentations));

            if(typeof videoPresentations['mov']!== 'undefined'){
              selectedPresentation=videoPresentations['mov'];
              returnObject.serveQuicktime=true;
            }
            else if(typeof videoPresentations['web']!=='undefined'){
              selectedPresentation=videoPresentations["web"];
            }
            else if(typeof videoPresentations["mp4"] !== 'undefined'){
              selectedPresentation=videoPresentations["mp4"];
            };

          }
          else if(typeid==2){//audio
            var audioPresentations=new Object();

            for(var i=0;i<nPresentations;i++){
                var thisPresentation=presentations[i];
                if(thisPresentation.languageCode==device.languageCode){
                  if((thisPresentation.mimetype == 'audio/mpeg')&&(device.playback_mp3))
                    audioPresentations["mp3"]=thisPresentation;
                }
                if(thisPresentation.languageCode==device.languageCode){
                  if((thisPresentation.mimetype == 'audio/x-aac')&&(device.playback_aac))
                    audioPresentations["aac"]=thisPresentation;
                }
                if(thisPresentation.languageCode==device.languageCode){
                  if((thisPresentation.mimetype == 'audio/3gpp')&&(device.playback_amr))
                    audioPresentations["amr"]=thisPresentation;
                }
                if(thisPresentation.languageCode==device.languageCode){
                  if((thisPresentation.mimetype == 'audio/x-wav')&&(device.playback_wav))
                    audioPresentations["wav"]=thisPresentation;
                }


            }

            if(typeof audioPresentations['aac'] != 'undefined'){
              selectedPresentation=audioPresentations['aac'];
            }
            else if(typeof audioPresentations['mp3']!= 'undefined'){
              selectedPresentation=audioPresentations['mp3'];

            }
            else if(typeof audioPresentations["amr"]!= 'undefined'){
              selectedPresentation=audioPresentations['amr'];

            }
            else if(typeof audioPresentations["wav"]!= 'undefined'){
              selectedPresentation=audioPresentations['wav'];

            }


          }
          else if((typeid==3)||(typeid==4)){ //image/webcam

            for(var i=0;i<nPresentations;i++){
              var thisPresentation=presentations[i];

              if(typeof selectedPresentation=='undefined'){
                if(thisPresentation.width <= device.max_image_width)
                    selectedPresentation=thisPresentation;
              }
              else if((thisPresentation.width > selectedPresentation.width)&&(thisPresentation.width <= device.max_image_width)){
                selectedPresentation=thisPresentation;

              }
            }
          }
          else if(typeid==5){ //question

          }
          else if(typeid==6){ //loginwidget

          }
          else if(typeid==7){//action

          }

         
         
         

          for(var attrname in selectedPresentation){
            sp[attrname]=selectedPresentation[attrname];
          }
            var assetCaption;
           if(typeof asset.captions !== 'undefined'){
            assetCaption=asset.captions[device.languageCode];
            
          }

          //logger.info("sp now :" + JSON.stringify(sp));

         // logger.info("selectedPresentation: " + JSON.stringify(sp));
          returnObject.assets[index]=new Object();
          returnObject.assets[index].assetcaption=assetCaption;
          //returnObject.assets[index].presentation=selectedPresentation;
          var assetTypeS;
          if(typeid==0){
            assetTypeS='text';
          }
          else if(typeid==1){
            assetTypeS='video';
          }
          else if(typeid==2){
            assetTypeS='audio';
          }
          else if(typeid==3){
            assetTypeS='image';
          }
          else if(typeid==4){
            assetTypeS='webcam';
          }
          else if(typeid==5){
            assetTypeS='question';
          }
          else if(typeid==6){
            assetTypeS='loginwidget';
          }
          else if(typeid==7){
            assetTypeS='action';
          }

          //asset
          returnObject.assets[index].assettype=assetTypeS;
          returnObject.assets[index].assettypeid=typeid;

          returnObject.assets[index].assetindex=assetIndex;
          returnObject.assets[index].assetid=asset._id;
          returnObject.assets[index].version=asset.version;
          returnObject.assets[index].posterassetid=asset.posterAsset;
          returnObject.assets[index].assetdescription=asset.assetDescription;


          //presentation

          if(typeof selectedPresentation !== 'undefined'){
              returnObject.assets[index].mimetype=selectedPresentation.mimetype;
              returnObject.assets[index].url=selectedPresentation.url;
              returnObject.assets[index].quality=selectedPresentation.quality
              returnObject.assets[index].width=selectedPresentation.width;
              returnObject.assets[index].height=selectedPresentation.height;
              returnObject.assets[index].language=selectedPresentation.languageCode;
              returnObject.assets[index].data=selectedPresentation.data;

              if(typeof selectedPresentation[0] !== 'undefined'){
                returnObject.assets[index].urls=selectedPresentation;
              }
          }



          count--;
          logger.info("count: " + count);
          if(count==0){
              if(device.returnType == 'json'){
                returnObject.assemblies=returnObject.assets;
                if(typeof device.aacallback == 'undefined')
                      res.json(returnObject);
                    else res.end(device.aacallback + '(' + JSON.stringify(returnObject) + ')');
                
              }
              else if(device.returnType=='html'){
                //render through a jade template
                //logger.info("output html");
                //logger.info("stylestring: " + returnObject.stylestring);
                //res.render('assetassembly',returnObject);
                res.render('assetassembly',returnObject);
              }
              else res.end();

          }



        });
  }(i,assetIndex);
  }


 
 // returnObject.visible=(aaIsVisible ==1) ?"true":"false";
  //returnObject.summaryimageurl=summaryImageUrl;
  
 /* if(assetAssemblyData != undefined){
     returnObject.title=assetAssemblyData[0].assetassemblytitle;
     returnObject.subtitle=assetAssemblyData[0].assetassemblysubtitle;
     returnObject.summarytext1=assetAssemblyData[0].summarytext1;
     returnObject.summarytext2=assetAssemblyData[0].summarytext2;
     returnObject.summarytext3=assetAssemblyData[0].summarytext3;
     returnObject.summarytext4=assetAssemblyData[0].summarytext4;
     returnObject.summaryimageassetid=assetAssemblyData[0].summaryimageassetid;
     returnObject.layariconid=assetAssemblyData[0].layariconid;

          

         
          //logger.info("AssetAssemblydata: " + JSON.stringify(assetAssemblyData));
          //logger.info("AssetsData: " + JSON.stringify(assetsData));
          
         // returnObject.assets=new Array(assetAssemblyData.length);
    returnObject.assets=new Array();

    //res.json(device);
  }*/

  //if(device.returnType == 'json'){
 //   res.json(returnObject);
  //}
  //else res.end();
  

}

function renderWebMap_v1(device,res){
  logger.info("device: " + JSON.stringify(device));
  res.render('dimplewebmap',device);
}





function getStylesheetTypeForUserAgent(deviceOs,  model, isWirelessDevice) {
        //logger.info("getStylesheetTypeForUserAgent " + deviceOs + " " + deviceId + " " + isWirelessDevice);
        if(isWirelessDevice=="false") return("generic-desktop");
        if(typeof deviceOs=='undefined')return("generic-desktop");
      
        if(deviceOs.indexOf("Android")!= -1){
            return("iphone-ipod");
           
        }
        if(model.indexOf("iPhone")!= -1){
            return("iphone-ipod");
        }
        if(model.indexOf("iPod")!= -1){
            return("iphone-ipod");
        }
        if(model.indexOf("iPad")!= -1){
            return("iphone-ipod");
        }
        return("generic-mobile");
}

/*AssembleAssets */

function assembleAssetsOld(req,res){
   
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

      //logger.info("bannerAssetUrl: " + bannerAssetUrl + " summaryImageUrl: " + summaryImageUrl + " aaIsVisible: " + aaIsVisible + " projectData: " + projectData + " assetAssemblyData: " + assetAssemblyData + " noOfAssets: " + noOfAssets);
        if((bannerAssetUrl != undefined)&&(summaryImageUrl != undefined)&&(aaIsVisible != undefined)&&(projectData != undefined)&&(assetAssemblyData != undefined)&&(noOfAssets==0)){
                return(true);
            }
        else return(false);
   }
   
   var getStylesheetTypeForUserAgent=function(deviceOs,  deviceId, isWirelessDevice) {
        //logger.info("getStylesheetTypeForUserAgent " + deviceOs + " " + deviceId + " " + isWirelessDevice);
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
        //logger.info("done all queries");
       // logger.info(projectData);
        //logger.info(aaIsVisible);
        //logger.info("AssetAssmblyData: " + assetAssemblyData);
       // logger.info(assetsData);
       // logger.info(summaryImageUrl);
       
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

        

       
        //logger.info("AssetAssemblydata: " + JSON.stringify(assetAssemblyData));
        //logger.info("AssetsData: " + JSON.stringify(assetsData));
        
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
        
      //logger.info("return Object: " + JSON.stringify(returnObject) + " END");
        
        if(returnType==="json"){
          
            res.writeHead(200, {'Content-Type': 'text/plain'});
            if(aacallback===undefined)res.end(JSON.stringify(returnObject));
            else res.end(aacallback + "(" + JSON.stringify(returnObject)+ ")" );
            
        }
        else if(returnType==="html"){
            
            //get the stylesheet
            //logger.info('/GenerateStylesheet?styleid=' +returnObject.stylesid +'&iswireless=' + isWirelessDevice + '&useragent=' +stylesheetType +'&app=false');
            
            var getStylesheetOptions={
                host:'localhost',
                port:process.env.PORT || 3000,
                path:'/GenerateStylesheet?styleid=' +returnObject.stylesid +'&iswireless=' + isWirelessDevice + '&useragent=' +stylesheetType +'&app=false'
            };
            
            
            
            var getStylesheetCallback=function(response){
               // logger.info("in getStylesheetCallback");
                 var stylestring = '';

                        response.on('data', function (chunk) {
                    stylestring += chunk;
                });
                
                 response.on('end', function() {
                     //logger.info("in getStylesheetCallback end")
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
                              
                             // logger.info('STATUS: ' + response.statusCode);
                             // logger.info('HEADERS: ' + JSON.stringify(response.headers));
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

                                  //logger.info("nextAsset.assetText: " + nextAsset.assetText);
                                  if(textAssetsCount===0){
                                     // logger.info("Done all text Assets");
                                      outputHTMLPage(stylestring);
                                  }
                              });
                          });
                          textAssetRequest.on('error', function(e) {
                                logger.info('problem with textAsset http request: ' + e.message);
                                
                             });
                            textAssetRequest.end();
                          
                          })(nA);
                          
                      }
                    }
                    
                    if(textAssetsCount==0){
                        logger.info("Done all text Assets - there weren't any");
                         outputHTMLPage(stylestring);
                     }
                 
                 });
                
            }
            
            var outputHTMLPage=function(stylestring){
                   //logger.info(str);
                    
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
                                  //logger.info("Anonymous login");
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
                                  //logger.info("Anonymous login");
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
                              //logger.info("Question Text: " + questionText);


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
                                logger.info("No asset text: " + JSON.stringify(nextAsset));
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
                logger.info('problem with http request: ' + e.message);
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
    
   // logger.info('useragent: ' + encodeURIComponent(ua));
    
    //   var device=new Device(wurflserviceurl);
    
    
    var wurfloptions = {
        host: 'www.tera-wurfl.com',
        path: '/Tera-Wurfl/webservice.php?ua=' + ua
    };
    
    //logger.info('www.tera-wurfl.com//Tera-Wurfl/webservice.php?ua=' + ua);
    callback = function(response) {
        var str = '';

        
        
        
        response.on('data', function (chunk) {
            str += chunk;
        });
        
       
        response.on('end', function () {
            // logger.info(str);
            
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
                
             //   logger.info("projectid: " + projectId + "returnType: " + returnType + " app= " + app + " aaid= " + aaid);
              
                
                //res.write(JSON.stringify(result.TeraWURFLQuery.device.capability));
                //device.setDataForUserAgent(result);
               
                 deviceOs = getCapability(result,"device_os");
                 deviceId = getCapability(result,"id");
               //  logger.info("deviceID: " + deviceId);
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
              //   logger.info("Playback_flv: " + playback_flv + " playback_mov: " + playback_mov + " playback_mp4: " + playback_mp4) ;
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
                            logger.info("getConnection error: " + err);
                            doneAllQueries("Error","Internal Database Connection Error");
                            return; //we're done
                        }
                
                connection.query(projectQuery, 
                    function(err, rows) {

                        //logger.info("project query rows: " + JSON.stringify(rows));
                        //logger.info("In get project query");
                        if (err){
                            logger.info("query error: " + err);
                            
                            
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
                                                logger.info("query error: " + err);
                            
                            
                                                 doneAllQueries("Error","Internal Database Query Error");
                                            return;
                                            }
                                          var selectedPresentation;//=rows[0];
                                         //logger.info(rows);
                                      
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
                            // logger.info(projectData);
                             
                             if(allQueriesDone()){
                                 doneAllQueries("OK");
                                }
                         
                        }
                        else{
                            bannerAssetUrl="";
                            //logger.info("project rows is null");
                            projectData=new Object();
                           // logger.info("summaryImageUrl: " + summaryImageUrl + " aaIsVisible: " + aaIsVisible + " projectData: " + projectData + " assetAssembyData: " + assetAssemblyData + " noOfAssets: " + noOfAssets);
                               if(allQueriesDone()){  
                                   doneAllQueries("OK");
                                }
                        }
                    });
                    
                     connection.query(visibleQuery, 
                    function(err, rows) {
                        //logger.info("In get project query");
                        if (err){
                           if (err){
                            logger.info("query error: " + err);
                            
                            
                            doneAllQueries("Error","Internal Database Query Error");
                            return;
                        }
                        }
             
                        if(rows[0] != null){
                         
                             aaIsVisible=rows[0].visible;
                           //  logger.info(rows[0]);
                             
                                if(allQueriesDone()){
                                    doneAllQueries("OK");
                                }
                         
                        }
                        else{
                            aaIsVisible=false;
                         //   logger.info("summaryImageUrl: " + summaryImageUrl + " aaIsVisible: " + aaIsVisible + " projectData: " + projectData + " assetAssembyData: " + assetAssemblyData + " noOfAssets: " + noOfAssets);

                              if(allQueriesDone()){
                                  doneAllQueries("OK");
                                }
                        }
                    });
                    
                      connection.query(assemblyQuery, 
                    function(err, rows) {


                         
                         
                         
                        // logger.info("noOfAssets: " + noOfAssets);
                        //logger.info("In get project query");
                      
                            if (err){
                            logger.info("query error: " + err);
                            
                            
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
                               // logger.info("serve flash: " + serveFlash + " ServeQuicktime: " + serveQuicktime + " serveMP4: " + serveMp4);
                       
                     if(rows[0]==null){ //no asssets or assembly
                            doneAllQueries("OK");
                      }
                     else if(rows[0] != null){
                         
                           // logger.info("summaryassetid: " + rows[0].summaryimageassetid);
                            var siaid=rows[0].summaryimageassetid;
                            if(siaid != 0){ //get the url of the summary image
                                var summaryImageQuery="select assetpresentationid,assetpresentation.assetid,assettypedescription,mimetype ,url,localurl,posterurl ,localposterurl,quality ,width ,height ,languagecode,version from asset inner join assetpresentation on asset.assetid=assetpresentation.assetid inner join assettype on asset.assettypeid=assettype.assettypeid and assetpresentation.assetid=" +siaid + " and width > 0 order by width asc"
                                connection.query(summaryImageQuery, 
                                         function(err, rows) {
                                         if (err){
                                            logger.info("query error: " + err);
                            
                            
                                            doneAllQueries("Error","Internal Database Query Error");
                                            return;
                                           }
                                         
                                            if((rows !== undefined)&&(rows[0] !== undefined))summaryImageUrl=rows[0].url;
                                           // logger.info("summaryImageQuery summaryImageUrl: " + summaryImageUrl + " aaIsVisible: " + aaIsVisible + " projectData: " + projectData + " assetAssembyData: " + assetAssemblyData + " noOfAssets: " + noOfAssets);

                                              if(allQueriesDone()){
                                                  doneAllQueries("OK");
                                            }
                                         }
                                );
                            
                            }
                            else{
                                summaryImageUrl="";
                               // logger.info("summaryImageQuery summaryImageUrl: " + summaryImageUrl + " aaIsVisible: " + aaIsVisible + " projectData: " + projectData + " assetAssembyData: " + assetAssemblyData + " noOfAssets: " + noOfAssets);

                                              if(allQueriesDone()){
                                                  doneAllQueries("OK");
                                            }
                            }

                             assetAssemblyData=rows;
                            // logger.info(assetAssemblyData);
                           
                             for(var i in assetAssemblyData){
                             //now get the assets
                                
                                    var assetData=assetAssemblyData[i];
                                    var assetId=assetData.assetid;
                                    var posterAssetId=assetData.posterassetid;
                                    var assetTypeId=assetData.assettypeid;
                                    var assetTypeDescription=assetData.assettypedescription;
                                     var assetQuery = "select "+ i + " as assetindex, " + max_image_width + " as maxwidth, '"+ assetTypeDescription + "' as assettypedescription, mimetype, url,localurl,posterurl,localposterurl,quality,width,height,languagecode from assetpresentation where assetid=" + assetId;
                                  //   logger.info("Asset Query: " + assetQuery + " " + assetTypeDescription);
                                      

                                  if(posterAssetId > 0){
                                    //logger.info("Get poster for: " + posterAssetId);
                                    var posterAssetQuery = "select "+ i + " as theindex,"  + max_image_width + " as maxwidth, mimetype, url,localurl,posterurl,localposterurl,quality,width,height,languagecode,version from assetpresentation,asset where assetpresentation.assetid=" + posterAssetId + " and asset.assetid=" + posterAssetId + " order by width desc;";
                                   // logger.info("posterAssetQuery: " + posterAssetQuery);
                                    var selectedPosterAsset;
                                    connection.query(posterAssetQuery,function(err,rows){
                                    if (err){
                                            logger.info("query error: " + err);
                            
                            
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
                                            //logger.info("posterAssetUrl=" + selectedPosterAsset.url);
                                            posterUrls[selectedPosterAsset.theindex]=selectedPosterAsset.url;
                                        }
                                        noOfAssets-=1;
                                        //logger.info("posterassetquery summaryImageUrl: " + summaryImageUrl + " aaIsVisible: " + aaIsVisible + " projectData: " + projectData + " assetAssembyData: " + assetAssemblyData + " noOfAssets: " + noOfAssets);

                                              if(allQueriesDone()){
                                                  doneAllQueries("OK");
                                            }
                                    });
                                    
                                  }
                                  else{
                                    //logger.info("No Poster");
                                        noOfAssets-=1;
                                       // logger.info("posterassetquery summaryImageUrl: " + summaryImageUrl + " aaIsVisible: " + aaIsVisible + " projectData: " + projectData + " assetAssembyData: " + assetAssemblyData + " noOfAssets: " + noOfAssets);

                                             if(allQueriesDone()){
                                                 doneAllQueries("OK");
                                            }
                                  }
                                  



                                     connection.query(assetQuery,function(err,rows){
                                        //logger.info("Asset Query: " + assetQuery + " " + assetTypeDescription);
                                         if (err){
                                            logger.info("query error: " + err);
                            
                            
                                            doneAllQueries("Error","Internal Database Query Error");
                                            return;
                                           }
                                          var selectedPresentation;//=rows[0];
                                         //logger.info(rows);
                                      
                                         for(var rowIndex in rows){
                                                var thisAssetData=rows[rowIndex];
                                                // logger.info("thisAssetdata: " + JSON.stringify(thisAssetData));
                                             //logger.info("languageCode:" + languageCode + " plaintext:" + plaintext);
                                             if(thisAssetData.assettypedescription=="text"){
                                                 //logger.info("Its text");
                                                // logger.info("thisAssetdata: " + JSON.stringify(thisAssetData));
                                                 if(plaintext=='false'){
                                                     //logger.info("plaintext is false");
                                                     
                                                     if((thisAssetData.mimetype=="text/html")&&(thisAssetData.languagecode==languageCode)){
                                                        selectedPresentation=thisAssetData;
                                                        break;
                                                    }
                                                    //else {
                                                   //    logger.info("mimetype: " + thisAssetData.mimetype + " languagecode: " + thisAssetData.languagecode + "tested against: " + languageCode);
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
                                                 //logger.info("its image");
                                                // logger.info("current image Presentation: " + JSON.stringify(thisAssetData));
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
                                       // logger.info("Selected Presentation: " + JSON.stringify(selectedPresentation));
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
                                           //logger.info("noOfAssets: " + noOfAssets);
                                          // logger.info("AssetQuery summaryImageUrl: " + summaryImageUrl + " aaIsVisible: " + aaIsVisible + " projectData: " + projectData + " assetAssembyData: " + assetAssemblyData + " noOfAssets: " + noOfAssets);
                               


                                              if(allQueriesDone()){
                                                  doneAllQueries("OK");
                                            }
                                           
                                       
                                     });
                                }
                             
                                  


                                 if(allQueriesDone()){
                                    
                                   // logger.info("done all queries");
                                  doneAllQueries("OK");
                                }
                         
                        }
                    });
                    
                  
                    
                    
                    
                    
                    // And done with the connection.
                    connection.release();
                   // logger.info("Release the connection");
                    
                    // });
                    
                    
                    
                });

                  }); // 1111
                
                
              //  res.end();
            });
        }
        
        var httpRequest=http.request(wurfloptions, callback);
         
        httpRequest.on('error', function(e) {
            logger.info('problem with http request: ' + e.message);
        doneAllQueries("Error","wurflerror");
         });
        httpRequest.end();
       
        
    }
    
    
    function getCapability(parsedObject,capability){
        //logger.info('getCapability ' + capability );
        
        var obj=parsedObject.TeraWURFLQuery.device[0].capability;
        for(var k in obj){
            //logger.info("KEY: " + k + "VALUE:"  +  obj[k]);
            var cap=obj[k];
            // logger.info(JSON.stringify(cap["$"]));
            var name=cap["$"].name;
            var value=cap["$"].value;
           // logger.info("KEY: " + k + "VALUE:"  +  obj[k] + " capacity: " + name + " capacity value: " + value);
            if(name==capability) {
           // logger.info('getCapability ' + capability + " = " + value);
                return(value);
            }
            
        }
        return(null);

        
    }


    function uploadLocalImage(req, res){
      // the uploaded file can be found as `req.files.image` and the
      // title field as `req.body.title`
      logger.info("req.files: " + JSON.stringify(req.files));
       var fname= randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
      var extension=fileExtension(req.files.afile.originalFilename);
      var assetdescription=req.body.assetDescription;
      var userid=req.body.userid;
    var ins = fs.createReadStream(req.files.afile.path);

    var pathToUpload=__dirname + '/public/uploads/' + fname + '.' + extension;
    var  ous = fs.createWriteStream(pathToUpload);
          util.pump(ins, ous, function(err) {
            if(err) {
              logger.info("error:" + err);
            } else {

              //create the asset


        //at this point we need to create the asset
          logger.info("assetdescription: " + assetdescription + " userid: " + req["user"]);
         logger.info(JSON.stringify(req["user"]));
          var uri="http://127.0.0.1:" + app.get('port') + "/api/v1/assets";
          logger.info("uri: " + uri);
          //create the asset
          request({
              uri:uri,
              method:"POST",
              form:{
                "assetDescription": assetdescription,
                "userid":userid,
                "assetTypeId":3,
                "assetSubtypeId":0,
                "rating": 0,
                "posterAsset":0,
                "version":1.0,
                "username":req["user"].username,
                "apikey": users.getUserApiKey(req["user"].username)
              }

             },
              function(error,response,body){
                if(error){
                  logger.info("error " + error);
                }
                  logger.info("add asset response body:" + body);
                  var returnedObject= eval('(' + body + ')');

                  var newAssetId= returnedObject._id;

                  //upload original image to cloudfront
                  var key="user" + req["user"]._id + "/asset" + newAssetId +"/" + fname + '.' + extension;
                  var resReturns="{url:'" +"/uploads/" + fname +'.' + extension +"',assetid:" + newAssetId + "}";
                  uploadToAWS(pathToUpload,key,"image",newAssetId,userid,res,resReturns);


                 


                  //res.end("{url:'" +"/uploads/" + fname +'.' + extension +"',assetid:" + newAssetId + "}");

              }
                );





              //res.end("{url:'" + '/uploads/' + fname + '.' + extension + "'}");
            }
          });


     // logger.info("path:" + JSON.stringify(req.files.afile.path));
      // logger.info("filename:" + JSON.stringify(req.files.afile.originalFilename));
      /*res.send(format('\nuploaded %s (%d Kb) to %s as %s'
       , req.files.image.name
        , req.files.image.size / 1024 | 0 
        , req.files.image.path
        , req.body.title));*/
    };


    function uploadImageFromUrl(req,res){

      var parsedUrl= require('url').parse(req.url,true);
      var pathName=parsedUrl.pathname;
      var host=parsedUrl.host;

      
      logger.info("parsed url: " + JSON.stringify(parsedUrl));
      logger.info("pathname: " + pathName);

      var url=req.body.url;
      var assetdescription=req.body.description;
      var userid=req.body.userid;

     
      var fname= randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
      var extension=fileExtension(url);

      var pathToUpload=__dirname +"/public/uploads/" + fname +'.' + extension;

       logger.info("upload to " + pathToUpload + " from: " + url);

       download(url,pathToUpload,function(){

        //at this point we need to create the asset
          logger.info("assetdescription: " + assetdescription + " userid: " + userid);
          //logger.info(JSON.stringify(req["user"]));
          var uri="http://127.0.0.1:" + app.get('port') + "/api/v1/assets";
          logger.info("uri: " + uri);
          //create the asset
          request({
              uri:uri,
              method:"POST",
              form:{
                "assetDescription": assetdescription,
                "userid":userid,
                "assetTypeId":3,
                "assetSubtypeId":0,
                "rating": 0,
                "posterAsset":0,
                "version":1.0,
                "username":req["user"].username,
                "apikey": users.getUserApiKey(req["user"].username)
              }

          },
          function(error,response,body){
            if(error){
              logger.info("error " + error);
            }
              logger.info("add asset response body:" + body);
              var returnedObject= eval('(' + body + ')');

              var newAssetId= returnedObject._id;

              //upload original image to cloudfront
              var key="user" + userid + "/asset" + newAssetId +"/" + fname + '.' + extension;

              var resReturns="{url:'" +"/uploads/" + fname +'.' + extension +"',assetid:" + newAssetId + "}"
              uploadToAWS(pathToUpload,key,"image",newAssetId,userid,res,resReturns);


             


             // res.end("{url:'" +"/uploads/" + fname +'.' + extension +"',assetid:" + newAssetId + "}");

          }
            );

          //res.end("{url:'" +"/uploads/" + fname +'.' + extension +"',bannerassetid:" + newAssetId + "}");
       });
       
    }

    function download(uri, filename, callback){
          request.head(uri, function(err, res, body){
              logger.info('content-type:', res.headers['content-type']);
              logger.info('content-length:', res.headers['content-length']);

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


/*Upload a file to AWS*/

  function uploadToAWS(path,key,type,newAssetId,userId,res,resReturns){


        fs.readFile(path, function(err, file_buffer){
            var params = {
                ACL:'public-read',
                Bucket: nconf.get("awsbucket"),
                Key: key,
                Body: file_buffer
              };

              s3.putObject(params, function (perr, pres) {
              if (perr) {
                  logger.info("Error uploading data: ", perr);
              } else {
                  logger.info("Successfully uploaded data to " + params.Bucket + "/" + key);
                   //create and queue a new job
                   //image conversion
                   if(type ==="image"){
                    var job={
                          jobtype:'imageconversion',
                          url: "http://" + nconf.get("awsdistribution") + "/" + key,
                          assetid: newAssetId,
                          userid: userId  
                        }

                      queue.add(job,function(err,id){

                      });
                    /*
                        queue.create('imageconversion', {
                          url: "http://" + nconf.get("awsdistribution") + "/" + key,
                          assetid: newAssetId,
                          userid: userId

                   
                        }).save();
*/

                         gm(path).size(function(err,value){
                                 if(!err){
                                      logger.info("size returns: " + JSON.stringify(value));
                                      var width=value.width;
                                      var height=value.height;
                                      var mimeType=mime.lookup(path);

                                      var awsUrl="http://" + nconf.get("awsdistribution")+ "/" + key;



                                      var presentationObject={
                                        parentId:newAssetId,
                                        mimetype:mimeType,
                                        url:awsUrl,
                                        posterUrl:null,
                                        quality:null,
                                        width:width,
                                        height:height,
                                        languageCode:null
                                      }

                                      models.AssetModel.update(
                                        {_id:newAssetId},
                                        {$push:{'presentations':presentationObject}},
                                        {upsert:true},
                                        function(err,data){
                                          if(err)logger.info("uploadToAWS error: " + err);
                                          else{
                                            logger.info("uploadtoAws data: " + data);
                                            res.end(resReturns);
                                          }

                                        }
                                      );


                                    //  var insertQuery="insert into assetpresentation values(null," + newAssetId + ",'" + mimeType + "','" + awsUrl + "',null,null," + width + "," + height + ",null,null,null);";
                                     // logger.info("insertQuery: " + insertQuery);

                                      //now create the asset presentation
                                 /*    pool.getConnection(function(err, connection) {
                                            if (err){
                                                  var error=new Error("Database Connection Error");
                                                  error.http_code=500;
                                                  error.error_type='Internal Server Error';
                                                  logger.info("error: " + err);
                                                  connection.release();
                                                throw(error);
                  
                                            }

                                            connection.query(insertQuery,function(err,rows){
                                                  if(connection != null)connection.release();
                                                  if (err){
                                                        var error=new Error("Database Query Error");
                                                       error.http_code=500;
                                                       error.error_type='Internal Server Error';
                                                       logger.info("error: " + err);
                                                      
                                                       throw(error);
                                 
                                                  }
                                                 if(rows.length > 0){
                                   
                                                        var res=rows[0]; 
                                                        logger.info("insert returns: " + JSON.stringify(res));
                                                       
                                                    }else{
                                                        
                                                        logger.info("insert returns nothing");
                                                    }

                                            });//connection.query


                                     });//pool.getconnection
                                    */


                                 }//!err



                         });//gm(path)


                   }//type==image






                }

          });



        }); //fs.readfile
  }

        

  function getNextSequence(name) {
   var ret = db.counters.findAndModify(
          {
            query: { _id: name },
            update: { $inc: { seq: 1 } },
            new: true
          }
   );

   return ret.seq;
}




//Set up the job queue for image resizing and audio/video transcoding

//var kue = require('kue');
//var queue = kue.createQueue({
 //   redis: nconf.get("redis")
    
//  });

var mongoDbQueue = require('mongodb-queue');
var queue;

require("mongodb").MongoClient.connect(nconf.get('databaseurl'), function(err, db2) {

       queue = mongoDbQueue(db2, 'my-queue');

     
});



app.listen(app.get('port'));




/*var dig = require('./http-digest-client');

//logger.info("digest client: " + dig.createDigestClient);

digest=dig.createDigestClient("5184b7b9ed","x456ct4K8jXBkYY3");

digest.request({
    method:"POST",
   
    host:"http://api.handsetdetection.com",
     path:'/apiv3/site/detect/53622.json',
     headers: {'content-type' : 'application/json'},
     json:true,
    body:    {'user-agent':'NokiaN95'},
},function(res){

   
    logger.info(res.hd_specs.display_x);
  

});
*/







/*request({
    method:"POST",
    
    uri:"http://api.handsetdetection.com/apiv3/site/detect/53622.json",
    headers: {'content-type' : 'application/json'},
    body:"user-agent=NokiaN95",
  },
    function(error,response,body){

      logger.info("error: " + error);
      logger.info("response:" + JSON.stringify(response.headers));
      logger.info("body: " + body);
    }


);
*/
/*
request({"method":"POST","uri":"http://api.handsetdetection.com/apiv3/site/detect/53622.json",
    "headers":{"content-type":"application/json","Authorization":"Digest username=\"5184b7b9ed\",realm=\"APIv3\",nonce=\"APIv3\",uri=\"undefined\",qop=\"auth\",response=\"ea081c47223ec47b16499c802a2afa20\",opaque=\"APIv3\",nc=\"00000001\",cnonce=\"7525dca4\""},"body":"user-agent=NokiaN95"},
function(error,response,body){

      logger.info("error: " + error);
      logger.info("response:" + JSON.stringify(response.headers));
      logger.info("body: " + body);
    }


);
*/



/*var request = require('request');
request.post({
  headers: {'content-type' : 'application/json'},
  auth:{
      'user':"5184b7b9ed",
      'pass':'x456ct4K8jXBkYY3',
      'sendImmediately':false

    },
  url:     'http://api.handsetdetection.com/apiv3/site/detect/53622.json',
  //form:    {'user-agent':'NokiaN95'}
}, function(error, response, body){
  logger.info(body);
});*/



 /*var request = require('request')
  request(
    { method: 'GET'
    , uri: 'http://www.google.com'
    , gzip: true
    }
  , function (error, response, body) {
      // body is the decompressed response body
      logger.info('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'))
      logger.info('the decoded data is: ' + body)
    }
  ).on('data', function(data) {
    // decompressed data as it is received
    logger.info('decoded chunk: ' + data)
  })
  .on('response', function(response) {
    // unmodified http.IncomingMessage object
    response.on('data', function(data) {
      // compressed data as it is received
      logger.info('received ' + data.length + ' bytes of compressed data')
    })
  })*/













