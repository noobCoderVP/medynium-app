// Plain-HTTP API access (a LAN dev server) is allowed only when MEDYNIUM_CLEARTEXT=1, which eas.json sets for
// the development and preview profiles. Release and production builds stay HTTPS-only.
module.exports = ({ config }) => {
  if (process.env.MEDYNIUM_CLEARTEXT !== '1') return config;
  return {
    ...config,
    plugins: [...(config.plugins ?? []), ['expo-build-properties', { android: { usesCleartextTraffic: true } }]],
  };
};
