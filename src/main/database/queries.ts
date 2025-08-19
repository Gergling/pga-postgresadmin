type TableFieldDefinition = {
  [K: string]: string;
};

const getSQL = (fields: TableFieldDefinition): string => Object.entries(fields)
  .map(([name, type]) => `${name} ${type}`)
  .join(', ');

// const createTable = (
//   tableName: string,
//   fields: TableFieldDefinition,
// ) => `CREATE TABLE ${tableName} (${getSQL(fields)});`;

export const selectDatabaseList = () => 'SELECT datname FROM pg_database WHERE datistemplate = false;';
