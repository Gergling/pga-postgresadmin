export const Status = () => {
  return (
    <div>
      <h2>Startup Status</h2>
      <ul>
        <li>
          <span>✅</span>
          <span style={{ marginLeft: '8px' }}>Checked Docker installation</span>
        </li>
        <li>
          <span>✅</span>
          <span style={{ marginLeft: '8px' }}>Verified Docker is running</span>
        </li>
        <li>
          <span>✅</span>
          <span style={{ marginLeft: '8px' }}>Launched PostgreSQL container</span>
        </li>
        <li>
          <span>⏳</span>
          <span style={{ marginLeft: '8px' }}>Waiting for database to become available...</span>
        </li>
      </ul>
    </div>
  );
};
