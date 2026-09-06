export type ApiSuccess<T> = {
  status: 'success';
  data: T;
};

export type ApiMessageSuccess = {
  status: 'success';
  message: string;
};

export type ApiError = {
  status: 'error';
  message: string;
};
