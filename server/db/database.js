import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'pke.db');
let db;

export async function getDb() {
    if (db) return db;
    const SQL = await initSqlJs();
    if (existsSync(DB_PATH)) {
        const buffer = readFileSync(DB_PATH);
        db = new SQL.Database(buffer);
    } else {
        db = new SQL.Database();
    }
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    db.exec(schema);
    saveDb();
    return db;
}

export function saveDb() {
    if (!db) return;
    const data = db.export();
    const buffer = Buffer.from(data);
    writeFileSync(DB_PATH, buffer);
}

export function run(sql, params = []) {
    db.run(sql, params);
    const changes = db.getRowsModified();
    const res = db.exec("SELECT last_insert_rowid() as id");
    const lastInsertRowid = res.length > 0 && res[0].values.length > 0 ? res[0].values[0][0] : null;
    saveDb();
    return { changes, lastInsertRowid };
}

export function get(sql, params = []) {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    if (stmt.step()) {
        const cols = stmt.getColumnNames();
        const vals = stmt.get();
        stmt.free();
        const row = {};
        cols.forEach((c, i) => row[c] = vals[i]);
        return row;
    }
    stmt.free();
    return null;
}

export function all(sql, params = []) {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    const cols = stmt.getColumnNames();
    while (stmt.step()) {
        const vals = stmt.get();
        const row = {};
        cols.forEach((c, i) => row[c] = vals[i]);
        rows.push(row);
    }
    stmt.free();
    return rows;
}
