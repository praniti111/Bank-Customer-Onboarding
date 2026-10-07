module.exports = {
  testing: {
    framework: 'jest',
    testFilePattern: '**/*.test.js',
    coverageThreshold: 70
  },
  persistence: {
    type: 'json-file',
    path: 'backend/db.json',
    serviceLayer: 'backend/models/store.js'
  },
  auth: {
    strategy: 'jwt',
    tokenExpiry: '2h',
    passwordHashing: 'bcryptjs'
  }
};
