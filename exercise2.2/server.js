const http = require("http"),
  url = require("url"),
  fs = require("fs");

http
  .createServer((req, res) => {
    let addr = req.url;
    let q = url.parse(addr, true);
    let pathName = "";

    if (q.pathname.includes("documentation")) {
      pathName = __dirname + "/documentation.html";
    } else {
      pathName = "index.html";
    }

    fs.appendFile(
      "log.txt",
      `URL: ${addr}
    Timestamp: ${new Date()}
    
    `,
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Added to log");
        }
      }
    );

    fs.readFile(pathName, (err, data) => {
      if (err) {
        throw err;
      } else {
        res.writeHead(200, { "Content-type": "text/html" });
        res.write(data);
        res.end();
      }
    });
  })
  .listen(8080, "localhost");
