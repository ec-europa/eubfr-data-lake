# Quality analysis service

* takes information from harmonized file
* filters the fields available in a given record by `getAvailableProperties`
* generates a report for the number of occurrences of each field and its coverage with `getCoverageReport`, given a parameter providing info about the overall number of records

## Developing

Because the logic and rules behind the analysis will change in time, here are a few tips that would be useful for you when modifying and extending this service. You can work on helper functions separately from the lambda function.

* Go to the root of the service, i.e. `/eubfr-data-lake/services/ingestion/quality-analyzer`
* Select the helper you want to work on from `test/unit/lib` and open it in your editor
* Add a new `console.log(results)` line before or after `expect(results).toMatchSnapshot();` statement
* From the root folder, run `yarn test-write`

Now you can tweak the given helper function and changes will continuously be shown in the console. This workflow enables you to iterate on custom logic faster without spending unnecessary time with the lambda function.

Do not forget to remove `console.log` statements and update snapshots with `yarn test:unit -u` when you're happy with your results.
