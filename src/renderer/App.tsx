import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useIpc } from './shared/ipc/hook';
import { DatabasesView } from './views/DatabasesView';
import { AppContextProvider } from './app/AppContextProvider';
import { StartupView } from './views/StartupView';

const IpcTest: React.FC = () => {
  const { testIPC } = useIpc(); // Ensure the IPC context is initialized
  const [testMessage, setTestMessage] = useState('');
  const [testResult, setTestResult] = useState('');

  // Example of using the `invoke` function to call an IPC channel.
  const handleTestIPC = async () => {
    try {
      const result = await testIPC(testMessage);
      setTestResult(result);
    } catch (error) {
      console.error('Failed to invoke testIPC:', error);
      setTestResult('Error: See console for details.');
    }
  };

  return (
    <div>
      <h1>Test IPC Functions</h1>
      <p>Use this form to test the `testIPC` function in the main process.</p>
      <input
        type="text"
        value={testMessage}
        onChange={(e) => setTestMessage(e.target.value)}
        placeholder="Enter a message to send"
      />
      <button onClick={handleTestIPC}>Send Message to Main Process</button>
      <p><strong>Result from Main Process:</strong> {testResult}</p>
    </div>
  );
};

const App = () => (
  <AppContextProvider>
    <StartupView />
    {/* <DatabasesView /> */}
  </AppContextProvider>
);

const root = createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
