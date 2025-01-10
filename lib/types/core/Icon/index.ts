export type icon = {
  name: string;
  url: string;
  options?: Partial<StyleImageMetadata>
}

type StyleImageMetadata = {
  pixelRatio: number;
  sdf: boolean;
  usvg: boolean;
  stretchX?: Array<[
    number,
    number
  ]>;
  stretchY?: Array<[
    number,
    number
  ]>;
  content?: [
    number,
    number,
    number,
    number
  ];
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
