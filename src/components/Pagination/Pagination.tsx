import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedPage: number) => void;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  return (
    <div className={css.pagination}>
      {/* Кнопка Назад */}
      <button
        className={css.button}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        {"<"}
      </button>

      {/* Поточна сторінка із загальної кількості */}
      <span className={css.info}>
        Page {currentPage} of {pageCount}
      </span>

      {/* Кнопка Вперед */}
      <button
        className={css.button}
        disabled={currentPage === pageCount}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {">"}
      </button>
    </div>
  );
}
