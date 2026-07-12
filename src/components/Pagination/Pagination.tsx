import type { ComponentType } from "react";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import css from "./Pagination.module.css";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

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
  const handlePageClick = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1);
  };

  return (
    // Загортаємо в додатковий div, щоб не ламати зовнішнє позиціонування тулбару,
    // якщо css.pagination раніше використовувався для цього.
    <div>
      <ReactPaginate
        pageCount={pageCount}
        onPageChange={handlePageClick}
        forcePage={currentPage - 1}
        // ЗВ'ЯЗУЄМО З ВАШИМИ ГОТОВИМИ СТИЛЯМИ:
        // Передаємо головний клас для тегу <ul>
        containerClassName={css.pagination}
        // Для елементів <li> бібліотека автоматично застосує вкладені правила з вашого .pagination li
        // Для активного елементу додаємо ваш клас .active
        activeClassName={css.active}
        // Залишаємо стандартні стрілочки
        previousLabel="<"
        nextLabel=">"
        breakLabel="..."
      />
    </div>
  );
}
