import { StatusItemProps } from "./types";

type StatusProps = {
  statuses: StatusItemProps[];
};

const statusIcons: {
  [key in StatusItemProps['status']]: string;
} = {
  failure: '❌',
  pending: '⏳',
  success: '✅',
};

const StatusItem = ({ description, status }: StatusItemProps) => {
  return (
    <li>
      <span>{statusIcons[status]}</span>
      <span style={{ marginLeft: '8px' }}>{description}</span>
    </li>
  );
};

export const Status = ({ statuses }: StatusProps) => {
  return (
    <div>
      <ul>
        {statuses.map((item) => (
          <StatusItem key={item.name} {...item} />
        ))}
      </ul>
    </div>
  );
};
