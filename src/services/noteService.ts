import axios from 'axios';
import type { NewNote, Note } from '../types/note';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

const notehubApi = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

export async function fetchNotes({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const response = await notehubApi.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      search,
    },
  });

  return response.data;
}

export async function createNote(note: NewNote): Promise<Note> {
  const response = await notehubApi.post<Note>('/notes', note);

  return response.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const response = await notehubApi.delete<Note>(`/notes/${noteId}`);

  return response.data;
}
