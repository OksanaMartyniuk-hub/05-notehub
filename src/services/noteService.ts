import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note } from "../types/note";

// Налаштування екземпляру Axios
const instance = axios.create({
  // ВИПРАВЛЕНО: прибрали /docs з кінця посилання
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    // Беремо токен безпеки з файлу .env.local
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

// ВИПРАВЛЕНО: Інтерфейс містить лише ті поля, які реально повертає API (вимога ментора)
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// ВИПРАВЛЕНО: Використовує назви content і tag відповідно до специфікації API (вимога ментора)
export interface CreateNoteData {
  title: string;
  content: string;
  tag: string;
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
