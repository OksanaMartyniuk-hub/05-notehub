import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
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

  const queryClient = useQueryClient();

  // Дебаунс для пошуку: робимо запит через 500мс після зупинки введення
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); // При новому пошуку завжди повертаємося на 1 сторінку
  }, 500);

  // Отримання даних через TanStack Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, 12, search),
  });

  // Мутація для створення нової нотатки
  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false); // закриваємо модалку після успіху
    },
  });

  // Мутація для видалення нотатки
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // Обробник відправки форми (перетворює локальні поля форми на поля для бекенду)
  const handleFormSubmit = (formValues: {
    title: string;
    content: string;
    tag: string;
  }) => {
    createMutation.mutate({
      title: formValues.title,
      text: formValues.content, // контент форми мапиться у поле text для сервера
      category: formValues.tag, // тег форми мапиться у поле category для сервера
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

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

      {/* Індикатори завантаження та помилок */}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {/* Умова: Список рендериться, тільки якщо є хоча б одна нотатка */}
      {!isLoading && !isError && notes.length > 0 && (
        <NoteList notes={notes} onDelete={handleDelete} />
      )}

      {/* Повідомлення, якщо пошук порожній */}
      {!isLoading && !isError && notes.length === 0 && search && (
        <div style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
          Нічого не знайдено за запитом "{search}"
        </div>
      )}

      {/* Універсальне модальне вікно з формою створення */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
