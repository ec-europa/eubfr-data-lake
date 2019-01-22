# CSV parser

Used to facilitate local development work on CSV-related tasks for ETLs without the AWS services abstractions. To see options for the parser, please visit this [documentation page](https://csv.js.org/parse/).

Still, the code of this package is as close as possible to the original ETL, so in order to make use of it, webpack is still used to transpile the code through the serverless framework.

You would use this package at 2 stages of your development:

- Getting a stub for the tests in the given ETL (limit parser to 1 record)
- Validating that the transform function you've developed works properly on the whole (actual) file

## Installation

Please work with the dependencies as the other packages in the workspace. Do the install/uninstall from the package, but also ensure that running `yarn install` from the root of the workspace is done in order to symlink dependencies correctly.

## How to use

In order to keep the implementation code as close as possible to the one which will be deployed to AWS, but still make the service independent from AWS, you have to keep in mind the following concepts:

- Instead of using AWS S3, the `fs` read and write streams are used. API is very similar to S3 and sufficient for the sake of developing the given parser rules.
- The `transform.js` helper is given as example reference. You will need to change it with the current rules you've been developing separately in the ETL.
- The serverless service is used to compile the code before execution in order to enable ES6+ syntax and features available in the real ETLs.

### Add sample file

Add the file you want to test in the root of this package.

Change the variable `FILE` in the `serverless.yml` configuration.

### Update your transform function

In order to have actual assertion for the data you'll be testing, you should update the `/src/lib/transform.js` file with the current one from your ETL.

### Run the parser

Run a local invokation from the serverless framework, in the root of this package:

```sh
$ yarn serverless invoke local --function parseCsv
```

If the original file you'll be ingesting contains issues, you will see a message similar to this one:

```
Parsing error. Error: Invalid Record Length: header length is 622, got 623 on line 6003
```

Which could be solve by adding a `skip_lines_with_error` flag in the CSV parser.

There might be other issues which you can see for inconsistencies which you'd normally see only after deplying a lot of resources on AWS which could be tedious process.
