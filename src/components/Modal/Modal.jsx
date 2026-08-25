import { useEffect } from "react";
import { createPortal } from "react-dom";
import style from "./Modal.module.css";

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={style.backdrop} onClick={onClose} role="presentation">
      <div
        className={style.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={style.close}
          onClick={onClose}
          aria-label="Close"
        >
          <svg className={style.closeIcon} aria-hidden="true">
            <use href={`${import.meta.env.BASE_URL}icons.svg#close`} />
          </svg>
        </button>

        {title ? (
          <h2 id="modal-title" className={style.title}>
            {title}
          </h2>
        ) : null}

        {children}
      </div>
    </div>,
    document.body,
  );
}
