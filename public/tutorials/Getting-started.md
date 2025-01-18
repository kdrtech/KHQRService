# How to use ApiKhqrModule

Welcome to the tutorial! This guide will walk you through the basics of using our library.

## Step 1: Add apikhqr.js header
```html
<head>
    <script src="./app/dist/khqr-sdk.js"></script>
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
        var apiToken = "000201010212292000162***********";
        var bakongAccountId = "************@aclb"; //requred
        var acountName = "kuch darith"; //requird
        var accountCity = "Phnom Penh"; //required
        var accountEmail = "************@gmail.com"; //required
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
                    mobileNumber: "**********",//optional
                    storeLabel: "ShipGlow",//optional
                    amount: 10, //requred
                    terminalLabel: "ShipGlow", //optional
                    currency: "KHR" //required
                };
                await window.ApiKhqrModule.startGernerateKhqr(data);
            })();
        }
    });
</script>
```
