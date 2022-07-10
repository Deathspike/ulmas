const packageData = require('../../package.json');

module.exports = async (github, context) => {
  await releasesAsync(github, context);
  await tagAsync(github, context);
};

async function releasesAsync(github, context) {
  const releasesResponse = await github.request('GET /repos/{owner}/{repo}/releases', context.repo);
  const releases = releasesResponse.data;
  for (const release of releases) {
    if (!release.tag_name.endsWith('-snapshot')) continue;
    const releaseId = release.id;
    await github.request('DELETE /repos/{owner}/{repo}/releases/{releaseId}', {releaseId, ...context.repo});
  }
}

async function tagAsync(github, context) {
  const tag = `v${packageData.version}-snapshot`;
  await github.request('DELETE /repos/{owner}/{repo}/git/refs/tags/{tag}', {tag, ...context.repo}).catch(() => {});
}
