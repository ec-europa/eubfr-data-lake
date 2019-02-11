# GraphQL API

A layer on top of Elasticsearch to facilitate focused queries.

## Deployment

Because the only dependee of this resource is the Elasticsearch domain and endpoint, you can start off easily without deploying any services or demo dashboards.

If you are in the project root folder:

```sh
$ yarn deploy:resources
```

## Preparations

Before being able to work with the API locally, inside the folder of `@eubfr/resources-graphql` please run the following:

```sh
$ yarn run prep
```

This will deploy the service and its resources on AWS (if not yet done in the previous step) and then export the necessary environment variables locally to facilitate the work with the `serverless-offline` plugin.

## Start

Once the preparation is done, simply run:

```sh
$ yarn start
```

Now you can open `http://localhost:4000/graphql` GraphQL playground in your browser.

## Notes

There are a few workarounds which should be ideally improved in time.

1. The file `6_3.js`

It is used by `graphql-compose-elasticsearch` for generating resolvers and documentation based on doxygen documentation. This file is part of [apis folder](https://github.com/elastic/elasticsearch-js/tree/master/src/lib/apis) from the `elasticsearch` npm project. It can't be imported in the bundle because the [parser](https://github.com/graphql-compose/graphql-compose-elasticsearch/blob/master/src/ElasticApiParser.js#L72) relies on `fs` read and custom parsing.

Because lambda functions should not persist or rely on files which can disappear in runtime, a webpack plugin is used to add the file in the package.

2. A patch for `graphql-compose-elasticsearch`

It's making a few modifications in order ot allow for the library to make use of the `6_3.js` file mentioned in the previous point.

3. Webpack bundle

It's not minified on purpose. Because `graphql-compose-elasticsearch` is making an extensive use of classes, bundling causes issues with linking between class instances and their intended types.

For instance, [this](https://github.com/graphql-compose/graphql-compose-elasticsearch/blob/master/src/resolvers/search.js#L29) will be almost always an issue. In other AWS-related dependencies we can use `AWS.setSDKInstance(AWS_SDK);` to solve this issue, though the `graphql-compose-elasticsearch` doesn't seem to have one.
