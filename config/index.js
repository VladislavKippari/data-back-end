var configValues=require('./config');
module.exports={
    getDbConnectionString:function(){
        return 'postgres://'+configValues.uname+':'+configValues.pwd+'@dev.vk.edu.ee:5432/dbhitsa2019';
    }
}
//  'postgres://{db_username}:{db_password}@{host}:{port}/{db_name}'