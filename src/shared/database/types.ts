type DatabaseResponseSuccess = {
  success: true;
};

type DatabaseResponseFailure = {
  success: false;
  error: string;
};

export type DatabaseResponseBase = DatabaseResponseFailure | DatabaseResponseSuccess;

export type DatabaseResponseSelect<T> = DatabaseResponseFailure | (DatabaseResponseSuccess & {
  data: T[];
});

export type DatabaseItem = { datname: string };
