# maximus

# Requirements to run the project

- Node + NPM (16.15.0 LTS - https://nodejs.org/en/)
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

### Running the frontend (must be in client folder)

```
cd client
npm install
npm run serve:low
```

### Compiles and minifies for production (must be in client folder)

```
npm run build:low
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

### Building the Container Images

```
npm run install-all-deps # run from project root
docker-compose build
```

### Running the Containers

```
docker-compose up
# App is running on localhost:8080
# Server (Node.js + Express.js) is running on localhost:3000
# MongoDB is running on localhost:27017
```

### Stopping the Containers

```
docker-compose stop # this will safely maintain data in your MongoDB database container
```

### Destroying the Containers

```
docker-compose down # this will delete any data persisted in your MongoDB database container
```
