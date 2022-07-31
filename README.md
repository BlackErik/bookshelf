# bookshelf

## Project setup
```
npm install
```
## files to add
make sure there is a .env file in the root with your mondoDB-url set to SERVER_URL and sever port set to PORT. Then make a api.config.json file in root and asign the google api kei to API_KEY.

## .env file
```
SERVER_URL = <replace me with mongodb-url>

PORT = 3000

SESSION_SECRET = <replace me with secret>

GOOGLE_CLIENT_ID = <replace me>

GOOGLE_CLIENT_SECRET = <replace me>

GOOGLE_AUTH_REDIRECT_URL = <replace me>
```
## api.config.json file
```
{
    "API_KEY": <replace me with google api key>
}
```

### Compiles and hot-reloads for development
```
npm start
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### dev notes
1.	add to api file
2.	add a .env.local file