# Voyge Vault - TailwindCSS + Vite + Three.js Project

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above)
- docker io
- docker-compose

## Installation

First, clone the repository:

```bash
git clone <repository-url>
cd <repository-name>
```

Next, install the dependencies:

```
npm install
```

## Running the Development Server

To run the project in development mode:

```
bin/docker-compose run --rm --no-deps web npm install
bin/docker-compose up
```

This will start the Vite development server, and the project will be available at http://localhost:3000/. Thanks to Vite, you can expect lightning-fast HMR (Hot Module Replacement) as you develop.

## API for country data

We are using v2 of the api
```
https://restcountries.com/v2/all
https://github.com/apilayer/restcountries/

```

Made with ❤️ using TailwindCSS, Vite, and Three.js.


