import type { NextConfig } from "next";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const nextConfig: NextConfig = {
    transpilePackages: ["@omnigrid/core", "@omnigrid/react", "@omnigrid/sorting-plugin", "@omnigrid/style"],
    webpack(config) {
        config.module.rules.push({
            resourceQuery: /raw/,
            enforce: "pre",
            use: [require.resolve("raw-loader")],
        });

        const splitChunks = config.optimization?.splitChunks;
        if (splitChunks && splitChunks !== false) {
            splitChunks.cacheGroups = {
                ...splitChunks.cacheGroups,
                "omnigrid-core": {
                    chunks: "all",
                    enforce: true,
                    minSize: 0,
                    name: "omnigrid-core",
                    priority: 40,
                    test: /[\\/](@omnigrid[\\/]core|packages[\\/]core)[\\/]/,
                },
                "omnigrid-react": {
                    chunks: "all",
                    enforce: true,
                    minSize: 0,
                    name: "omnigrid-react",
                    priority: 40,
                    test: /[\\/](@omnigrid[\\/]react|packages[\\/]react)[\\/]/,
                },
                "omnigrid-plugin-base": {
                    chunks: "all",
                    enforce: true,
                    minSize: 0,
                    name: "omnigrid-plugin-base",
                    priority: 40,
                    test: /[\\/](@omnigrid[\\/]sorting-plugin|plugins[\\/]base)[\\/]/,
                },
                "omnigrid-plugin-pro": {
                    chunks: "all",
                    enforce: true,
                    minSize: 0,
                    name: "omnigrid-plugin-pro",
                    priority: 40,
                    test: /[\\/](@omnigrid[\\/]plugin-pro|plugins[\\/]pro)[\\/]/,
                },
            };
        }

        return config;
    },
};

export default nextConfig;
