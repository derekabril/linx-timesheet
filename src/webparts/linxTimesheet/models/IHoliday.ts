export interface IHoliday {
  Id: number;
  Title: string;
  HolidayDate: string;
  Year: number;
  IsRecurring: boolean;
}

export interface IHolidayCreate {
  Title: string;
  HolidayDate: string;
  Year: number;
  IsRecurring: boolean;
}
