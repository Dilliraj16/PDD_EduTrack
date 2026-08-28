const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });

// Mock react-native-worklets for Web platform so Reanimated doesn't crash Chrome
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (platform === 'web' && moduleName === 'react-native-worklets') {
        return { type: 'empty' };
    }
    return context.resolveRequest(context, moduleName, platform);
};
