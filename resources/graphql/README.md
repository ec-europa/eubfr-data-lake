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
$ yarn run prepare
```

This will deploy the service and its resources on AWS (if not yet done in the previous step) and then export the necessary environment variables locally to facilitate the work with the `serverless-offline` plugin.

## Start

Once the preparation is done, simply run:

```sh
$ yarn start
```

Now you can open `http://localhost:4000/graphql` GraphQL playground in your browser.
