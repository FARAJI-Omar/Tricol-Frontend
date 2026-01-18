import { StatsCardItem } from "./stats-card-item";

export const ADMIN_DASHBOARD_STATS: StatsCardItem[] = [
  {
    label: 'Total Suppliers',
    value: 42,
    icon: 'local_shipping',
    iconColor: '#3b82f6',
    iconBgColor: '#dbeafe'
  },
  {
    label: 'Active Products',
    value: '1,240',
    icon: 'checkroom',
    iconColor: '#3b82f6',
    iconBgColor: '#dbeafe'
  },
  {
    label: 'Pending Orders',
    value: 18,
    icon: 'event_note',
    iconColor: '#f97316',
    iconBgColor: '#fed7aa'
  },
  {
    label: 'Stock Alerts',
    value: 5,
    icon: 'warning',
    iconColor: '#ef4444',
    iconBgColor: '#fecaca'
  }
];