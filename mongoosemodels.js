var mongoose=require('mongoose');

var ObjectId = require('mongoose').Types.ObjectId; 

var autoIncrement = require('mongoose-auto-increment');

var mongooseConnection=mongoose.connect(nconf.get('databaseurl'));
autoIncrement.initialize(mongooseConnection);

var Schema=mongoose.Schema;


var UserSchema= new Schema({
    userName: String,
    screenName: String,
    userPassword: String,
    email: String,
    confimationCode: String,
    activated: Boolean,
    useAws: Boolean,
    awsBucket: Boolean,
    useMimosaAwsCredentials: Boolean,
    awsSecurityKey: String,
    distribution: String,
    ftpHost: String,
    ftpDirectory: String,
    ftpUserName: String,
    ftpPassword: String,
    defaultLanguage: String,
    

});



UserSchema.plugin(autoIncrement.plugin, {
    model: 'UserModel',
    startAt: 100,
});

var ProjectSchema=new Schema({
       userid: Number,
      projectTitle: String,
      description:String,
      bannerAsset: Number,
      assetAssemblies:Object,//[{assetAssemblyId:Number,visible:Boolean}],
      styles: Number

});



ProjectSchema.plugin(autoIncrement.plugin, {
    model: 'ProjectModel',
    startAt: 100,
});



var AssetAssemblySchema=new Schema({
        assetAssemblyDescription: String,
        location:[],
        icon: Number,
        layarImageUrl: String,
        imageAsset:Number,
        assets:[{assetid:Number,index:Number}],
        textElements:Object,
        minzoom:Number,
        /*[{
          languageCode: String,
          title: String,
          subtitle: String,
          summarytext1: String,
          summarytext2: String,
          summarytext3: String,
          summarytext4: String
        }]*/

});

AssetAssemblySchema.index({ loc: '2d' });

AssetAssemblySchema.plugin(autoIncrement.plugin, {
    model: 'AssetAssemblyModel',
    startAt: 1000,
});



var AssetSchema=new Schema({
    _id:Number,
    assetDescription: String,
    assetTypeId:Number,
    assetSubtypeId:Number,
    rating:Number,
    version: Number,
    posterAsset: Number,
    userid: Number,
    captions:Object,//Associative array
    presentations:[{
        parentId:Number,
        mimetype:String,
        url:String,
        posterUrl:String,
        quality:String,
        width:Number,
        height:Number,
        languageCode:String,
        data: Schema.Types.Mixed
                
    }]

});

AssetSchema.plugin(autoIncrement.plugin, {
    model: 'AssetModel',
    startAt: 10000,
});


var RuleAttrInstanceSchema=new Schema({
    _id:Number, //styleid
    rules:Object

});

RuleAttrInstanceSchema.plugin(autoIncrement.plugin, {
    model: 'RuleAttrInstanceModel',
    startAt: 1000,
});

var RuleAttrSpecSchema=new Schema({
  _id:Number,
  rulename:String,
  attributes:Object

});

RuleAttrSpecSchema.plugin(autoIncrement.plugin, {
    model: 'RuleAttrSpecModel',
    startAt: 1000,
});

var RuleAttrSpecInstanceSchema=new Schema({
  _id:Number,
  rulename:String,
  attributes:Object

});

RuleAttrSpecInstanceSchema.plugin(autoIncrement.plugin, {
    model: 'RuleAttrSpecInstanceModel',
    startAt: 1000,
});



var UserModel=mongooseConnection.model('UserModel',UserSchema);

var AssetModel=mongooseConnection.model('AssetModel',AssetSchema);

var ProjectModel=mongooseConnection.model('ProjectModel',ProjectSchema);

var AssetAssemblyModel=mongooseConnection.model('AssetAssemblyModel',AssetAssemblySchema);

var RuleAttrInstanceModel=mongoose.model('RuleAttrInstanceModel',RuleAttrInstanceSchema);

var RuleAttrSpecModel=mongoose.model('RuleAttrSpecModel',RuleAttrSpecSchema);

var RuleAttrSpecInstanceModel=mongoose.model('RuleAttrSpecInstanceModel',RuleAttrSpecInstanceSchema);

 module.exports.UserModel=UserModel;

 module.exports.AssetModel=AssetModel;

 module.exports.ProjectModel=ProjectModel;

 module.exports.AssetAssemblyModel=AssetAssemblyModel;

 module.exports.RuleAttrInstanceModel=RuleAttrInstanceModel;

 module.exports.RuleAttrSpecModel=RuleAttrSpecModel;
 
 module.exports.RuleAttrSpecInstanceModel=RuleAttrSpecInstanceModel;


