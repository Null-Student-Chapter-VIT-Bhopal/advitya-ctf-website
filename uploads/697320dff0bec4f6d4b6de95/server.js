import express from "express";

const app = express();
app.use(express.json());

const FLAG = process.env.FLAG;
if (!FLAG) {
  console.error("FLAG not set");
  process.exit(1);
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    return res.json({ success: true, flag: FLAG });
  }

  return res.status(401).json({ success: false, message: "Invalid credentials" });
});

app.get("/", (req, res) => {
  res.send(`
    <h2>Admin Login</h2>
    <input id="u" placeholder="username"><br><br>
    <input id="p" placeholder="password" type="password"><br><br>
    <button onclick="login()">Login</button>
    <pre id="out"></pre>

    <script>
      async function login() {
        const r = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: u.value,
            password: p.value
          })
        });
        out.innerText = await r.text();
      }
    </script>
  `);
});

app.listen(80, () => console.log("CTF challenge running"));

