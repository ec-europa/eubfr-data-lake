# PR description

Please drop a few lines about the PR: what it does, how to test it, etc.

## QA Checklist

When you add a new ETL/producer, please check for the following:

- [ ] Ensure the ETL is added to the corresponding `scripts/` for automated deployment and deletion
- [ ] There is at least 1 unit test with a jest snapshot for the transform function of the ETL
- [ ] Update the file PRODUCERS_DATA_AVAILABILITY_GRID.md indicating which fields are available in source data of ETL
- [ ] Ensure there is (flow/jsdocs) documentation in the `tranform.js` file which is to be used for automated documentation
- [ ] Generate the necessary documentation pages for the new ETL by `yarn docs:md`
- [ ] Ensure `getAvailableServices.js` is up-to-date
