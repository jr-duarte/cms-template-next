import { TPage, TPageDataResponse } from 'src/@types/page';
import { TProject, TProjectDataResponse } from 'src/@types/project';
import { TText, TTextDataResponse } from 'src/@types/text';
import axiosInstance from '../utils/axios';

const serverApi = {
  project: {
    getAll: (skip: number, limit: number, name?: string) =>
      axiosInstance.get<TProjectDataResponse>(
        `/cms/project/getall?skip=${skip}&limit=${limit}${name ? `&name=${name}` : ''}`
      ),
    getById: (id: string) => axiosInstance.get<TProject>(`/cms/project/getbyid?id=${id}`),
    create: (project: TProject) => axiosInstance.post<void>(`/cms/project/create`, project),
    update: (id: string, project: TProject) =>
      axiosInstance.put<void>(`/cms/project/update?id=${id}`, project),
    delete: (id: string) => axiosInstance.delete<void>(`/cms/project/delete?id=${id}`),
  },
  page: {
    getAll: (skip: number, limit: number, name?: string) =>
      axiosInstance.get<TPageDataResponse>(
        `/cms/page/getall?skip=${skip}&limit=${limit}${name ? `&name=${name}` : ''}`
      ),
    getByProjectId: (skip: number, limit: number, projectid: string, name?: string) =>
      axiosInstance.get<TPageDataResponse>(
        `/cms/page/getbyprojectid?skip=${skip}&limit=${limit}&projectid=${projectid}${
          name ? `&name=${name}` : ''
        }`
      ),
    getById: (id: string) => axiosInstance.get<TPage>(`/cms/page/getbyid?id=${id}`),
    create: (page: TPage) => axiosInstance.post<void>(`/cms/page/create`, page),
    update: (id: string, page: TPage) => axiosInstance.put<void>(`/cms/page/update?id=${id}`, page),
    delete: (id: string) => axiosInstance.delete<void>(`/cms/page/delete?id=${id}`),
  },
  text: {
    getAll: (skip: number, limit: number, name?: string) =>
      axiosInstance.get<TTextDataResponse>(
        `/cms/text/getall?skip=${skip}&limit=${limit}${name ? `&name=${name}` : ''}`
      ),
    getByPageId: (skip: number, limit: number, pageid: string) =>
      axiosInstance.get<TTextDataResponse>(
        `/cms/text/getbypageid?skip=${skip}&limit=${limit}&pageid=${pageid}`
      ),

    getById: (id: string) => axiosInstance.get<TText>(`/cms/text/getbyid?id=${id}`),
    create: (text: TText) => axiosInstance.post<void>(`/cms/text/create`, text),
    update: (id: string, text: TText) => axiosInstance.put<void>(`/cms/text/update?id=${id}`, text),
    delete: (id: string) => axiosInstance.delete<void>(`/cms/text/delete?id=${id}`),
  },
};

export { serverApi };
