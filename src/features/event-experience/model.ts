export interface EventPhoto {
  src: string;
  alt: string;
  caption: string;
}
export interface ProgramItem {
  offsetMinutes: number;
  title: string;
  description: string;
}
export interface EventExperience {
  introduction: string;
  dressCode: string;
  arrival: string;
  accessibility: string;
  program: readonly ProgramItem[];
  photos: readonly EventPhoto[];
}
export interface PastEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}
