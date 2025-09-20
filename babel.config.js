module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // NOTE: The Worklets plugin must be listed last.
      "react-native-worklets/plugin",
    ],
  };
};
