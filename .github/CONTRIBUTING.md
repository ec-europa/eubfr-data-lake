# Contribution guidelines

You'll need an [access token for the GitHub API](https://help.github.com/articles/creating-an-access-token-for-command-line-use/). Save it to this environment variable: `export GITHUB_AUTH="..."`

## Git conventions

Please follow [our Git conventions](https://github.com/ec-europa/europa-component-library/blob/master/docs/conventions/git.md) for naming your branches and commits.

## PR description

Please fill in the description following the template.

## Release process

1.  Each merged PR should have followed the Git conventions.

2.  Pull the latest `master` branch.

3.  **Do not run `npm publish`. Instead, run `npm run publish`.**

4.  The CLI will ask for a confirmation about the new package versions. Please verify them carefully before accepting.

5.  Once you have accepted, the script will generate the necessary changes in the CHANGELOG files.

6.  Commit generated change log files and possibly reuse the information making a new release.
