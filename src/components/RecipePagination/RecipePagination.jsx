import clsx from "clsx";
import style from "./RecipePagination.module.css";

// У макеті інстанс пагінації показує три номери (144x40 при елементі 40px).
const VISIBLE_PAGES = 3;

// Вікно номерів навколо поточної сторінки: при 143 сторінках показувати всі
// немає сенсу, тому тримаємо поточну по центру, підтягуючи краї.
const getVisiblePages = (page, totalPages) => {
  if (totalPages <= VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(VISIBLE_PAGES / 2);
  let start = page - half;
  let end = page + half;

  if (start < 1) {
    start = 1;
    end = VISIBLE_PAGES;
  }

  if (end > totalPages) {
    end = totalPages;
    start = totalPages - VISIBLE_PAGES + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export default function RecipePagination({ page, totalPages, onPageChange }) {
  // одна сторінка або порожній результат — пагінація не потрібна
  if (!totalPages || totalPages <= 1) return null;

  const pages = getVisiblePages(page, totalPages);

  return (
    <nav className={style.wrapper} aria-label="Recipes pagination">
      <ul className={style.list}>
        {pages.map((pageNumber) => {
          const isCurrent = pageNumber === page;
          return (
            <li key={pageNumber}>
              <button
                type="button"
                className={clsx(style.page, isCurrent && style.pageCurrent)}
                onClick={() => onPageChange(pageNumber)}
                disabled={isCurrent}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`Page ${pageNumber}`}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
