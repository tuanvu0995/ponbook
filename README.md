# ponbook api server

> The ponbook api server

## Prerequisites

This project requires NodeJS (version >=16) with NPM PKM. We using mariadb as a primary database. Node and Yarn are really easy to install. To make sure you have them available on your machine, try running the following command.

```sh
$ npm -v && node -v
9.8.1
16.20.0
```

## Getting Started

```sh
git@github.com:catgamestudio/ponbook-api.git
cd ./ponbook-api
npm install
```

## Create env file

```sh
cp .env.example .env
```

## Build up database

```sh
node ace migration:run
```

## Generate sample data

```sh
node ace db:seed
```

## Contributing

Any contributions from the community are welcome.

Find a bug, a typo, or something that’s not documented well? We’d love for you to open an issue telling us what we can improve! Follow the [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

We love your pull requests! Check out our Good First Issue and Help Wanted tags for good issues to tackle. Check out our contributors guide for more information.

If you like what you see, star us on GitHub

## Roadmap

See the [ROADMAP.md](ROADMAP.md) file

## License

Copyright © 2023 CatGameStudio
