# GraphQL API

A layer on top of Elasticsearch to facilitate focused queries.

## Deployment

Because the only dependee of this resource is the Elasticsearch domain and endpoint, you can start off easily without deploying any services or demo dashboards:

```sh
$ yarn deploy:resources
```

## Flag local

```sh
$ export IS_LOCAL=true
```

This should be automatically set by the serverless framework when functions are invoked locally, but the serverless offline plugin seems to miss that.

## Start server

```sh
$ yarn start
```

Now you can open `http://localhost:4000/graphql` GraphQL playground in your browser.
