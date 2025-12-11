export type WorkshopStatus = 'activo' | 'cancelado';

export interface Workshop {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  category: string;
  capacity: number;
  enrolled: number;
  status: WorkshopStatus;
}

export interface Enrollment {
  studentName: string;
  studentEmail: string;
  workshopId: string;
}
