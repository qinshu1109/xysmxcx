function parsePagination(query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const rawPageSize = parseInt(query.pageSize, 10) || 10;
  const pageSize = Math.min(Math.max(rawPageSize, 1), 100);
  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize
  };
}

function paged(items, total, page, pageSize) {
  return { items, total, page, pageSize };
}

function buildLimitOffset(pageSize, offset) {
  const safePageSize = Math.min(Math.max(parseInt(pageSize, 10) || 10, 1), 100);
  const safeOffset = Math.max(parseInt(offset, 10) || 0, 0);
  return `LIMIT ${safePageSize} OFFSET ${safeOffset}`;
}

module.exports = { parsePagination, paged, buildLimitOffset };
