import { useState } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createNote, fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import css from './App.module.css';

const PER_PAGE = 12;

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
    },
  });

  const { data } = useQuery({
    queryKey: ['notes', currentPage],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: PER_PAGE,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <button
          className={css.button}
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {data && data.totalPages > 1 && (
        <Pagination
          pageCount={data.totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={note => createMutation.mutate(note)}
            onCancel={() => setIsModalOpen(false)}
            isSubmitting={createMutation.isPending}
          />
        </Modal>
      )}
    </div>
  );
}
