var configValues=require('./config');
module.exports={
    getDbConnectionString:function(){
        return 'postgres://'+configValues.uname+':'+configValues.pwd+'@:/';
    }
}
//  'postgres://{db_username}:{db_password}@{host}:{port}/{db_name}'