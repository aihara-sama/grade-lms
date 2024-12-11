/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://grade-lms.vercel.app",
  generateRobotsTxt: true, // (optional)
  additionalPaths: async () => {
    const result = [];

    // required value only
    result.push({ loc: "/" });

    return result;
  },

  // ...other options
};
