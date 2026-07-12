export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string; // замість text
  tag: NoteTag; // замість category
  createdAt: string;
  updatedAt: string;
}
