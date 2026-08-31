import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import css from './App.module.css';

export default function App() {
  const { data } = useQuery({
    queryKey: ['notes'],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
      }),
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}></header>

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}
