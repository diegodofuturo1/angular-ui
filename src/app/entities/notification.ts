export interface Notification {
  type: 'success' | 'info' | 'warning' | 'danger' | 'primary';
  title: string;
  message: string;
}
