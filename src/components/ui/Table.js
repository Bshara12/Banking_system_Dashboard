import { useMemo, useState } from "react";
import "./Table.css";

export default function Table({
  columns = [],      // [{ key: 'id', label: 'ID', sortable: true }]
  data = [],         // array of row objects
  pageSize = 10,
  onRowClick = null,
  searchable = false,
}) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let rows = data;
    if (searchable && query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(r =>
        Object.values(r).some(v => String(v).toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      rows = [...rows].sort((a,b) => {
        const A = a[sortKey]; const B = b[sortKey];
        if (A == null) return 1;
        if (B == null) return -1;
        if (typeof A === "number") return sortDir === "asc" ? A - B : B - A;
        return sortDir === "asc"
          ? String(A).localeCompare(String(B))
          : String(B).localeCompare(String(A));
      });
    }
    return rows;
  }, [data, query, sortKey, sortDir, searchable]);

  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const pageData = filtered.slice((page-1)*pageSize, page*pageSize);

  function toggleSort(key) {
    if (sortKey === key) setSortDir(dir => dir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  return (
    <div className="ui-table-wrap">
      {searchable && (
        <div className="ui-table-search">
          <input placeholder="Search..." value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} />
        </div>
      )}

      <table className="ui-table" role="table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} onClick={() => col.sortable ? toggleSort(col.key) : null}
                  className={col.sortable ? 'sortable' : ''}>
                {col.label}
                {sortKey === col.key && <span className="sort-ind">{sortDir === 'asc' ? ' ▲' : ' ▼'}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.map((row, i) => (
            <tr key={i} onClick={() => onRowClick && onRowClick(row)} className={onRowClick ? 'clickable' : ''}>
              {columns.map(col => <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>)}
            </tr>
          ))}
          {pageData.length === 0 && (
            <tr><td colSpan={columns.length} className="empty">لا توجد بيانات</td></tr>
          )}
        </tbody>
      </table>

      <div className="ui-table-footer">
        <div>النتائج: {total}</div>
        <div className="ui-table-pager">
          <button onClick={() => setPage(1)} disabled={page===1}>«</button>
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>‹</button>
          <span>{page} / {lastPage}</span>
          <button onClick={() => setPage(p => Math.min(lastPage, p+1))} disabled={page===lastPage}>›</button>
          <button onClick={() => setPage(lastPage)} disabled={page===lastPage}>»</button>
        </div>
      </div>
    </div>
  );
}
