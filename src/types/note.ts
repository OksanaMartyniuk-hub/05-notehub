export type NoteTag =
  | "Work"
  | "Personal"
  | "Shopping"
  | "Todo"
  | "Meeting"
  | string;

export interface Note {
  id: string;
  title: string;
  text: string;
  category: NoteTag;
}
