import ApiKhqrModule from './app/apikhqr.js';

await ApiKhqrModule.setAxios(axios);
await ApiKhqrModule.checkTransactionStatus("kuch_darith@aclb",(data)=>{
    console.log(data);
});
ApiKhqrModule.generateDeeplink((status)=>{
    
});
