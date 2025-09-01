// server.js
import express from "express";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve index.html & assets

// simple auth endpoint that compares a posted password to process.env.PORTFOLIO_SECRET
app.post("/auth", (req, res) => {
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ ok: false, error: "no password provided" });

  const SECRET = process.env.PORTFOLIO_SECRET || "";
  if (!SECRET) {
    console.warn("PORTFOLIO_SECRET not set in environment.");
    return res.status(500).json({ ok: false, error: "server misconfigured" });
  }

  if (password === SECRET) return res.json({ ok: true });
  return res.status(401).json({ ok: false, error: "wrong password" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
