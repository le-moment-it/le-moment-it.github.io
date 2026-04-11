import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Le Moment IT',
  tagline: 'DevOps made simple',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://le-moment-it.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'le-moment-it', // Usually your GitHub org/user name.
  projectName: 'le-moment-it.github.io', // Usually your repo name.
  trailingSlash: false,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  markdown: {
    mermaid: true,
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        // Whether to hash the search index file
        hashed: true,

        // Set language support (English and French based on your location)
        language: ['en', 'fr'],

        // Index documentation pages
        indexDocs: true,

        // Index blog posts
        indexBlog: false,

        // Don't index regular pages (set to true if you have custom pages to index)
        indexPages: false,

        // Base paths for docs and blog
        docsRouteBasePath: '/docs',

        // Limit search results
        searchResultLimits: 8,

        // Highlight search terms on target pages
        highlightSearchTermsOnTargetPage: false,

        // Keyboard shortcut to focus search (default is Ctrl+K or Cmd+K)
        searchBarShortcut: true,

        // If you want to use a custom keyboard shortcut:
        // searchBarShortcutHint: false,

        // Remove stopwords for better search results
        removeDefaultStopWordFilter: false,

      },
    ],

  ],
  themeConfig: {
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 5,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      }
    },
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Le Moment IT',
      logo: {
        alt: 'Le Moment IT',
        src: 'img/docusaurus.svg',
      },
      items: [
        {
          type: 'dropdown',
          label: 'DevOps',
          position: 'left',
          items: [
            {
              label: 'Code',
              to: 'docs/category/code',
            },
            {
              label: 'Tools & Systems',
              to: 'docs/category/tools--systems',
            },
          ],
        },
        {
          label: 'Infrastructure',
          to: 'docs/category/authentication',
          position: 'left',
        },
        {
          type: 'dropdown',
          label: 'Architecture',
          position: 'left',
          items: [
            {
              label: 'System & Networks',
              to: 'docs/category/system--networks',
            },
            {
              label: 'Infrastructure As Code',
              to: 'docs/architecture/iac/ansible-role',
            }
          ],
        },
        {
          type: 'dropdown',
          label: 'Security',
          position: 'left',
          items: [
            {
              label: 'Protocols',
              to: 'docs/security/protocols/intro',
            },
          ]
        },
        {
          label: 'Tooling',
          to: 'docs/tooling/lazygit',
          position: 'left',
        },
        { to: '/ai', label: 'AI', position: 'left' },
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://github.com/le-moment-it/website',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/le-moment-it/website',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Le Moment IT`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
