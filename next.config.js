const Dotenv = require('dotenv-webpack')
const nextConfig = {
    reactStrictMode: false,
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        })
        config.plugins.push(new Dotenv({ silent: true }))
        // config.resolve.fallback = { fs: false }

        return config
    },
    compiler: {
        // ...(process.env.NODE_ENV === 'production' && { removeConsole: true }),
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['votg.codeidea.io', 'localhost'],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `https://api.votg.codeidea.io//:path*`,
            },
        ]
    },

    // async redirects() {
    //     return [
    //         {
    //             source: '/',
    //             destination: '/auth/login',
    //             permanent: true,
    //         },
    //     ]
    // },
}

module.exports = nextConfig