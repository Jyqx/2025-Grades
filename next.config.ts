import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
	reactStrictMode: true,
	images: {
		unoptimized: true, // Disable default image optimization
	},
	assetPrefix: isProd ? "/2025-Grades/" : "",
	basePath: isProd ? "/2025-Grades" : "",
	output: "export",
};

export default nextConfig;
