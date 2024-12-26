export type icon = {
  name: string;
  url: string;
}

export enum RESULT_CODE {
  SUCCESS = 0,
  FAIL = -1,
}
export interface result {
  code: RESULT_CODE,
  data: { [name: string]: unknown },
  msg: string | Error | null | undefined
}

export interface loadOptions {
}
