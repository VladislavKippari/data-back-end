var configValues=require('./config');
module.exports={
    getDbConnectionString:function(){
        return 'postgres://'+configValues.uname+':'+configValues.pwd+'@dev.vk.edu.ee:5432/db_Kippari';
    }
}
//  'postgres://{db_username}:{db_password}@{host}:{port}/{db_name}'