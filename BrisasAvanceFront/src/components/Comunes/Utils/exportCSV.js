export const exportCSV = (filename, rows, excludeKeys = []) => {
  if (!rows || rows.length === 0) return;

  const defaultExcludes = ["password", "resetCode", "resetCodeExpire", "roles", "__v"];
  const excludes = [...new Set([...defaultExcludes, ...excludeKeys])];

  const filteredRows = rows.map(row => {
    const filtered = {};
    for (const key in row) {
      if (!excludes.includes(key)) {
        filtered[key] = row[key];
      }
    }
    return filtered;
  });

  const keys = Object.keys(filteredRows[0]);
  const csv = [
    keys.join(","),
    ...filteredRows.map(r =>
      keys.map(k => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(",")
    )
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
