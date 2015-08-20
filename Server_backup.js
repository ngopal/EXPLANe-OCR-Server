var express    =       require("express");
var multer     =       require('multer');
var app        =       express();
var done       =       false;
var tesseract  =       require('node-tesseract')
var _          =       require('lodash')

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
    var file_path = req.files.userPhoto.path;
    tesseract.process(file_path, function(err, text) {
       if(err) {
         res.send('ERR');
       } else {
         res.send(text);
       }
    });
  }
});

app.listen(3000,function(){
    console.log("Working on port 3000");
});
