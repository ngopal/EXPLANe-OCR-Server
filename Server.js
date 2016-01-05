var express    =       require("express");
var multer     =       require('multer');
var app        =       express();
var done       =       false;
var tesseract  =       require('node-tesseract');
var _          =       require('lodash');
var http       =       require('http');
var async      =       require('async');

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
    return filename+Date.now();
  },
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
  console.log(file.fieldname + ' uploaded to  ' + file.path)
  done=true;
}
}));

app.get('/',function(req,res){
      res.sendfile("index.html");
});

app.post('/api/photo',function(req,res){
  if(done==true){
    //console.log("REQUEST: " + JSON.stringify(req.files.file.path));
    //change URL below to the one above
    // var file_path = req.files.userPhoto.path;
    console.log("Recieve OCR request, now running...");
    var file_path = req.files.file.path;
    tesseract.process(file_path, function(err, text) {
       if(err) {
         res.send('ERR');
       } else {

         // Regular expression for RSID
         console.log("RSID regex step");
         var uresults = findRSIDs(text);

         //Regular expression for URL
         console.log("URL regex step");
         var uresults2 = findURLs(text);

         res.header("Access-Control-Allow-Origin", "*");
         res.header("Access-Control-Allow-Headers", "X-Requested-With");
         console.log("about to submit back to requester")
         res.jsonp({ rsid: uresults,
                     url:  uresults2 });
         console.log("submitted back to requester");
       }
    });
  }
});

var heroku_port = process.env.PORT;
app.listen(heroku_port,function(){
    console.log("Working on port "+heroku_port);
});

function findURLs(content) {
    var URLreg = new RegExp("https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}");
    var url_matches = content.match(URLreg);
    var unique_url_matches = _.uniq(url_matches);
    return unique_url_matches;
}

function findRSIDs(content) {
    var re = /rs\d+/gi;
    var result = content.toLowerCase().match(re);
    var uresults = _.uniq(result);
    return uresults;
}