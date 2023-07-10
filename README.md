# maximus

# Requirements to run the project

- Node + NPM (18.15.0 LTS - https://nodejs.org/en/)
- Git (Windows Users - https://git-scm.com/downloads)

# Required editor for development

- Visual Studio Code (https://code.visualstudio.com/)

# Required Visual Studio (VS) Code Extensions

- Vue Language Features (Volar) - _Vue_
- ESLint - _Microsoft_
- Prettier - _Prettier_
- TODO Highlight - _Wayou Liu_

# Visual Studio Code _settings.json_ for automatic linting with ESLint

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.workingDirectories": [
    {
      "mode": "auto"
    }
  ],
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "javascript.updateImportsOnFileMove.enabled": "always"
}
```

# Recommended Visual Studio (VS) Code Extensions

- JavaScript (ES6) code snippets - _charalampos karypidis_
- Vue VSCode Snippets - _sarah.drasner_
- Tailwind Intellisense - _Tailwind Labs_
- Auto Rename Tag - _Jun Han_
- npm Intellisense - _Christian Kohler_
- Path Intellisense - _Christian Kohler_
- Material Icon Theme - _Philipp Kief_
- Project Manager - _Alessandro Fragnani_
- Night Owl - _sarah.drasner_

## Project setup

### Running the frontend in offline mode (must be in client folder)

```
cd client
npm install
npm run dev:offline
```

### Compiles and minifies for production in offline mode (must be in client folder)

```
npm run build:offline
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Docker setup

### Prerequistes

- Install Docker & Docker-Compose (https://docs.docker.com/get-docker/)
- (Optional) Install a MongoDB Client (MongoDB Compass - https://www.mongodb.com/try/download/compass)
- UDev2Dev .p12 certificate must be installed in browser (for auth)

### Building the Container Images

```
docker-compose build
```

### Running the Containers

```
docker-compose up
# App is running on https://localhost:8443
# Server (Node.js + Express.js) is running on localhost:3000
# MongoDB is running on localhost:27017
```

### Building & Running the Containers Together

```
npm install
npm start
```

### Stopping the Containers

```
docker-compose stop # this will safely maintain data in your MongoDB database container
```

### Destroying the Containers

```
docker-compose down # this will delete any data persisted in your MongoDB database container
```

### Destroying all containers, volumes, and images

```
docker system prune -a --volumes
```

## How to run Sonar Analysis

Until Jenkins and CI can be setup, these instructions will allow for the running of the sonar-scanner locally to push
analysis to SonarQube.

### Prerequisites

#### Install sonar-scanner

The binary for sonar-scanner can be downloaded from https://docs.sonarqube.org/latest/analyzing-source-code/scanners/sonarscanner/.
If using a mac, then it can be installed through homebrew also.

#### Sonar Token

```
export SONAR_TOKEN=...token provided offline...
```

#### Java Keystore

Your _.p12 certificate will need to be converted to a _.jks. The following command will ask for the p12 password and a
password for the new jks.

```
keytool -v -importkeystore -srckeystore <username>.p12 -srcstoretype PKCS12 -destkeystore <username>.jks
```

#### Sonar Options

```
export SONAR_SCANNER_OPTS="-Djavax.net.ssl.keyStore=<path-to-jks> -Djavax.net.ssl.keyStorePassword=<jks-password>"
```

### Running analysis

Note: It is recommended to run `npm run lint:ci` from the `client` directory prior to running the following in order to
have sonarqube use the project's eslint rules

From the project root:

```
npm run sonar
```

Analysis can then be viewed from https://sonarqube.udev2dev.com/dashboard?id=mxs-devsandbox
