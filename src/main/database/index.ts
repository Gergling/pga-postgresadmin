import { Pool, PoolClient } from 'pg';
import { IpcHandlerDatabase } from './types';
// import queries from './queries';

export const getDatabaseClient = (pool: Pool) => async () => {
  try {
    return await pool.connect();
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw new Error('Database connection failed');
  }
};
// This is ./src/database/index.ts: 16
export const runQuery = (client: PoolClient) => async (query: string) => {
  await client.query(query);
  if (client) {
    client.release();
  }
};

// export const createTable = async (tableName: string) => {
//     // 1. Validate the table name using a regular expression.
//   const namePattern = /^[a-zA-Z0-9_]+$/;
//   if (!namePattern.test(tableName)) {
//     return { success: false, error: 'Invalid table name' };
//   }

//   // 2. Build the DDL query string dynamically.
//   const query = queries.createTable(tableName, {
//     id: 'SERIAL PRIMARY KEY',
//     name: 'VARCHAR(255) NOT NULL',
//     created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
//   });

//   return await runQuery(query);
// };

export const getDatabase = (): IpcHandlerDatabase => {
  const pool = new Pool({
    // Your database connection details
  });

  const getClient = getDatabaseClient(pool);

  const runQuery = (
    client: PoolClient
  ) => async (
    query: string
  ) => client.query(query);

  return {
    runQuery: async (query: string) => {
      const client = await getClient();
      try {
        // Ideally we loop everything else and just configure this into the generic
        // function. We'll get a few more first though.
        await runQuery(client)(query);
        return { success: true };
      } catch (error) {
        console.error('Error running DML query:', error);
        return { success: false, error: error.message };
      } finally {
        if (client) {
          client.release();
        }
      }
    }
  }
};
