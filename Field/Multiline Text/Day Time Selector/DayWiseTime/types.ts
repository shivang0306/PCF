export interface DaySchedule {
  dayIndex: number;
  day: string;
  enabled: boolean;
  start: Date | null;
  end: Date | null;
}