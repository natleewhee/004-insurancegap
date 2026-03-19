export default function robots() {
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/results', '/loading'],
        },
      ],
      sitemap: 'https://sginsurecheck.vercel.app/sitemap.xml',
    }
  }