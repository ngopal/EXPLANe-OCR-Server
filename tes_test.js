var tesseract  =       require('node-tesseract')
var _          =       require('lodash')

var processPicture = function(url) {
  tesseract.process(url, function(err, text) {
    if(err) {
      console.log(err);
    } else {
      console.log(text);
      return(text);
      //re=/rs\d+/gi;
      //result = text.toLowerCase().match(re);
      //uresults = _.uniq(result);
      //return(uresults);
    }
  });
}

//var out = 
processPicture('uploads/tesseract_sample41439775493788.jpg');
//console.log(out);

