import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  count?: number;
};

export function NotificationBell({ count = 0 }: Props) {
  return (
    <Link to="/notifications" className="notification-bell" aria-label="Notifications">
      <Bell size={18} />
      {count > 0 && <span>{count}</span>}
    </Link>
  );
}
