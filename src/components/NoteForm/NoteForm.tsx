import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";

// 1. Схема валідації (Вимога ДЗ)
const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Мінімум 3 символи")
    .max(50, "Максимум 50 символів")
    .required("Обов'язкове поле"),
  content: Yup.string().max(500, "Максимум 500 символів"),
  tag: Yup.string()
    .oneOf(
      ["Todo", "Work", "Personal", "Meeting", "Shopping"],
      "Некоректний тег",
    )
    .required("Обов'язкове поле"),
});

// Інтерфейс для Formik (Вимога ДЗ)
interface FormValues {
  title: string;
  content: string;
  tag: string;
}

interface NoteFormProps {
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}

export default function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
  const initialValues: FormValues = {
    title: "",
    content: "",
    tag: "Todo",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteSchema}
      onSubmit={(values) => {
        onSubmit(values); // Передаємо зібрані дані в App.tsx
      }}
    >
      {(
        { isSubmitting, errors }, // Додали errors для тесту
      ) => (
        // Вимога ДЗ: Суворе збереження DOM-структури та класів
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              name="content"
              as="textarea"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" name="tag" as="select" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              Create note
            </button>
          </div>

          {/* НАШ ТЕСТОВИЙ ЕКРАНЧИК ПОМИЛОК (ВИДАЛИМО ПІСЛЯ ТЕСТУ) */}
          <pre
            style={{
              color: "red",
              marginTop: "15px",
              background: "#fff0f0",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            Помилки форми: {JSON.stringify(errors, null, 2)}
          </pre>
        </Form>
      )}
    </Formik>
  );
}
