# EUBFR utilities library

Contains a set of topic-related helper functions which can be reused between several ETLs or other parts of the projects.

## Location

Contents:

- `getCountryCode`
- `extractLocationData`

### getCountryCode()

Small utility to translate country codes which are sometimes not maching an actual country code in third party services. For instance, it will turn `UK` to `GB`.

Useful in ETLs which contain information mostly related to Greece and the UK.

### extractLocationData()

In most cases, this piece of information is provided in the form of `x; y; z` or `x, y, z`, however there are exceptional cases where the string contains not only country codes, but also information about towns and regions.

The formats which are handled by the library are:

- `town, region, country code`
- `region, region, region, region [, region], country code`
- `region, region and region, country code`
- `town / region, country code`

Thus, we can't support:

- `region, region, country code`

Guidelines:

- Multiple locations should be split by `;`: `"Andalusia, ES; Glasgow, UK; Bremen, DE; Leeuwarden, NL"`
- Location items containing town and region should be ordered with specificity from left to right: `"Kontich, Antwerpen, BE"`
- If missing information, use holes with a comma: `, Antwerpen , BE"` or `"Kontich, , BE"`, this way your data will places in the right spots of the location structure. In the given example, Antwerpen will be treated as a region, even if a town is not provided and Kontich will be treated as a town even without Antwerpen being provided as a region.
- Including information about a town is more useful than a region, because it's more precise in terms of geolocation.

## ETL

Useful purely in the scope of an ETL. Focused on verifying the a given piece of information is valid taken from the signature of an AWS Lambda function (`(event, context)`)

### ensureExtension()

Checks whether an ingested file is a list of acceptable formats.

### extractMessage()

Get the message from the `event` of a lambda function.

### handleError()

Communicates errors withing a lambda function to both AWS infrastructure (`throw`) and to the user with the help of a messenger client.

## Budget

A set of functions to work with budgetary information.
