/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix case sensitivity issues
    config.resolve.symlinks = false;
    
    // Add case-sensitive paths plugin for better error handling
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Ensure consistent casing for node_modules
        '@': require('path').resolve(__dirname, './'),
      };
    }

    return config;
  },
  // Reduce webpack warnings
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Optimize for development
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['axios', 'form-data'],
  },
};

module.exports = nextConfig;