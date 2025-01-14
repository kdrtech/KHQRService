
import controller from './controller.js';
import view from './view.js';


const ApiKhqrModule = {
    setAxios: async function (axios) {
        this.onSHowQr();
        await controller.onSetAxios(axios);
    },
    onSHowQr: function () {
        view.addCSS();  // Add the CSS dynamically
        view.createAndCenterView();  // Create and center the view 
    },
    generateDeeplink: function (callback) {
        controller.onGnerateDeekplink(callback);

    },
    onRenewToken: function () {
        controller.onGnerateDeekplink(callback);
    },
    checkTransactionStatus: async function (account, callback) {
       const res = await  controller.onCheckBakongAccount(account);
       callback(res);
    }
}
export default ApiKhqrModule;