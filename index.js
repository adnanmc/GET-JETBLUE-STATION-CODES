const siteUrl = "https://www.jetblue.com/destinations";
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

const getResults = async () => {
  const $ = await fetchData();
  const data = {};
  const checkForParentheses = RegExp(/\ \(/);
  $("a").each(function(index, element) {
    let innerText = $(this)
      .text()
      .trimLeft()
      .trimRight();
    if (checkForParentheses.test(innerText)) {
      let city = innerText.slice(0, innerText.indexOf(" ("));
      let airportCode = innerText.substring(
        innerText.indexOf("(") + 1,
        innerText.indexOf(")")
      );
      data[airportCode] = city;
    }
  });
  let finalData = JSON.stringify(data);
//   console.log(finalData);
  let fileName = "stationCodes.json"
  fs.writeFile(fileName, finalData, "utf8", err => {
    if (err) {
      console.log(err);
    } else {
        console.log(`File: ${fileName} has been saved.`);
        
    }
  });
};

getResults();
