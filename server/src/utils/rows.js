function boolFields(row, fields) {
  const next = { ...row };
  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(next, field)) {
      next[field] = Boolean(next[field]);
    }
  }
  return next;
}

function boolRows(rows, fields) {
  return rows.map((row) => boolFields(row, fields));
}

function splitImages(value) {
  if (!value) return [];
  return String(value).split(',').filter(Boolean);
}

module.exports = { boolFields, boolRows, splitImages };
