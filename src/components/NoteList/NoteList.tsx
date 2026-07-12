import { useMutation, useQueryClient } from "@tanstack/react-query";
// ВИПРАВЛЕНО: Імпортуємо правильну функцію видалення з вашого сервісу
import { deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  // Використання useMutation з вашим сервісом deleteNote
  const { mutate: deleteNoteMutation } = useMutation({
    // Передаємо вашу функцію з сервісу замість саморобного fetch
    mutationFn: deleteNote,
    onSuccess: () => {
      // Інвалідація кешу для автоматичного оновлення списку нотаток
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Помилка при видаленні нотатки:", error);
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              // Викликаємо мутацію та передаємо їй id
              onClick={() => deleteNoteMutation(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
