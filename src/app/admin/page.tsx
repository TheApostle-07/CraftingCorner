import AdminConsole from '@/components/admin/AdminConsole';
import {
  getAdminConfigurationNote,
  isAdminAuthenticated,
  isAdminConfigured,
} from '@/lib/adminAuth';
import { getSiteStatus, getSiteStorageInfo } from '@/lib/siteStatus';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [initialAuthenticated, initialStatus] = await Promise.all([
    isAdminAuthenticated(),
    getSiteStatus(),
  ]);

  return (
    <AdminConsole
      adminConfigured={isAdminConfigured()}
      adminNote={getAdminConfigurationNote()}
      initialAuthenticated={initialAuthenticated}
      initialStatus={initialStatus}
      storageInfo={getSiteStorageInfo()}
    />
  );
}
