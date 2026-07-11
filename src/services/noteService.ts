import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note } from "../types/note";

// Налаштування екземпляру Axios
const instance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    // Беремо токен безпеки з файлу .env.local
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

// Інтерфейси для відповідей та параметрів (згідно з вимогами ДЗ)
export interface FetchNotesResponse {
  notes: Note[];
  totalNotes: number;
  totalPages: number;
  currentPage: number;
}

export interface CreateNoteData {
  title: string;
  text: string;
  category: string;
}

// 1. Отримання списку нотаток із пагінацією та пошуком
export const fetchNotes = async (
  page: number,
  perPage: number = 12,
  search: string = "",
): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> = await instance.get(
    "/notes",
    {
      params: { page, perPage, search },
    },
  );
  return response.data;
};

// 2. Створення нової нотатки
export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const response: AxiosResponse<Note> = await instance.post("/notes", noteData);
  return response.data;
};

// 3. Видалення нотатки за її ідентифікатором
export const deleteNote = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await instance.delete(`/notes/${id}`);
  return response.data;
};
