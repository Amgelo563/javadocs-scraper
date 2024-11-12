module.exports = {
  branches: ['main'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    ['@semantic-release/npm', { tarballDir: 'dist' }],
    ['@semantic-release/github', { assets: ['dist/*.tgz'] }],
    [
      '@semantic-release/git',
      {
        assets: 'CHANGELOG.md',
      },
    ],
  ],
};
