import AdminConsole from '@/components/admin/AdminConsole';
import {
  getAdminConfigurationNote,
  isAdminAuthenticated,
  isAdminConfigured,
} from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const initialAuthenticated = await isAdminAuthenticated();

  return (
    <AdminConsole
      adminConfigured={isAdminConfigured()}
      adminNote={getAdminConfigurationNote()}
      initialAuthenticated={initialAuthenticated}
    />
  );
}
