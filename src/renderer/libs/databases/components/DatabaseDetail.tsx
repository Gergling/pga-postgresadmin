import { useParams } from 'react-router-dom';

export const DatabaseDetail = () => {
  // We'll use a hook from react-router-dom to get the name
  // This is how you read the dynamic part of the URL
  const { dbName } = useParams();
  
  return (
    <div>
      <h1>Details for: {dbName}</h1>
      <p>This is where you would show tables, queries, etc.</p>
    </div>
  );
};
