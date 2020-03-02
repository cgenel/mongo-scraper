// create a variable to make a date
var makeDate = function() {
  var d = new Date();
  var formattedDate = "";

  // add month date and year
  formattedDate += (d.getMonth() + 1) + "_";
  fomattedDate += (d.getDate() + "_");
  formattedDate += d.getFullYear();

  return formattedDate;
};

// export makeDate
module.exports = makeDate;