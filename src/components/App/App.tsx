import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import css from './App.module.css';

const PER_PAGE = 12;

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);

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
      <header className={css.toolbar}></header>

      {data && data.totalPages > 1 && (
        <Pagination
          pageCount={data.totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}
