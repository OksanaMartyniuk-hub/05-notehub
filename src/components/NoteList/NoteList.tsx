import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

// Вимога ДЗ: інтерфейс для пропсів за схемою Ім’яКомпонентаProps
interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

// Вимога ДЗ: Експорт за замовчуванням (export default)
export default function NoteList({ notes, onDelete }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.text}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.category}</span>
            <button className={css.button} onClick={() => onDelete(note.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
