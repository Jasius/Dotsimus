# Requirements

1. Create an .env file and provide required tokens and keys as per example below.

```js
BOT_TOKEN=TOKEN
BOT_TOKEN_DEV=STAGING_TOKEN
DB_HOST=DB
DB_HOST_DEV=STAGING_DB
PERSPECTIVE_KEY=KEY
DEVELOPMENT=false
SENTRY_DSN=SENTRY_KEY
OWNER=BOT_OWNER_ID
```

2. Add bot to your server https://discordapp.com/oauth2/authorize?&client_id=YOUR_CLIENT_ID_HERE&scope=bot&permissions=0

3. Run `npm install && npm start`.

# Features

* The bot responds to `!toxic <phrase>` with an assessment about whether the phrase is toxic.
* The bot automatically warns a user when it is sufficiently confident that they have sent a toxic message.
