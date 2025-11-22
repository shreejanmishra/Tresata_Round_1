// jest.config.mjs (ensure this exact content, no require lines)
export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(png|jpg|jpeg|gif|svg|ico|webp)$": "identity-obj-proxy",
    "^lucide-react$": "<rootDir>/src/__mocks__/lucide-react.js",
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.(js|jsx)",
    "<rootDir>/src/**/?(*.)+(spec|test).(js|jsx)",
    "<rootDir>/src/testing/**/*.test.(js|jsx)",
  ],
  collectCoverageFrom: ["src/**/*.{js,jsx}", "!src/**/*.d.ts"],
};
