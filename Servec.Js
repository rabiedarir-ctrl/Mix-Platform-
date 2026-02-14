const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const dataPath = path.join(__dirname, "data", "chairs.json");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ====== قراءة البيانات ======
function readChairs() {
  try {
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// ====== كتابة البيانات ======
function writeChairs(chairs) {
  fs.writeFileSync(dataPath, JSON.stringify(chairs, null, 2));
}

// ====== API ======

app.get("/api/health", (req, res) => {
  res.json({ status: "Mix Backend Running" });
});

app.get("/api/chairs", (req, res) => {
  res.json(readChairs());
});

app.post("/api/chairs", (req, res) => {
  const chairs = readChairs();

  const newChair = {
    id: chairs.length > 0 ? chairs[chairs.length - 1].id + 1 : 1,
    name: req.body.name,
    color: req.body.color,
    price: req.body.price
  };

  chairs.push(newChair);
  writeChairs(chairs);

  res.status(201).json(newChair);
});

app.delete("/api/chairs/:id", (req, res) => {
  let chairs = readChairs();
  chairs = chairs.filter(c => c.id !== parseInt(req.params.id));
  writeChairs(chairs);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`🚀 Mix running on http://localhost:${PORT}`);
});
