# Environment variables

In the following guide, you will find detailed information about how to use environment variables to manage a given staging environment of the project.

In order to reuse AWS resources and keep complexity levels low, each developer works within a contained working environment called stage. After work has been approved, changes are merged to upstream master and it gets deployed to a set of fixed stages: `test`, acting as staging before production, and `prod`.

## Scope of operations

There are generally two types of operations of interest in the project: deployment and management.

Deployment operation is a basic operation which happens frequently on an atomic level.

Management operations, such as content, resource and service management happen mostly when a developer needs to apply granular control over his working environment while testing his work.

## Basic configurations

Here's a list of the required variables which one should set in order to be able deploy an environment:

```sh
export EUBFR_ENV=dev
export EUBFR_STAGE=chernka123
export EUBFR_USERNAME=cordis
```

Setting `EUBFR_USERNAME` will tell the EUBFR CLI to work only with assets related to this particular producer. This way, running deployment scripts, you'll get a working environment faster for CORIS, leaving out AGRI, HOME, etc.

## Management configurations

Here's a list of settings separated by their target goals:

### Content management

Upload:
SIGNED_UPLOADS_API

Show:
REACT_APP_STAGE
REACT_APP_ES_PRIVATE_ENDPOINT

Delete:
DELETER_API
REACT_APP_ES_PRIVATE_ENDPOINT
