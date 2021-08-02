const setVariable = (name: string) => {
  const envVarName = 'npm_package_config_' + name;
  return process.env[name] || process.env[envVarName];
};

export const config = {
  origin: setVariable('ORIGIN'),
  deepLink: setVariable('DEEP_LINK'),
  userPoolMobileClientId: setVariable('USERPOOL_MOBILE_CLIENT_ID'),
  SESFromAddress: setVariable('SES_FROM_ADDRESS')
};
