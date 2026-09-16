/**
 * 簡易本機靜態伺服器（零外部套件依賴）
 * 執行指令：node serve.js
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const server = http.createServer((req, res) => {
  if (req.url === "/favicon.ico") {
    res.writeHead(204);
    res.end();
    return;
  }

  let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url.split("?")[0]);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("404 找不到檔案");
      } else {
        res.writeHead(500);
        res.end(`伺服器錯誤: ${err.code}`);
      }
    } else {
      res.writeHead(200, {
        "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
        "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
        "Access-Control-Allow-Origin": "*"
      });
      res.end(content);
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`=========================================`);
  console.log(`陽明里 2D 遊戲本機伺服器已啟動！`);
  console.log(`請在瀏覽器開啟: http://localhost:${PORT}`);
  console.log(`或使用區域網路 IP: http://127.0.0.1:${PORT}`);
  console.log(`=========================================`);
});
