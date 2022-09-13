import { TPagination } from './pagination';

export type TProject = {
  _id?: string;
  name: string;
  description: string;
  updatedAt: Date;
  createdAt: Date;
  __v: number;
};

export type TProjectDataResponse = {
  project: TProject[];
  pagination: TPagination;
};
