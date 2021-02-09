const fs = require('fs')

exports.GuildManager = class {

    constructor(storageFile = "storage.json"){
        this.STORAGE_FILE_NAME = storageFile
        this.readConfig()
    }

    setDefaultChannelOutput(guild, channel_name){
        this.config[guild] = {default_channel: channel_name}
        this.saveConfig();
    }

    getDefaultChannelOutput(guild){
        if(Object.keys(this.config).includes(guild)){
            if(Object.keys(this.config[guild]).includes('default_channel'))
                return this.config[guild].default_channel
            else return null
        }
        return null
    }

    removeGuild(guild){
        delete this.config[guild];
        this.saveConfig();
    }

    isStorageExist(){
        return fs.existsSync(this.STORAGE_FILE_NAME)
    }

    saveConfig(){
        fs.writeFileSync(this.STORAGE_FILE_NAME, JSON.stringify(this.config));
    }

    readConfig(){
        if(this.isStorageExist())
            this.config = JSON.parse(fs.readFileSync(this.STORAGE_FILE_NAME))
        else
            this.config = {}
    }

}