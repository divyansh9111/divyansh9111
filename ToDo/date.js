function getDate() {
  let today = new Date();
  let options = {
    //customising date formate
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  return today.toLocaleDateString("en-US", options);
  // console.log(day);
}
function getDay() {
  let today = new Date();
  let options = {
    //customising date formate
    weekday: "long",
  };
  return today.toLocaleDateString("en-US", options);
  // console.log(day);
}

module.exports={
    getDate:getDate,
    getDay:getDay
}
