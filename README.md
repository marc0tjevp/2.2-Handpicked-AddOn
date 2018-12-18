# 2.2-Handpicked-AddOn
Gmail Addon for Handpicked Labs.

## Installation

1. Clone the project with `git clone`
2. Go into the directory with `cd 2.2-Handpicked-Addon`
2. Run `npm i` to install all dependencies
3. Run `npm start` or use `nodemon` to start the server

## Folder Structure
```
.
├── config
│   └── config.json
├── controllers
│   └── example.controller.js
├── routes
│   └── example.routes.js
│   └── routes.js
├── utils
│   ├── database.util.js
│   └── extension.util.js
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## Conventions

### Language
- All variables, functions and comments should be in English
- All documentation for the API should be in English

### Code
- All variables, functions and comments should be in `lowerCamelCase`
- Make use of promises instead of callbacks when useful
- Make use of fat arrow functions, `function()` is deprecated
- Use a space after `//` for a comment, start a comment with an uppercase letter. `// For example: this`

### Files & Structure
- Use the folders for config, routes, utils and controllers respectively. Names of folders are plural (except for config).
- Name files `name.type.extension`. E.g. `user.routes.js`
- Use the singular forms of entities. E.g. `user`, `person`, `student`

### Routing
- Declare routing in `routes/routes.js` by declaring a controller for the parent link (`/users`). 
- Create a corresponding routing file for the children (`routes/user.routes.js`).
- Use controller functions as middleware

For questions about conventions, debate in the Discord server. Try to look for correct usage of these conventions when reviewing code or pull requests :D.