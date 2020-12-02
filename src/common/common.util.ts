import { PAGE_SIZE } from './common.contant';

export class CommonUtils {
  public static getSkipAndTake(page: number): any {
    return {
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    };
  }
}

export const getSkipAndTake = (page: number) => {
  return {
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  };
};

export const getTotalPage = (count: number) => Math.ceil(count / PAGE_SIZE);
