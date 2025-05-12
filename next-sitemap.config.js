module.exports = {
  siteUrl: process.env.SITE_URL || 'https://willy-ai.vercel.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api', '/admin']
      }
    ]
  },
  changefreq: 'daily',
  priority: 0.7
};