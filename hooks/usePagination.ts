// hooks/usePagination.ts
import { useState, useCallback, useEffect } from 'react';

interface UsePaginationParams<T> {
  data: T[];
  initialPageSize?: number;
}

interface UsePaginationResult<T> {
  paginatedData: T[];
  page: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function usePagination<T>({
  data,
  initialPageSize = 10,
}: UsePaginationParams<T>): UsePaginationResult<T> {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  // Reset to page 1 if data changes significantly
  useEffect(() => {
    setPage(1);
  }, [data.length]);

  // Ensure page is within valid range
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  }, [page]);

  const goToPage = useCallback(
    (pageNumber: number) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setPage(pageNumber);
      }
    },
    [totalPages]
  );

  // Calculate the current page of data
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    paginatedData,
    page,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}