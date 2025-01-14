const  express = require('express');
const  path = require('path');
const  cors = require('cors');

const router = express.Router()
const expressApp = express();
const bodyParser = require('body-parser');

function init() { 
    console.log("init")
    expressApp.use(bodyParser.urlencoded({ extended: false }));
    expressApp.use(bodyParser.json());
    expressApp.set('view engine', 'ejs')
    expressApp.use(cors());
    expressApp.use(express.json()); // For parsing JSON request bodies
    //expressApp.use('/Core', express.static(__dirname + '/Core'));
    expressApp.use(express.static(path.join(__dirname, 'public')))
    
}
init();
var port = 3560;
expressApp.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

