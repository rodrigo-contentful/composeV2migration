exports.loggerCTF = function (msg) {
  const dateObject = new Date();
  // current date
  // adjust 0 before single digit date
  const date = `0 ${dateObject.getDate()}`.slice(-2);

  // current month
  const month = dateObject.getMonth() + 1;
  const twoDigitMonth = month < 10 ? "0" + month : month;

  // current year
  const year = dateObject.getFullYear();

  // current hours
  const hours = dateObject.getHours();

  // current minutes
  const minutes = dateObject.getMinutes();

  // current seconds
  const seconds = dateObject.getSeconds();

  const ct =
    year +
    "-" +
    twoDigitMonth +
    "-" +
    date +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;

  console.log("[%s] %s", ct, msg);
};

exports.config = function () {
  return {
    spaceID: "YOUR_SPACE_ID_HERE",
    envID: "YOUR_ENVIRONMENT_ID_HERE",
    accessToken: "YOUR_CMA_TOKEN_HERE",
  };
};
