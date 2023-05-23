# maximus (client)

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
-

## Project setup

```

### Running the frontend in offline mode (must be in client folder)
```

cd client
npm install
npm run serve:offline

```

### Compiles and minifies for production (must be in client folder)
```

npm run build:offline

```

### Lints and fixes files
```

npm run lint

```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
```
