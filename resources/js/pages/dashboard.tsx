// pages/dashboard/index.tsx
import { usePage } from '@inertiajs/react';
import AdminDashboard from './admindashboard';
import UserDashboard from './userdashboard';

export default function Dashboard() {
  const { auth } = usePage<{ auth: { user: { roles: string[] } } }>().props;
  const roles = auth.user?.roles || [];
  const isAdminOrConsultor = roles.includes('admin') || roles.includes('consultor');

  return isAdminOrConsultor ? <AdminDashboard /> : <UserDashboard />;
}
