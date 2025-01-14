
//import controller from 'https://cdn.jsdelivr.net/gh/kdrtech/KHQRService@latest/public/app/controller.js';
//import view from 'https://cdn.jsdelivr.net/gh/kdrtech/KHQRService@latest/public/app/view.js';
const baseApi = {
    apiUrl: "https://api-bakong.nbc.gov.kh",
    apiVersion: "/v1/"
};
const account = {
    account: "kuch_darith@aclb",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiYWZhNzI1M2ZkOGJmNGE4ZiJ9LCJpYXQiOjE3MzY4NzQ2MzUsImV4cCI6MTc0NDY1MDYzNX0.gW4DUAexcHZ"
};
const pathApi = {
    renewToken: "renew_token",
    generatDeeplink: "generate_deeplink_by_qr",
    checkTransactionStatusByMd5: "check_transaction_by_md5",
    checkBakongAccount: "check_bakong_account"
};

class Controller {
    async onSetAxios(obj) {
        apiClient = obj;
        //await this.onRenewToken();
    }
    async onCheckBakongAccount(accountId) {
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
    }
    async onRenewToken() {
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
    }
    onGnerateDeekplink(callback) {
        if (callback != null) {
            callback("callback");
        }
    }
}
class View {
    constructor() {
        window.parent = this;
    }
    // Add CSS styles dynamically to the document head
    addCSS() {
        const style = document.createElement('style');
        style.innerHTML = `
        .view {
          background-color: #ffffff;
          color: white;
          text-align: center;
          padding: 0px;
          border-radius: 8px;
          font-size: 20px;
          position: absolute;
          transition: all 0.3s ease;
        }
      `;
        document.head.appendChild(style);  // Append the style element to the head
    }
    // Function to create the centered view
    createAndCenterView() {
        // Create a new div element for the view
        const newView = document.createElement('div');
        newView.style.visibility = 'hidden';
        newView.classList.add('view');
        // Create the image element
        const img = document.createElement('img');
        img.src = "image/khqr-bg.png";
        img.height = 500;
        // Append the image to the new div
        const hedder = document.createElement('div');
        hedder.style.cssText = 'position: absolute; margin-top: 93px; color: rgb(0, 0, 0); margin-left: 47px; font-size: 18px;';
        hedder.textContent = "Kuch Darith";
        newView.appendChild(hedder);

        const amount = document.createElement('div');
        amount.style.cssText = 'position: absolute; margin-top: 119px; color: rgb(0, 0, 0); margin-left: 44px; font-size: 35px;';
        amount.innerHTML = "10000,000" + '<span style="font-size: 24px; margin-left: 10px;">$</span>';

        newView.appendChild(amount);

        const imgQR = document.createElement('img');
        imgQR.src = "image/khqr.png";
        imgQR.style.cssText = "height: 260px; left: 48px; position: absolute; width: 260px; top: 199px;";

        newView.appendChild(imgQR);
        newView.appendChild(img);

        // Append the new view to the body
        if (document.body != null) {
            document.body.appendChild(newView);

            // Center the view
            this.centerView(newView);
        }
    }

    // Function to center the view
    centerView(viewElement) {
        const viewWidth = viewElement.offsetWidth;
        const viewHeight = viewElement.offsetHeight;

        // Get the viewport width and height
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Calculate the position to center the view
        const left = (windowWidth - viewWidth) / 2;
        const top = (windowHeight - viewHeight) / 2;

        // Set the position of the view
        viewElement.style.left = `${left}px`;
        viewElement.style.top = `${top}px`;
    }
    loadView() {
        window.onload = function () {
            const view = document.querySelector('.view');
            if (view) {
                view.style.visibility = 'visible';
                window.parent.centerView(view);
            }

        }

        // Re-center the view when the window is resized
        window.onresize = function () {
            const view = document.querySelector('.view');
            if (view) {
                window.parent.centerView(view);
            }
        };// Re-center the view when the window is resized\  
    }
}
class ApiKhqrModule {
    constructor() {
        this.controller = new Controller();
        this.view = new View();

        document.addEventListener('DOMContentLoaded', () => {
            this.view.loadView();
            this.onSHowQr();
        });
    }
    async setAxios(axios) {

        await controller.onSetAxios(axios);
    }
    onSHowQr() {
        this.view.addCSS();  // Add the CSS dynamically
        this.view.createAndCenterView();  // Create and center the view 
    }
    generateDeeplink(callback) {
        controller.onGnerateDeekplink(callback);

    }
    onRenewToken() {
        controller.onGnerateDeekplink(callback);
    }
    async checkTransactionStatus(account, callback) {
        const res = await controller.onCheckBakongAccount(account);
        callback(res);
    }
}
window.ApiKhqrModule = ApiKhqrModule;