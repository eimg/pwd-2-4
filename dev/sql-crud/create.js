import Database from "better-sqlite3";

const db = new Database("app.db");

db.prepare("INSERT INTO users (name, age) VALUES (?, ?)").run(['Eve', '22']);

db.close();
