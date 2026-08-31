import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import type { NewNote } from '../../types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onSubmit: (note: NewNote) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const initialValues: NewNote = {
  title: '',
  content: '',
  tag: 'Todo',
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be at most 50 characters')
    .required('Title is required'),
  content: Yup.string().max(500, 'Content must be at most 500 characters'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag is required'),
});

export default function NoteForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: NoteFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form className={css.form}>
        <label className={css.formGroup}>
          Title
          <Field className={css.input} type="text" name="title" />
          <ErrorMessage name="title" component="span" className={css.error} />
        </label>

        <label className={css.formGroup}>
          Content
          <Field
            className={css.textarea}
            as="textarea"
            name="content"
            rows={8}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </label>

        <label className={css.formGroup}>
          Tag
          <Field className={css.select} as="select" name="tag">
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </label>

        <div className={css.actions}>
          <button className={css.cancelButton} type="button" onClick={onCancel}>
            Cancel
          </button>

          <button
            className={css.submitButton}
            type="submit"
            disabled={isSubmitting}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
