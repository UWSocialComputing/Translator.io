## Overview 

Translator.IO is a powerful Discord bot designed to overcome language barriers within Discord servers. With Translator.IO, you can effortlessly communicate with users from different linguistic backgrounds, enabling inclusive and engaging conversations. Key features include:

- Automated Channel Translation: Translate all messages within a channel, ensuring every user can understand and actively participate in discussions, regardless of their native language.

- Private Message Translation: Seamlessly translate individual messages privately, promoting accurate and fluid communication on a personal level.

- Announce a Message: Personalize your message delivery by selecting preferred languages for translation, ensuring your announcements reach the intended audience in their native language.

- Language Matchmaking: Discover other users who speak the same language as you, fostering connections and facilitating meaningful interactions within the Discord community.

Translator.IO is an indispensable tool for diverse communities, international teams, language learners, and anyone looking to bridge language gaps on Discord. Experience the joy of smooth multilingual communication with Translator.IO today!

Get started with Translator.IO and create a more inclusive and connected Discord server.

## How to setup

### Part 1

- Clone the repository to your local computer.
- In `./src` create a file called `config.json` and fill it with the following fields.
  - Right now, there will be a lot of fields missing. As you go through the setup these will get filled.
``` {
    "token": "PUT_DISCORD_APP_TOKEN_HERE",
    "clientId": "PUT_DISCORD_CLIENT_ID_HERE",
    "apiKey": "PUT_DEEPL_API_KEY_HERE",
    "dialect": "mssql",
    "host": "PUT_AZURE_DATABASE_HOST_NAME_HERE",
    "database": "PUT_SQL_DATABASE_NAME_HERE",
    "username": "PUT_ADMIN_USERNAME_HERE",
    "password": "PUT_ADMIN_PASSWORD_HERE",
    "port": 1433
}
```

### Part 2

Creating a Discord application to get the `token` and `clientId`.

- Go to `https://discord.com/developers/docs/intro`.
- Click on `Applications` on the left side bar.
- Sign into your Discord account if you haven't done so already.
- Click `New Application` and give your application a name.
- Go to `bot` and click `reset token`.
- A token will generate which you should put in `config.json` for the `token` field.
  - A token is a essentially a password so keep it private. For example, don't push it to your public repository.
- Go to `OAuth2` and copy the `Client ID`.
- Replace `clientId` in `config.json` with the copied value.

### Part 3

Setting up a SQL Database on Azure.

- Follow the instruction on this video `https://www.youtube.com/watch?v=6joGkZMVX4o&ab_channel=JieJenn` to setup your database.
- Fill in `host`, `database`, `username`, and `password` which are located in the Azure portal.


### Part 4

Getting DeepL API Key

- Create an account for DeepL (A translation service).
- Replace `apiKey` in `config.json` with the API Key in DeepL.

### Part 5

Running Translator.io

- Run `npm run build` to install any dependencies and deploy the commands.
- Run `npm run start` to start running the bot.


## Using Translator.io in your Discord Server

- Here is the invite link for Translator.io: `https://tinyurl.com/translator-io`.
- Add it to your desired Discord Server


This repo will serve as a place to both collaborate on code with your group members as well as create your blog sites for your projects. It contains a `_config.yml` file that automatically turns your `README.md` files into webpages hosted on GitHub pages. 

Please refer to the README in [this repo](https://github.com/nicolas-van/easy-markdown-to-github-pages) for more on the markdown to webpage generation process. Most of the steps have already been done for you, so the most relevant content will likely be in the User Guide and the sections following that. 

If you want to change the site's Jekyll template and/or add custom CSS, please refer to [this guide](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/adding-a-theme-to-your-github-pages-site-using-jekyll).

You may also find this [GitHub markdown cheatsheet](https://www.markdownguide.org/cheat-sheet) handy.
