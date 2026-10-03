// Production hardening for the Android manifest:
//  - allowBackup=false: keeps the cached task data (AsyncStorage) and session out of Google Drive / adb backups.
const { withAndroidManifest } = require('expo/config-plugins');

module.exports = function withAndroidHardening(config) {
  return withAndroidManifest(config, (cfg) => {
    const app = cfg.modResults.manifest.application?.[0];
    if (app) {
      app.$['android:allowBackup'] = 'false';
      app.$['android:fullBackupContent'] = 'false';
    }
    return cfg;
  });
};
