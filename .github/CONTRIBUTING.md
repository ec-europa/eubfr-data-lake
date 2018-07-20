# Contribution guidelines

## Git conventions

Please follow [our Git conventions](https://github.com/ec-europa/europa-component-library/blob/master/docs/conventions/git.md) for naming your branches and commits.

## PR description

Please fill in the description following the template.

## Release process

1.  Each merged PR should be labeled with one of the [labels](https://github.com/ec-europa/eubfr-data-lake/labels) named `tag: ...` to indicate what kind of change it is.

2.  Create a change log entry for the release:

    - You'll need an [access token for the GitHub API](https://help.github.com/articles/creating-an-access-token-for-command-line-use/). Save it to this environment variable: `export GITHUB_AUTH="..."`
    - Run `npm run changelog`. The command will find all the labeled pull requests merged since the last release and create a change log entry with all the changes and links to PRs and their authors. Copy and paste it to `CHANGELOG.md`.

3.  Merge the changelog update.

4.  Pull the latest `master` branch.

5.  **Do not run `npm publish`. Instead, run `npm run publish`.**

6.  The CLI will ask for a confirmation about the new package versions. Please verify them carefully before accepting.

7.  Once you have accepted, the script will start publishing the packages to npm and creating the git tags.

8.  Finally, create a GitHub Release with the same text as the changelog generated at step 2.
