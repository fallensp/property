const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repoFromEnv = process.env.GITHUB_REPOSITORY?.split('/')?.[1];
const explicitBasePath = process.env.NEXT_PUBLIC_BASE_PATH;

// Detect the correct basePath/assetPrefix so GitHub Pages deployments serve
// nested routes such as /listing/create correctly. This prefers an explicit
// NEXT_PUBLIC_BASE_PATH override, but falls back to inferring the repository
// name when running inside the GitHub Pages build environment.
const normalizedBasePath = (() => {
  if (explicitBasePath && explicitBasePath !== '/') {
    const cleaned = explicitBasePath
      .split('/')
      .filter(Boolean)
      .join('/');

    return cleaned ? `/${cleaned}` : '';
  }

  if (isGithubPages && repoFromEnv) {
    return `/${repoFromEnv}`;
  }

  return '';
})();

const hasBasePath = normalizedBasePath.length > 0;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: hasBasePath ? normalizedBasePath : undefined,
  assetPrefix: hasBasePath ? normalizedBasePath : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error'] }
        : false
  }
};

export default nextConfig;
