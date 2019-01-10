# PR description

Please drop a few lines about the PR: what it does, how to test it, etc.

## QA Checklist

When you add a new ETL/producer, please check for the following:

- [ ] Ensure the ETL has been correctly setup following the guide in `services/ingestion/etl/README.md`
- [ ] There is at least 1 sample `record.json` and 1 unit test with a jest snapshot for the result of the transform function of the ETL.
- [ ] Ensure there is (flow/jsdocs) documentation in the transform function
- [ ] Generate the necessary documentation pages for the new ETL by `yarn docs:md`
