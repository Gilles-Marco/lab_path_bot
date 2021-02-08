
exports.GuildManager = class {

    constructor(){
        this.config = {}
    }

    setDefaultChannelOutput(guild, channel_name){
        this.config[guild] = {default_channel: channel_name};
    }

    getDefaultChannelOutput(guild){
        if(Object.keys(this.config).includes(guild)){
            if(Object.keys(this.config[guild]).includes('default_channel'))
                return this.config[guild].default_channel
            else return null
        }
        return null
    }

}