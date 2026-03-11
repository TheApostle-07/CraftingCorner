import AdminConsole from '@/components/admin/AdminConsole';
import {
  getAdminConfigurationNote,
  isAdminAuthenticated,
  isAdminConfigured,
} from '@/lib/adminAuth';
import { getSiteStatus, getSiteStorageInfo } from '@/lib/siteStatus';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const initialAuthenticated = await isAdminAuthenticated();
  const initialStatus = initialAuthenticated ? await getSiteStatus() : null;
  const storageInfo = initialAuthenticated ? getSiteStorageInfo() : null;

  return (
    <AdminConsole
      adminConfigured={isAdminConfigured()}
      adminNote={getAdminConfigurationNote()}
      initialAuthenticated={initialAuthenticated}
      initialStatus={initialStatus}
      storageInfo={storageInfo}
    />
  );
}
