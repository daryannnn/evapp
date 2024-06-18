const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

const nextConfig = {
  reactStrictMode: false,

  webpack(config, { isServer }) {
    config.plugins.push(
        new NextFederationPlugin({
          name: 'events',
          filename: 'static/chunks/remoteEntry.js',
          exposes: {
            './UserEventsSurface': 'src/components/UserEventsSurface.tsx',
            './UserEventsFeed': 'src/components/UserEventsFeed.tsx',
            './FavoriteEventsSurface': 'src/components/FavoriteEventsSurface.tsx',
            './EventCard': 'src/components/EventCard.tsx',
            './EventsMap': 'src/components/EventsMap.tsx',
            './SearchEvents': 'src/components/SearchEvents.tsx',
          },
          shared: {},
        })
    );
    config.devServer = {
      client: { overlay: { warnings: false } }
    }

    return config;
  },

  /*webpack: function (config, _) {
      config.devServer = {
          client: { overlay: { warnings: false } }
      }
      return config
  }*/
}

module.exports = nextConfig