import Database from "better-sqlite3";

const db = new Database("app.db");

const all = db.prepare("SELECT * FROM users").all();

console.log(all);