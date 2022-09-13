import { TPagination } from './pagination';
import { TProject } from './project';

export type TPage = {
  _id?: string;
  name: string;
  description: string;
  project: TProject | string;
  updatedAt: Date;
  createdAt: Date;
  __v: number;
};

export type TPageDataResponse = {
  page: TPage[];
  pagination: TPagination;
};
