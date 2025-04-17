const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

// ✅ Підтримка fetch для Node.js
if (!global.fetch) {
  global.fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
}

app.use(cors());

// 📡 Проксі-запит на API НБУ
app.get("/api/rates", async (req, res) => {
  try {
    const response = await fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ SERVER ERROR:", error.message);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Проксі-сервер працює на http://localhost:${PORT}`);
});
