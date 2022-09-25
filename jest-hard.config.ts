import { getJestProjects } from '@nrwl/jest';

export default {
  projects: getJestProjects(),
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  }
};
