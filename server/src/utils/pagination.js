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

module.exports = { parsePagination, paged };
