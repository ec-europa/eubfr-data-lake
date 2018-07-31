# Contribution guidelines

You'll need an [access token for the GitHub API](https://help.github.com/articles/creating-an-access-token-for-command-line-use/). Save it to this environment variable: `export GITHUB_AUTH="..."`

## Git conventions

Please follow [our Git conventions](https://github.com/ec-europa/europa-component-library/blob/master/docs/conventions/git.md) for naming your branches and commits.

## PR description

Please fill in the description following the template.

## Release process

1.  Each merged PR should be labeled with one of the [labels](https://github.com/ec-europa/eubfr-data-lake/labels) named `tag: ...` to indicate what kind of change it is.

2.  Pull the latest `master` branch.

3.  Create a change log entry for the release by running `npm run changelog`. The command will find all the labeled pull requests merged since the last release and create a change log entry with all the changes and links to PRs and their authors. Copy and paste it to `CHANGELOG.md`.

4.  Merge the changelog update.

5.  **Do not run `npm publish`. Instead, run `npm run publish`.**

6.  The CLI will ask for a confirmation about the new package versions. Please verify them carefully before accepting.

7.  Once you have accepted, the script will generate the necessary changes in the CHANGELOG file.

8.  Commit generated change log files and possibly reuse the information making a new release.
