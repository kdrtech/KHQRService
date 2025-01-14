const baseApi = {
    apiUrl: "https://api-bakong.nbc.gov.kh",
    apiVersion: "/v1/"
};
const account = {
    account: "kuch_darith@aclb",
    token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiYWZhNzI1M2ZkOGJmNGE4ZiJ9LCJpYXQiOjE3MzY4NzQ2MzUsImV4cCI6MTc0NDY1MDYzNX0.gW4DUAexcHZ"
};
const pathApi = {
    renewToken: "renew_token",
    generatDeeplink: "generate_deeplink_by_qr",
    checkTransactionStatusByMd5: "check_transaction_by_md5",
    checkBakongAccount: "check_bakong_account"
};
function getError(status){
   try{
    var data = status.data;
    if(data.errorCode == 140){
        
    }
   }catch(err){

   }
}
export default {
    baseApi,
    pathApi
}