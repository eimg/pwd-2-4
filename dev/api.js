import express from "express";

const app = express();

app.get("/users", function(req, res) {
    res.json({ name: "Eve", age: 23 });
});

app.listen(4000, function() {
    console.log("API running at 4000...");
});
