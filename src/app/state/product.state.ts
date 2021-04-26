export enum DataStateEnum{
  LOADING,
  LOADED,
  ERROR
}

export interface AppDataState<T>{
  dataSate?:DataStateEnum,
  data?:T,
  errorMessage?:string
}
