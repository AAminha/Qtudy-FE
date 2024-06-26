import { ServiceType } from '@/types/category.type';

export interface HistoryType {
  fileId: number;
  fileName: string;
  dtype: ServiceType | 'PROBLEM';
  createTime: string;
}
