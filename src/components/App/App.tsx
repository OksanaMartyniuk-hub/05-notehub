import { useState } from "react";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./App.module.css";

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Дебаунс для пошуку: робимо запит через 500мс після зупинки введення
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); // При новому пошуку завжди повертаємося на 1 сторінку
  }, 500);

  // Отримання даних через TanStack Query з плавною пагінацією
  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, 12, search),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className={css.app}>
      {/* Вимога ДЗ: Сувора структура хедеру та тулбару */}
      <header className={css.toolbar}>
        <SearchBox onChange={debouncedSearch} />

        {/* Умова: Пагінація рендериться лише якщо сторінок більше 1 */}
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {/* Індикатори завантаження: показуємо Loader лише при першому старті */}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {/* Візуальний індикатор фонового завантаження нової сторінки */}
      {isPlaceholderData && (
        <div className={css.fetchingOverlay}>Оновлення...</div>
      )}

      {/* Умова: Список рендериться, тільки якщо є хоча б одна нотатка */}
      {/* ВИПРАВЛЕНО: Прибрано onDelete пропс, який викликав помилку TS2322 */}
      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}

      {/* Повідомлення, якщо пошук порожній */}
      {!isLoading && !isError && notes.length === 0 && search && (
        <div style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
          Нічого не знайдено за запитом "{search}"
        </div>
      )}

      {/* Універсальне модальне вікно з формою створення */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
