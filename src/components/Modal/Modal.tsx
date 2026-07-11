import { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const modalRoot = document.getElementById("modal-root");

export default function Modal({ children, onClose }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Вішаємо слухач подій на весь документ
    document.body.style.overflow = "hidden"; // блокуємо прокрутку сторінки під модалкою
    window.addEventListener("keydown", handleKeyDown);

    // Очищення слухача при розмонтуванні компонента
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Закриваємо тільки якщо клікнули саме на бекдроп, а не на саме модальне вікно
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  if (!modalRoot) return null;

  // Вимога ДЗ: сувора структура DOM та використання createPortal
  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot,
  );
}
