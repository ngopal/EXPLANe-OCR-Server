var express    =       require("express");
var multer     =       require('multer');
var path       =       require('path');
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

app.use(multer({ dest: 'data/files/tesseract-OCR-javascript/uploads/',
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
      res.sendfile("/www/index.html", {root: __dirname+'../../tesseract/'});
});

app.post('/api/photo',function(req,res){
  if(done==true){
    console.log("REQ", JSON.stringify(req.files.file.path));
    var file_path = req.files.file.path;
    console.log("Recieve OCR request, now running...");
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
         console.log("about to submit back to requester");
         res.jsonp({ rsid: uresults,
                     url:  uresults2 });
         console.log("submitted back to requester");
       }
    });
  }
});

app.listen(3000,function(){
    console.log("Working on port 3000");
});

function findURLs(content) {
    var URLreg = new RegExp("https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}");
    var url_matches = content.match(URLreg);
    var unique_url_matches = _.uniq(url_matches);
    return unique_url_matches;
}


function findRSIDs(content) {
    var re = /rs\d+/gi;
    var generalPattern = /r[\w]+\d+/gi;
    var result = content.toLowerCase().match(generalPattern);
    if (result === null) {
      return [];
    }
    var fixedrsname = result.map(function(r) {
        // if r5, change to rs
        if (r.match(/r[5]\d+/gi)) {
            console.log([r, "would be rs"]);
            return r.replace(/r5/gi, 'rs');
        }
        else { return r; }
    });
    var fixedoToZero = fixedrsname.map(function(r) {
        // if rs123o, change to rs1230
        if (r.match(/o/gi)) {
            console.log([r, "convert 0 to o"]);
            return r.replace(/o/gi, '0');
        }
        else { return r; }
    });
    var fixedzToTwo = fixedoToZero.map(function(r) {
        // if rs3z45, change to rs3245
        if (r.match(/z/gi)) {
            console.log([r, "convert z to 2"]);
            return r.replace(/z/gi, '2');
        }
        else { return r; }
    });
    var fixedeToZero = fixedzToTwo.map(function(r) {
        // if rs4e34, change to rs4034
        if (r.match(/e/gi)) {
            console.log([r, "convert e to 0"]);
            return r.replace(/e/i, '0');
        }
        else { return r; }
    });
    var fixedlToOne = fixedeToZero.map(function(r) {
        // if rsl893, change to rs1893
        if (r.match(/l/gi)) {
            console.log([r, "convert l to 1"]);
            return r.replace(/l/i, '1');
        }
        else { return r; }
    });
    var fixedrchar = fixedlToOne.map(function(r) {
        // if r349234, change to rs349234
        if (r.match(/r\d+/gi)) {
            console.log([r, "convert char preceding r to s"]);
            return r.replace(/r/i, 'rs');
        }
        else { return r; }
    });
    var omitExtraCharEntries = fixedrchar.map(function(r) {
        if (!r.match(/[^rs0-9]/gi)) {
            console.log([r, "matched an erroneous rsid, omitting"]);
            return r;
        }
    });
    var result_processed = omitExtraCharEntries;
    //var result_processed = fixedrchar;
    var uresults = _.uniq(result_processed);
    var uresults = _.compact(uresults);
    return uresults;
}
