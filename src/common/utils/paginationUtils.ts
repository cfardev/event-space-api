export const getPagingData = (
  totalItems: number,
  page: number,
  limit: number,
) => {
  const currentPage = page ? +page : 0;
  const totalPages = totalItems !== 0 ? Math.ceil(totalItems / limit) - 1 : 0;
  return { totalItems, totalPages, currentPage };
};

export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

export const getRawPagingData = (
  totalItems: number,
  page: number,
  limit: number,
) => {
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, totalPages, currentPage };
};
