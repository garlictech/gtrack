const setVariable = (name: string) => {
  const envVarName = 'npm_package_config_' + name;
  return process.env[name] || process.env[envVarName];
};

const projectPrefix = process.env.PROJECT_PREFIX;

if (!projectPrefix) {
  throw new Error('PROJECT_PREFIX environment variable is not set');
}

export const config = {
  dynamodb: {
    tables: {
      admins: `${projectPrefix}-admins`
    }
  },
  env: setVariable('NODE_ENV'),
  userPoolAdminClientId: setVariable('USERPOOL_ADMIN_CLIENT_ID')
};
