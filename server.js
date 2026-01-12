const express = require("express");
const bodyParser = require('body-parser')

const port = 3000;

const app = express();

app.use(bodyParser.json());

const mockUsersData = [
    {
        username: "admin",
        password: "admin"
    },
    {
        username: "guest",
        password: "guest"
    }];

//login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = mockUsersData.find((u) => u.username === username && u.password === password);
    if (user) {
        res.status(200).json({ message: "Login successful" });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
});

app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`));
