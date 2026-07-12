import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Імпортуємо TanStack Query
import { createNote } from "../../services/noteService"; // Імпортуємо функцію запиту
import css from "./NoteForm.module.css";

// Схема валідації
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

interface FormValues {
  title: string;
  content: string;
  tag: string;
}

// ВИПРАВЛЕНО: Інтерфейс очікує лише проп для закриття форми (вимога ментора)
interface NoteFormProps {
  onCancel: () => void;
}

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  // ВИПРАВЛЕНО: Логіка мутації та інвалідації інтегрована прямо в компонент форми (вимога ментора)
  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      // Оновлюємо список нотаток у кеші
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      // Закриваємо модалку після успішного створення
      onCancel();
    },
    onError: (error: any) => {
      console.error(
        "Помилка створення нотатки:",
        error.response?.data || error.message,
      );
    },
  });

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
        // Викликаємо мутацію прямо тут, передаючи правильні назви полів API
        createMutation.mutate({
          title: values.title,
          content: values.content,
          tag: values.tag,
        });
      }}
    >
      {({ isSubmitting }) => (
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
              disabled={isSubmitting || createMutation.isPending}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
