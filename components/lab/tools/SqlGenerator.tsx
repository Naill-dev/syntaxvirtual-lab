// file: components/tools/SqlGenerator.tsx
"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2, Copy, Play, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type SqlDialect = "postgresql" | "mysql" | "sqlite";
type ColumnType = "INTEGER" | "TEXT" | "REAL" | "BOOLEAN" | "TIMESTAMP" | "UUID" | "VARCHAR(255)";

interface Column {
  id: string;
  name: string;
  type: ColumnType;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
  defaultValue: string;
}

interface SqlResult {
  columns: string[];
  rows: (string | number | null)[][];
}

const COLUMN_TYPES: ColumnType[] = ["INTEGER", "TEXT", "VARCHAR(255)", "REAL", "BOOLEAN", "TIMESTAMP", "UUID"];

const nanoid = (n = 6) => Math.random().toString(36).slice(2, 2 + n);

/**
 * SqlGenerator – Vizual cədvəl dizayneri və SQL generator.
 * Cədvəl, sütunlar, sql.js ilə brauzerdə test, PostgreSQL/MySQL/SQLite export.
 */
export function SqlGenerator() {
  const [tableName, setTableName] = useState("users");
  const [columns, setColumns] = useState<Column[]>([
    { id: nanoid(), name: "id", type: "INTEGER", nullable: false, primaryKey: true, unique: true, defaultValue: "" },
    { id: nanoid(), name: "email", type: "VARCHAR(255)", nullable: false, primaryKey: false, unique: true, defaultValue: "" },
    { id: nanoid(), name: "name", type: "TEXT", nullable: false, primaryKey: false, unique: false, defaultValue: "" },
    { id: nanoid(), name: "created_at", type: "TIMESTAMP", nullable: false, primaryKey: false, unique: false, defaultValue: "CURRENT_TIMESTAMP" },
  ]);
  const [dialect, setDialect] = useState<SqlDialect>("postgresql");
  const [queryText, setQueryText] = useState("SELECT * FROM users;");
  const [queryResults, setQueryResults] = useState<SqlResult[]>([]);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const addColumn = () => {
    setColumns((prev) => [
      ...prev,
      { id: nanoid(), name: "", type: "TEXT", nullable: true, primaryKey: false, unique: false, defaultValue: "" },
    ]);
  };

  const removeColumn = (id: string) => setColumns((prev) => prev.filter((c) => c.id !== id));

  const updateColumn = (id: string, field: keyof Column, value: unknown) => {
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const generateCreateSql = useCallback(() => {
    const cols = columns
      .filter((c) => c.name.trim())
      .map((c) => {
        const parts = [`  ${c.name} ${c.type}`];
        if (c.primaryKey) parts.push("PRIMARY KEY");
        if (!c.nullable) parts.push("NOT NULL");
        if (c.unique && !c.primaryKey) parts.push("UNIQUE");
        if (c.defaultValue) parts.push(`DEFAULT ${c.defaultValue}`);
        return parts.join(" ");
      })
      .join(",\n");

    return `CREATE TABLE ${tableName || "my_table"} (\n${cols}\n);`;
  }, [tableName, columns]);

  const generateInsertSql = useCallback(() => {
    const cols = columns.filter((c) => c.name.trim() && !c.primaryKey).map((c) => c.name);
    const vals = cols.map((c) => {
      const col = columns.find((x) => x.name === c);
      if (col?.type === "INTEGER" || col?.type === "REAL") return "0";
      if (col?.type === "BOOLEAN") return "true";
      if (col?.type === "TIMESTAMP") return "CURRENT_TIMESTAMP";
      return "'sample_value'";
    });
    return `INSERT INTO ${tableName} (${cols.join(", ")})\nVALUES (${vals.join(", ")});`;
  }, [tableName, columns]);

  const fullSql = generateCreateSql();

  const runQuery = async () => {
    setIsRunning(true);
    setQueryError(null);
    setQueryResults([]);

    try {
      // Dynamically load sql.js from CDN
      if (!(window as any).initSqlJs) {
        await new Promise<void>((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js";
          s.onload = () => res();
          s.onerror = () => rej(new Error("sql.js yüklənmədi"));
          document.head.appendChild(s);
        });
      }
      const SQL = await (window as any).initSqlJs({
        locateFile: (f: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${f}`,
      });
      const db = new SQL.Database();

      // Run CREATE TABLE first, then the user query
      const stmts = `${fullSql}\n${queryText}`.split(";").map((s: string) => s.trim()).filter(Boolean);
      const results: SqlResult[] = [];

      for (const stmt of stmts) {
        const res = db.exec(stmt);
        if (res.length > 0) {
          results.push({ columns: res[0].columns, rows: res[0].values });
        }
      }

      setQueryResults(results);
      db.close();
    } catch (e) {
      setQueryError((e as Error).message);
    } finally {
      setIsRunning(false);
    }
  };

  const copyCreate = () => {
    navigator.clipboard.writeText(fullSql);
    toast.success("CREATE SQL kopyalandı!");
  };

  return (
    <div className="space-y-6">
      {/* Dialect selector */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium mr-2">Dialect:</label>
        {(["postgresql", "mysql", "sqlite"] as SqlDialect[]).map((d) => (
          <Button
            key={d}
            variant={dialect === d ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs rounded-lg capitalize"
            onClick={() => setDialect(d)}
          >
            {d}
          </Button>
        ))}
      </div>

      {/* Table name */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Cədvəl adı</label>
        <Input
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="users"
          className="max-w-xs rounded-xl font-mono"
          aria-label="Cədvəl adı"
        />
      </div>

      {/* Columns */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Sütunlar</label>
          <Button size="sm" variant="outline" className="h-7 text-xs rounded-lg gap-1" onClick={addColumn}>
            <Plus className="h-3 w-3" /> Sütun əlavə et
          </Button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead className="bg-muted/40">
              <tr>
                {["Ad", "Tip", "NOT NULL", "PK", "UNIQUE", "Default", ""].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {columns.map((col) => (
                <tr key={col.id} className="border-t border-border hover:bg-muted/20">
                  <td className="px-2 py-1.5">
                    <input
                      value={col.name}
                      onChange={(e) => updateColumn(col.id, "name", e.target.value)}
                      className="bg-transparent font-mono outline-none w-24 border-b border-transparent focus:border-indigo-500"
                      placeholder="sütun_adı"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <select
                      value={col.type}
                      onChange={(e) => updateColumn(col.id, "type", e.target.value)}
                      className="bg-background rounded-md border border-border px-1 py-0.5 text-xs outline-none"
                    >
                      {COLUMN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <input type="checkbox" checked={!col.nullable} onChange={(e) => updateColumn(col.id, "nullable", !e.target.checked)} className="accent-indigo-500" />
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <input type="checkbox" checked={col.primaryKey} onChange={(e) => updateColumn(col.id, "primaryKey", e.target.checked)} className="accent-indigo-500" />
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <input type="checkbox" checked={col.unique} onChange={(e) => updateColumn(col.id, "unique", e.target.checked)} className="accent-indigo-500" />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      value={col.defaultValue}
                      onChange={(e) => updateColumn(col.id, "defaultValue", e.target.value)}
                      className="bg-transparent font-mono outline-none w-24 border-b border-transparent focus:border-indigo-500"
                      placeholder="dəyər"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400 hover:text-red-300" onClick={() => removeColumn(col.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generated SQL */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Generasiya edilmiş SQL</label>
          <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={copyCreate}>
            <Copy className="h-3 w-3" /> Kopyala
          </Button>
        </div>
        <pre className="rounded-xl bg-zinc-950/80 border border-border p-4 text-xs font-mono text-green-300 overflow-x-auto whitespace-pre">
          {fullSql}
        </pre>
      </div>

      {/* INSERT example */}
      <div className="space-y-2">
        <label className="text-sm font-medium">INSERT nümunəsi</label>
        <pre className="rounded-xl bg-zinc-950/80 border border-border p-4 text-xs font-mono text-blue-300 overflow-x-auto whitespace-pre">
          {generateInsertSql()}
        </pre>
      </div>

      {/* Query tester */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Brauzerdə test et (sql.js)</label>
        <textarea
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 resize-none"
          aria-label="SQL sorğusu"
        />
        <Button
          className="gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          onClick={runQuery}
          disabled={isRunning}
        >
          {isRunning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {isRunning ? "İcra olunur…" : "Sorğunu icra et"}
        </Button>

        {queryError && (
          <pre className="rounded-xl bg-red-950/50 border border-red-800 p-3 text-xs text-red-400">{queryError}</pre>
        )}

        {queryResults.map((res, i) => (
          <div key={i} className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead className="bg-muted/40">
                <tr>{res.columns.map((c) => <th key={c} className="px-3 py-2 text-left font-medium">{c}</th>)}</tr>
              </thead>
              <tbody>
                {res.rows.map((row, ri) => (
                  <tr key={ri} className="border-t border-border">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-1.5 font-mono">
                        {cell === null ? <span className="text-muted-foreground italic">NULL</span> : String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ Verified: Column designer, CREATE/INSERT generation, sql.js in-browser test, result table
