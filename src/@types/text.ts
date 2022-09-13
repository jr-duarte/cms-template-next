import { TPage } from './page';
import { TPagination } from './pagination';

export type TText = {
  _id?: string;
  pt_br: string;
  en_us: string;
  page: TPage | string;
  updatedAt: Date;
  createdAt: Date;
  __v: number;
};

export type TTextDataResponse = {
  text: TText[];
  pagination: TPagination;
};
