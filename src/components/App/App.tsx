import { useState } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createNote, deleteNote, fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import { useDebouncedCallback } from 'use-debounce';
import SearchBox from '../SearchBox/SearchBox';
import css from './App.module.css';

const PER_PAGE = 12;

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleOpenModal = () => {
    createMutation.reset();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    createMutation.reset();
    setIsModalOpen(false);
  };

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 300);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notes', currentPage, searchQuery],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: PER_PAGE,
        search: searchQuery,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />

        {!isError && data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button className={css.button} type="button" onClick={handleOpenModal}>
          Create note +
        </button>
      </header>

      {deleteMutation.isError && (
        <p>Failed to delete note: {deleteMutation.error.message}</p>
      )}

      {isLoading && <p>Loading notes...</p>}

      {isError && <p>Failed to load notes: {error.message}</p>}

      {!isLoading && !isError && data && data.notes.length === 0 && (
        <p>No notes found.</p>
      )}

      {!isError && data && data.notes.length > 0 && (
        <NoteList
          notes={data.notes}
          onDelete={noteId => deleteMutation.mutate(noteId)}
          deletingNoteId={
            deleteMutation.isPending ? deleteMutation.variables : undefined
          }
        />
      )}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          {createMutation.isError && (
            <p>Failed to create note: {createMutation.error.message}</p>
          )}

          <NoteForm
            onSubmit={note => createMutation.mutate(note)}
            onCancel={handleCloseModal}
            isSubmitting={createMutation.isPending}
          />
        </Modal>
      )}
    </div>
  );
}
