import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/renderer/shared/common";
import { UserTasksProvider, useUserTasks } from "./context";
import { UserTasks } from "./Tasks";

const Guard = () => {
  const {
    activeTab, currentView, isListView, message, successListView,
  } = useUserTasks();

  const activeTabMessage = useMemo(
    () => activeTab.name ?? 'No active tab selected.', [activeTab]
  );
  const view = useMemo(() => {
    if (!currentView) return 'BreadcrumbNavigationItem is undefined';
    const { current, label, name, path } = currentView;
    return `${label}: ${name} at ${path}. Is ${current ? '' : 'not '}flagged as current.`;
  }, [currentView]);
  const listViewText = useMemo(() => isListView ? 'Yes' : 'No', [isListView]);
  const messageText = useMemo(() => message ?? 'No message', [message]);
  const successListViewText = useMemo(
    () => successListView ? 'Yes' : 'No', [successListView]
  );

  const errorMessage = useMemo(() => [
    `Active tab: ${activeTabMessage}`,
    `View: ${view}`,
    `List view: ${listViewText}`,
    `Message: ${messageText}`,
    `Success ListView: ${successListViewText}`,
  ].map((msg, index) => <li key={index}>{msg}</li>), [
    activeTabMessage, view, listViewText, messageText, successListViewText,
  ]);

  return <ErrorBoundary fallback={
    <>
      <div>There was a problem rendering tasks. The task context provided the following:</div>
      <ul>{errorMessage}</ul>
    </>
  }>
    <UserTasks />
  </ErrorBoundary>
};

export const TasksRoot = () => {
  const { pathname } = useLocation();

  return (
    <ErrorBoundary fallback={
      <>
        Something bad has happened rendering tasks at {pathname}.
        Check UserTasksProvider.
      </>
    }>
      <UserTasksProvider>
        <Guard />
      </UserTasksProvider>
    </ErrorBoundary>
  );
};

export default TasksRoot;
