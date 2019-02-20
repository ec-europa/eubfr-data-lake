# Automation

Automation is achieved with [Drone](https://docs.drone.io/). The `.drone.yml` file describes the pipeline, whereas `docker-compose.yml` provides the means for development and testing of the automation infrastructure to a given machine.

## Requirements

Current configuration file requires the following tools for working locally with the automation system:

- [Drone 0.8](https://0-8-0.docs.drone.io/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Gitlab Application](https://docs.drone.io/intro/gitlab/single-machine/)
- [ngrok](https://ngrok.com/)

You could choose a different instrument for exposing your local server and port to the external world (instead of `ngrok`), and you could also use [Github application](https://docs.drone.io/intro/github/single-machine/) integration, for which you will need to also [modify the configuration file](https://0-8-0.docs.drone.io/install-for-github/) accordingly.

## Environment variables

Here's a list of the environment variables used by the setup, for which you will need to prepare and set values for:

- `DRONE_HOST`: set to the address given by `ngrok`, i.e. `http://ada4e47d.ngrok.io`
- `DRONE_GITLAB_CLIENT`: set to value taken from Gitlab's application `Application ID`
- `DRONE_GITLAB_SECRET`: set to value taken from Gitlab's application `Secret`
- `DRONE_SECRET`: set to any value of your choice

For the EUBFR CLI to operate correctly, please also specify the following variables:

- `EUBFR_ENV`
- `EUBFR_STAGE`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `EUBFR_AWS_REGION`
- `EUBFR_CONTENT_REPOSITORY`

For detailed explanations about these, please refer to [this guide](https://github.com/ec-europa/eubfr-data-lake/blob/master/tools/eubfr-cli/docs/ENVIRONMENT_VARIABLES.md).

## Setup

Here's a brief list of steps you need to take in order to start the automation infrastructure locally.

### Share local protocol and port

Simply run:

```
$ ngrok http 80
```

This will start sharing your local `http` protocol via port 80. You will receive an address like `http://ada4e47d.ngrok.io`

This is necessary in order to enable integration between locally-run Drone server and external Oauth2 providers such as Gitlab or Github.

### Create Oauth2 application

Go to [Gitlab applications console](https://gitlab.com/oauth/applications) and create a new item. Name is not important.

Set `Redirect URI` to be `http://ada4e47d.ngrok.io/authorize` giving the application `api` and `read_user` permissions in `Scopes`.

When the application is created, save the values of `Application ID` and `Secret`.

### Start Drone

Create a file `.env` in the root folder. Inside, set the appropriate values:

```
DRONE_HOST=http://ada4e47d.ngrok.io
DRONE_GITLAB_CLIENT=value of Application ID
DRONE_GITLAB_SECRET=value of Secret
DRONE_SECRET=value of your preference
```

The, run the following:

```sh
$ docker-compose up
```

When the server is running, open `http://ada4e47d.ngrok.io` in your browser and authorize the application.

When authorized, [activate the project](https://0-8-0.docs.drone.io/getting-started/) in the web UI.

This activate is necessary for you to be able to configure the secrets and make use of the hooks attached for changes to trigger builds in the Drone automation system.

### Secrets

From the web console of your project, i.e. `http://ada4e47d.ngrok.io/you/eubfr-data-lake/settings/secrets`, set the following:

- `aws_access_key_id`
- `aws_secret_access_key`
- `eubfr_aws_region` - optional
- `eubfr_content_repository` - optional
- `eubfr_env`
- `eubfr_stage`
- `eubfr_username` - optional

Values for these secrets come from the same reference as if you'd seek for the values of the environment variables with the same names in uppercase. (refer to upper section about the environment variables)

### Checking results

At this point, you can either push changes to the remote origin of Gitlab's repository, or run the pipeline via the Drone agent.

Results are available at: `http://ada4e47d.ngrok.io/you/eubfr-data-lake`
