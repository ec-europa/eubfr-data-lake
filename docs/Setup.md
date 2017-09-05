# Setup

## Requirements

*   `python` (both Python 2.x and 3.x supported)
*   `pip` (python package manager)
*   `Node.js`
*   `docker`

## Localstack

[Localstack's documentation](https://github.com/localstack/localstack#installing)

### Installing

```sh
pip install localstack
```

### Running

Start docker and:

```sh
LAMDBA_EXECUTOR=docker localstack start --docker
```

## Node

```sh
yarn
yarn run deploy
yarn run invoke
```
