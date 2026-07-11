import css from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({
  message = "Сталася помилка при завантаженні даних.",
}: ErrorMessageProps) {
  return (
    <div className={css.errorContainer}>
      <p className={css.errorText}>{message}</p>
    </div>
  );
}
