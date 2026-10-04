import { useCallback, useEffect, useState } from 'react';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useCurrentVersion, useFetchLatestVersion, useReloadToLatestVersion } from './version.hooks';
import { VERSION_CHECK_INTERVAL } from './version.utils';

export default function VersionListener() {
  const version = useCurrentVersion();
  const fetchLatestVersion = useFetchLatestVersion();
  const reloadToLatestVersion = useReloadToLatestVersion();
  const [nextVersion, setNextVersion] = useState<string | null>(null);
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    if (!version) return;
    const interval = setInterval(async () => {
      const latestVersion = await fetchLatestVersion();
      if (latestVersion && latestVersion !== version) setNextVersion(latestVersion);
    }, VERSION_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [version, fetchLatestVersion]);

  const handleConfirm = useCallback(() => {
    setIsReloading(true);
    reloadToLatestVersion();
  }, [reloadToLatestVersion]);

  const handleClose = useCallback(() => setNextVersion(null), []);

  return (
    <Dialog open={!!nextVersion} onClose={isReloading ? undefined : handleClose}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningAmberIcon color="warning" />
        New version available
      </DialogTitle>
      <DialogContent>
        <DialogContentText>There is a new version of the app.</DialogContentText>
        <DialogContentText>
          Your version: <Chip size="small" label={version} />
        </DialogContentText>
        <DialogContentText>
          New version: <Chip size="small" color="primary" label={nextVersion} />
        </DialogContentText>
        <DialogContentText>Would you like to reload the page?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={handleClose} disabled={isReloading}>
          Not now
        </Button>
        <Button color="warning" onClick={handleConfirm} loading={isReloading}>
          Reload now
        </Button>
      </DialogActions>
    </Dialog>
  );
}
