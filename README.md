# maximus

# Requirements to run the project
- Node + NPM (16.15.0 LTS - https://nodejs.org/en/)
- Git (Windows Users - https://git-scm.com/downloads)

# Required editor for development
- Visual Studio Code (https://code.visualstudio.com/)

# Required Visual Studio (VS) Code Extensions
- Vue Language Features (Volar) - _Vue_
- ESLint - _Microsoft_
- TODO Highlight - _Wayou Liu_

# Visual Studio Code _settings.json_ for automatic linting with ESLint
```json
{
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "eslint.workingDirectories": [
        {
            "mode": "auto"
        }
    ],
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
- 
## Project setup
```
npm run install-all-deps
```

### Running the application (server + clent)
```
npm run dev
```

### Running the frontend (client)
```
cd client
npm install
npm run serve:low
```

### Compiles and minifies for production
```
npm run build:low
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
