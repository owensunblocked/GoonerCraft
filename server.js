const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

const SITES_DIR = path.join(__dirname, "sites");
if (!fs.existsSync(SITES_DIR)) {
  fs.mkdirSync(SITES_DIR);
}

// Publish site
app.post("/publish", (req, res) => {
  const { name, html } = req.body;

  if (!name || !html) {
    return res.status(400).send("Missing data");
  }

  const filePath = path.join(SITES_DIR, name + ".html");
  fs.writeFileSync(filePath, html);

  res.send({
    success: true,
    url: `http://localhost:${PORT}/${name}`
  });
});

// View site
app.get("/:site", (req, res) => {
  const filePath = path.join(SITES_DIR, req.params.site + ".html");

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("Site not found");
  }
});

app.listen(PORT, () => {
  console.log("🚀 Server running at http://localhost:" + PORT);
});
