export enum TaskStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  CANCELLED = 'cancelled',
}

export class Task {
  readonly id: number;
  name: string;
  description?: string;
  status: TaskStatus;
}
