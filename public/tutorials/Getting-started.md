# How to use ApiKhqrModule

Welcome to the tutorial! This guide will walk you through the basics of using our library.

## Step 1: Add apikhqr.js header
```html
<head>
    <script src="./app/dist/bundle.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.2.1/axios.min.js"></script>
</head>
```

## Step 2: Create instance from ApiKhqrModule
```html
<script>
    $(document).ready(function () {
        ///Configuration
        window.ApiKhqrModule.setAxios(axios, new window.khrsdk.BakongKHQR(), khrsdk,);
        var apiToken = "00020101021229200016kuch_darith@aclb5204599953031165405100005802KH5911Kuch Darith6010Phnom Penh62390211855987918020308ShipGlow0708ShipGlow99170013173696631665363046152";
        var bakongAccountId = "kuch_darith@aclb"; //requred
        var acountName = "kuch darith"; //requird
        var accountCity = "Phnom Penh"; //required
        var accountEmail = "darithkuch@outlook.com"; //required
        window.ApiKhqrModule.config(bakongAccountId, acountName, accountCity, apiToken, accountEmail);
        //Listen payment status
        window.ApiKhqrModule.onPaymentStatus = (data) => {
            alert(data.message);
        }
        $('#btnCheckAccount').click(function () {
            generateDeeplinik();
        });
        $('#btnCheckTransaction').click(function () {
            window.ApiKhqrModule.checkTransactionStatus((data) => {
                console.log(data);
            });
        });
        function generateDeeplinik() {
            (async () => {
                const data = {
                    mobileNumber: "85598791802",//optional
                    storeLabel: "ShipGlow",//optional
                    amount: 1000, //requred
                    terminalLabel: "ShipGlow", //optional
                    currency: "KHR" //required
                };
                await window.ApiKhqrModule.startGernerateKhqr(data);
            })();
        }
    });
</script>
```
