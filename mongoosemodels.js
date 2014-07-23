var mongoose=require('mongoose');

var ObjectId = require('mongoose').Types.ObjectId; 

var Schema=mongoose.Schema;


var UserSchema= new Schema({
    _id: Number,
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

var ProjectSchema=new Schema({
      _id:Number,
       userid: Number,
      projectTitle: String,
      description:String,
      bannerAsset: Number,
      assetAssemblies:[{assetAssemblyId:Number,visible:Boolean}],
      styles: Schema.Types.ObjectId,

});

var AssetAssemblySchema=new Schema({
       _id: Number,
        assetAssemblyDescription: String,
        location:[],
        icon: Number,
        layarImageUrl: String,
        imageAsset:Number,
        assets:[{assetid:Number,index:Number}],
        textElements:[{
          languageCode: String,
          title: String,
          subtitle: String,
          summary1: String,
          summary2: String,
          summary3: String,
          summary4: String
        }]

});

AssetAssemblySchema.index({ loc: '2d' });



var AssetSchema=new Schema({
    _id:Number,
    assetDescription: String,
    assetTypeId:Number,
    assetSubtypeId:Number,
    rating:Number,
    version: Number,
    posterAsset: Number,
    userid: Number,
    captions:[{languageCode:String,caption:String}],
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

var UserModel=mongoose.model('UserModel',UserSchema);

var AssetModel=mongoose.model('AssetModel',AssetSchema);

var ProjectModel=mongoose.model('ProjectModel',ProjectSchema);

var AssetAssemblyModel=mongoose.model('AssetAssemblyModel',AssetAssemblySchema);

 module.exports.UserModel=UserModel;

 module.exports.AssetModel=AssetModel;

 module.exports.ProjectModel=ProjectModel;

 module.exports.AssetAssemblyModel=AssetAssemblyModel;