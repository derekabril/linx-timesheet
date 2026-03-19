export interface IHoliday {
  Id: number;
  Title: string;
  HolidayDate: string;
  Year: number;
  IsRecurring: boolean;
  Category: string;
}

export interface IHolidayCreate {
  Title: string;
  HolidayDate: string;
  Year: number;
  IsRecurring: boolean;
  Category: string;
}
