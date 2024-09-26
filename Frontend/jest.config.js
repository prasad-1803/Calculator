module.exports = {
    transform: {
      "^.+\\.jsx?$": "babel-jest",
    },
    transformIgnorePatterns: [
      // "/node_modules/(?!axios)",
      "node_modules/(?!(axios)/)",
    ],
    moduleNameMapper: {
      "\\.(css|less|scss)$": "identity-obj-proxy",
    },
    testEnvironment: "jsdom",
  };