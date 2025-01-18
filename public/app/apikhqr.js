const baseApi = {
    apiUrl: "https://api-bakong.nbc.gov.kh",
    apiVersion: "/v1/"
};
const pathApi = {
    renewToken: "renew_token",
    generatDeeplink: "generate_deeplink_by_qr",
    checkTransactionStatusByMd5: "check_transaction_by_md5",
    checkBakongAccount: "check_bakong_account"
};
const MAX_RETRIES = 3; // Maximum retry attempts
var apiClient = null;
var bakongQR = null;
var khrSDK = null;
var loadingStatus = true;

var bakongAccountID = "";
var merchantName = "";
var merchantEmail = "";
var merchantCity = "";

function getSave(bakongAccountid) {
    const storedCiphertext = localStorage.getItem("dummpy_data");
    if (storedCiphertext) {
        const bytes = CryptoJS.AES.decrypt(storedCiphertext, bakongAccountid);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        const dummpyData = JSON.parse(decryptedString);
        return dummpyData;
    } else {
        console.error("No data found in localStorage.");
        return null;
    }
}

function save(bakongAccountid, apiToken, isChange) {
    const jsonObject = {
        isChange: isChange,
        apiToken: apiToken
    };
    const jsonString = JSON.stringify(jsonObject);
    const ciphertext = CryptoJS.AES.encrypt(jsonString, bakongAccountid).toString();
    localStorage.setItem("dummpy_data", ciphertext);
    return getSave(bakongAccountid);
}

function clearSave() {
    localStorage.removeItem("dummpy_data");
}
class Controller {
    async onSetAxios(axios, bakongar, khrdk, baseURL) {
        // Create an Axios instance
        apiClient = axios.create({
            baseURL: `${baseApi.apiUrl.replace(/\/+$/, '')}/${baseApi.apiVersion.replace(/^\/+/, '')}`,
        });
        bakongQR = bakongar;
        khrSDK = khrdk;
        // Interceptor setup
        apiClient.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                if (error.response && error.response.status === 401) {
                    console.log('401 error detected, attempting token refresh...');
                    const originalRequest = error.config; // Save the original request configuration
                    if (!originalRequest._retryCount) {
                        originalRequest._retryCount = 0; // Initialize retry counter
                    }

                    if (originalRequest._retryCount >= MAX_RETRIES) {
                        return Promise.reject(error); // Stop further retries
                    }
                    originalRequest._retryCount++;

                    try {
                        const token = await this.onRenewToken(merchantEmail);
                        if (token != "") {
                            save(bakongAccountID, token, true);
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return apiClient.request(originalRequest); // Retry the original request
                        } else {
                            //this.clearSave();
                            return Promise.reject(error);
                        }
                    } catch (refreshError) {
                        //this.clearSave();
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

    }
    async getQr(dataInfo) {
        const khrData = khrSDK.khqrData;
        const currency = khrData.currency.khr; //usd
        //var merchantType = khrData.merchantType.individual;//merchant
        const optionalData = dataInfo;
        optionalData.currency = dataInfo.currency == 'KHR' ? currency : khrData.currency.usa;
        const bakongQR = new window.khrSDK.BakongKHQR()
        const individualInfo = new khrSDK.IndividualInfo(
            bakongAccountID,//bakongAccountID
            merchantName,//merchantName
            merchantCity,//merchantCity?: string;);
            optionalData,
        );
        var dataIndividual = null;
        const generateIndividual = await bakongQR.generateIndividual(individualInfo)

        if (generateIndividual.status.code == 0) {
            dataIndividual = generateIndividual.data;
        }
        return dataIndividual;
    }
    async onCheckBakongAccount(accountId) {
        const checkBakongAccount = pathApi.checkBakongAccount;
        try {
            var data = await apiClient.post(checkBakongAccount, {
                accountId: accountId
            }, {
                headers: {
                    'Content-Type': 'application/json', // Setting header directly for this request
                    //'Authorization': 'Bearer ' + dummyData.apiToken
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
    async onRenewToken(email) {
        const renewToken = pathApi.renewToken;
        try {
            ///console.log(email);
            var data = await apiClient.post(renewToken, {
                email: email
            });
            //console.log(data);
            if (data.data.errorCode == null) {
                return data.data.data.token;
            } else {
                return "";
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return "";
        }
    }
    async onGnerateDeekplink(qr, sourceInfo) {
        const generatDeeplink = pathApi.generatDeeplink;
        try {
            //return { shortLink: "resData.data.data.shortLink", qr: "qr" };
            var resData = await apiClient.post(generatDeeplink, {
                qr: qr,
                sourceInfo
            });
            //console.log(resData);
            if (resData.data.errorCode == null) {
                return { shortLink: resData.data.data.shortLink, qr: qr };
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }
    async onCheckTransactionStatus(md5Token) {
        const checkBakongAccount = pathApi.checkTransactionStatusByMd5;
        try {
            if (md5Token.length <= 0) {
                return {
                    message: "Missing MD5.",
                    error: -1
                }
            }
            const dummyData = getSave(bakongAccountID);
            if (dummyData == null) {
                return {
                    message: "Missing Token.",
                    error: -1
                }
            }
            var data = await apiClient.post(checkBakongAccount, {
                md5: md5Token
            }, {
                headers: {
                    'Content-Type': 'application/json', // Setting header directly for this request
                    'Authorization': 'Bearer ' + dummyData.apiToken
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
        /* HTML: <div class="loader"></div> */
.loader {
  width: 50px;
  aspect-ratio: 1;
  display: grid;
  top: 50%;
left: 50%;
transform: translate(-50%, -50%);
width: 50px;
height: 50px0px;
position: fixed;
}
.loader::before,
.loader::after {    
  content:"";
  grid-area: 1/1;
  --c:no-repeat radial-gradient(farthest-side,#25b09b 92%,#0000);
  background: 
    var(--c) 50%  0, 
    var(--c) 50%  100%, 
    var(--c) 100% 50%, 
    var(--c) 0    50%;
  background-size: 12px 12px;
  animation: l12 1s infinite;
}
.loader::before {
  margin: 4px;
  filter: hue-rotate(45deg);
  background-size: 8px 8px;
  animation-timing-function: linear
}

@keyframes l12 { 
  100%{transform: rotate(.5turn)}
}
      `;
        document.head.appendChild(style);  // Append the style element to the head
    }
    // Function to create the centered view
    createAndCenterView() {
        // Create a new div element for the view
        this.loadingParent = document.createElement('div');
        this.loadingParent.style.cssText = 'text-align:center; position: absolute; height: 100%; background-color: rgba(0, 0, 0, 0.12); right: 0; bottom: 0; top: 0; left: 0;';

        this.bgQR = document.createElement('div');
        this.bgQR.style.cssText = 'text-align:center; position: absolute; height: 100%; background-color: rgba(0, 0, 0, 0.12); right: 0; bottom: 0; top: 0; left: 0;';

        this.newView = document.createElement('div');
        this.newView.style.visibility = 'hidden';
        this.newView.classList.add('view');
        // Create the image element
        const img = document.createElement('img');
        img.src = "image/khqr-bg.png";
        img.height = 500;
        // Append the image to the new div
        const hedder = document.createElement('div');
        hedder.id = "sender_name"
        hedder.style.cssText = 'position: absolute; margin-top: 93px; color: rgb(0, 0, 0); margin-left: 47px; font-size: 18px;';
        hedder.textContent = "";
        this.newView.appendChild(hedder);

        const amount = document.createElement('div');
        amount.style.cssText = 'position: absolute; margin-top: 119px; color: rgb(0, 0, 0); margin-left: 44px; font-size: 35px;';
        amount.innerHTML = '<span id="sender_amount"></span>' + '<span id="sender_currency" style="position: relative;top: -6px;font-size: 14px; color: #3d3d3d; margin-left: 10px;"></span>';
        //amount.id = "sender_amount";
        this.newView.appendChild(amount);

        const devQR = document.createElement('div');
        devQR.id = 'qrcode';
        devQR.height = 260;
        devQR.style.cssText = "height: 260px; left: 48px; position: absolute; width: 260px; top: 199px;";

        const imgQR = document.createElement('img');
        imgQR.src = "image/khqr.png";
        imgQR.style.cssText = "height: 260px; left: 48px; position: absolute; width: 260px; top: 199px;";

        this.newView.appendChild(devQR);
        this.newView.appendChild(img);

        const loading = document.createElement('div');
        loading.classList.add('loader');
        this.loadingParent.appendChild(loading);
        //<div class="loader"></div>
        // Append the new view to the body
        if (document.body != null) {
            document.body.appendChild(this.bgQR);
            document.body.appendChild(this.newView);
            document.body.appendChild(this.loadingParent);
            this.bgQR.style.visibility = 'hidden';
            this.newView.style.visibility = 'hidden';
            this.loadingParent.style.visibility = 'hidden';
            // Center the view
            this.centerView(this.newView);
        }
    }
    onStepLoading(status) {
        loadingStatus = status;
        if (status) {
            this.bgQR.style.visibility = 'hidden';
            this.newView.style.visibility = 'hidden';
            this.loadingParent.style.visibility = 'visible';
        } else {
            this.bgQR.style.visibility = 'visible';
            this.newView.style.visibility = 'visible';
            this.loadingParent.style.visibility = 'hidden';
        }
        this.autoCenter();
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
    autoCenter() {
        const view = document.querySelector('.view');
        if (view) {
            window.parent.centerView(view);
            if (loadingStatus) {
                view.style.visibility = 'hidden';
            } else {
                view.style.visibility = 'visible';
            }
        }
    }
    loadView() {
        window.onload = function () {
            const view = document.querySelector('.view');
            if (view) {
                window.parent.centerView(view);
                if (loadingStatus) {
                    view.style.visibility = 'hidden';
                } else {
                    view.style.visibility = 'visible';
                }
            }
        }

        // Re-center the view when the window is resized
        window.onresize = function () {
            const view = document.querySelector('.view');
            if (view) {

                window.parent.centerView(view);
                if (loadingStatus) {
                    view.style.visibility = 'hidden';
                } else {
                    view.style.visibility = 'visible';
                }
            }
        };// Re-center the view when the window is resized\  
    }
}
class ApiKhqrModule {
    constructor() {
        this.controller = new Controller();
        this.view = new View();

        document.addEventListener('DOMContentLoaded', () => {
            this.onSHowQr();
            this.view.loadView();

        });
    }
    async bakongObject() {
        return { BQR: bakongQR, SDK: khrSDK };
    }
    async setAxios(axios, bakongQR, khrSDK) {

        await this.controller.onSetAxios(axios, bakongQR, khrSDK);
    }
    onSHowQr() {
        this.view.addCSS();  // Add the CSS dynamically
        this.view.createAndCenterView();  // Create and center the view 
    }
    async generateDeeplink(dataInfo) {
        this.view.onStepLoading(true);
        const data = await this.checkBakongAccount(bakongAccountID, (data) => {
            if (data.error == null) {
                const dummyData = getSave(bakongAccountID);
                if (dummyData != null) {
                    if (dummyData.isChange == false) {
                        save(bakongAccountID, apiToken, false);
                    }
                } else {
                    save(bakongAccountID, apiToken, false);
                }
            }
        });
        if (data.error != null) {
            return;
        }
        const qrData = await this.controller.getQr(dataInfo);
        if (qrData != null) {
            const sourceInfo = new khrSDK.SourceInfo(
                "https://bakong.nbc.gov.kh/images/logo.svg",//appIconUrl: string optional
                "ShipGlow",//appName: string optional
                "https://shipglow.store/callback"//appDeepLinkCallback: string; optional
            );
            setTimeout(() => {
                this.view.onStepLoading(false);
            }, 1000)
            return this.controller.onGnerateDeekplink(qrData.qr, sourceInfo);
        } else {

        }
    }
    onRenewToken() {
        
    }
    async checkTransactionStatus(callback) {
        const res = await this.controller.onCheckTransactionStatus("b477258dd9c2dd51618046246c8306fa");
        if (res.error == null) {
            this.onPaymentStatus(res);
        }
        callback(res);
    }
    onPaymentStatus(data) {
        return data;
    }
    decode(qr) {
        const data = khrSDK.BakongKHQR.decode(qr);
        if (data.status.errorCode == null) {
            const items = data.data;
            const formatted = new Intl.NumberFormat(parseInt(items.transactionCurrency) == 116 ? 'km-KH' : 'en-US', {
                style: 'decimal', // Use 'decimal' instead of 'currency'
                minimumFractionDigits: 2, // Ensure two decimal places
                maximumFractionDigits: 2,
                currency: parseInt(items.transactionCurrency) == 116 ? 'KHR' : 'USD',
            }).format(items.transactionAmount);
            return {
                merchantName: items.merchantName,
                transactionAmount: formatted,
                transactionCurrency: items.transactionCurrency,
                currencySymbol: parseInt(items.transactionCurrency) == 116 ? 'KHR' : 'USD'
            }
        }
        return null;
    }
    async checkBakongAccount(account, callback) {
        const res = await this.controller.onCheckBakongAccount(account);
        callback(res);
        return res;
    }
    config(bakongAccountid,
        bakongAccountName,
        bakongAccountCity,
        apiToken,
        accountEmail) {
        bakongAccountID = bakongAccountid;
        merchantName = bakongAccountName;
        merchantCity = bakongAccountCity;
        merchantEmail = accountEmail;
    }
    async startGernerateKhqr(data){
        const res = await this.generateDeeplink(data);
        const senderInfo = this.decode(res.qr);
        document.getElementById("sender_name").textContent = senderInfo.merchantName;
        document.getElementById("sender_amount").textContent = senderInfo.transactionAmount;
        document.getElementById("sender_currency").textContent = senderInfo.currencySymbol;
        //After generate success will show qr
        new QRCode(document.getElementById("qrcode"),
            {
                text: res.qr,
                width: 260,                         // Width of the QR code
                height: 260,
                border: 30,                   // Height of the QR code
                colorDark: "#000000",              // Dark color of the QR
                colorLight: "#ffffff",
                type: 'terminal',        // Light background color
                correctLevel: QRCode.CorrectLevel.H // Error correction level
        });
    }
    onReady(){

    }
}
window.ApiKhqrModule = new ApiKhqrModule();