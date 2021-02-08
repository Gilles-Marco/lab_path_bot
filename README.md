# If you want to invite the bot on your server click here

https://discord.com/api/oauth2/authorize?client_id=808310059222302740&permissions=257024&scope=bot

# Installation

You need to install nodejs in order to execute the bot and npm to install his dependencies

```sh
git clone https://github.com/Gilles-Marco/lab_path_bot.git
cd lab_path_bot
npm install
```

## Configuration

You will now have to configure the .env file

### Discord

https://discord.com/developers/applications
Create a discord app

Go to Bot
Click on "Click to reveal token" copy the token and put it in DISCORD_TOKEN in the .env file

### Reddit

https://www.reddit.com/prefs/apps

Create a 'use script'

Take his clientId and secret and put it in .env
You will have to fill your username and password reddit account in the .env

## Run the bot

```
npm run prod
```

# Command

lab_path_bot set_channel_output <channel_name>