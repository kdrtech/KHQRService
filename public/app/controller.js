
import apikhqr from './apikhrApi.js';

var apiClient = null;
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiYWZhNzI1M2ZkOGJmNGE4ZiJ9LCJpYXQiOjE3MzY4NzQ2MzUsImV4cCI6MTc0NDY1MDYzNX0.gW4DUAexcHZ";
const ControllerModule = {
    onSetAxios: async function (obj) {
        apiClient = obj;
        //await this.onRenewToken();
    },
    onCheckBakongAccount: async function (accountId) {
        const checkBakongAccount = apikhqr.baseApi.apiUrl + apikhqr.baseApi.apiVersion + apikhqr.pathApi.checkBakongAccount;
        try {
            console.log(accountId);
            var data = await apiClient.post(checkBakongAccount, {
                accountId: accountId
            }, {
                headers: {
                    'Content-Type': 'application/json', // Setting header directly for this request
                    'Authorization': 'Bearer ' + token
                }
            });

            if (data.data.errorCode == null) {
                return {
                    message: data.data.responseMessage,
                    error: data.data.errorCode
                }
            } else {
                return {
                    message: data.data.responseMessage,
                    error: data.data.errorCode
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
    onRenewToken: async function () {
        const renewToken = apikhqr.baseApi.apiUrl + apikhqr.baseApi.apiVersion + apikhqr.pathApi.renewToken;
        try {
            var data = await apiClient.post(renewToken, {
                email: 'darithkuch@outlook.com'
            });
            if (data.data.errorCode == null) {
                return data.data.token;
            } else {
                return "";
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
    onGnerateDeekplink: function (callback) {
        if (callback != null) {
            callback("callback");
        }
    },
}

export default ControllerModule;