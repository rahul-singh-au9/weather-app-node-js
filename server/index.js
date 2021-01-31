const http = require("http");
const fs = require("fs");
var requests = require("requests");

const Home = fs.readFileSync("../client/index.html", "utf-8")

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempVal%}", orgVal.main.temp-273.15);
  temperature = temperature.replace("{%tempMin%}", orgVal.main.temp_min-273.15);
  temperature = temperature.replace("{%tempMax%}", orgVal.main.temp_max-273.15);
  temperature = temperature.replace("{%Location%}", orgVal.name);
  temperature = temperature.replace("{%Country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};


const server = http.createServer((req, res) => {
  if (req.url === "/"){

    requests("http://api.openweathermap.org/data/2.5/weather?q=lucknow&appid=f59cdc275dca49ff46db04846afc3d48")

    .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceVal(Home, val))
          .join("");
        res.write(realTimeData);
        // console.log(realTimeData);
      })

    .on("end", (err) => {
    if (err) return console.log("connection closed due to errors", err);
    res.end()
    });
  }else {
    res.end("File not found");
  }
});

server.listen(3001);