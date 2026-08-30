import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  staticDirs: ["../public"],
  addons: ["@storybook/addon-a11y"],
  framework: "@storybook/react-vite",
  typescript: { reactDocgen: false },
  viteFinal: async (config) => {
    config.esbuild = { ...config.esbuild, jsx: "automatic" };
    return config;
  },
};

export default config;
