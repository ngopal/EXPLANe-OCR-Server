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
         var re = /rs\d+/gi;
         var result = text.toLowerCase().match(re);
         var uresults = _.uniq(result);
         res.header("Access-Control-Allow-Origin", "*");
         res.header("Access-Control-Allow-Headers", "X-Requested-With");
         console.log("about to submit back to requester")
         res.jsonp(uresults);
         console.log("submitted back to requester");
       }
    });
  }
});


app.listen(8080,function(){
    console.log("Working on port 3000");
});
