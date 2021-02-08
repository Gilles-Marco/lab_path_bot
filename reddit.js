const snoowrap = require('snoowrap');

exports.RedditClient = class {

    constructor(username, password, clientId, secret){
        // this.INTERVAL = 1000
        this.INTERVAL = 60000
        this.subreddit = []
        this.queue = []
        this.instance = new snoowrap({
            userAgent: "Subscribe to subreddit and post new posts in a discord channel",
            username: username,
            password: password,
            clientId: clientId,
            clientSecret: secret,
        })

        this.instance.getMe().then((result)=>{
            console.log(`Logged in reddit.com as ${result.name}`);
        })

        this.daemon = null;
    }

    subscribeToSubReddit(subredditName, handler){
        this.subreddit.push({name: subredditName, handler: handler});
        this.syncWithSubReddit()
    }

    syncWithSubReddit(){
        try {
            clearInterval(this.daemon);
        }
        finally{
            this.daemon = setInterval(()=>{
                this.subreddit.forEach((subreddit) => {
                    this.instance.getSubreddit(subreddit.name).getHot().then(result=>{
                        let posts = result.map(post => {
                            let p = {
                                id: post.id,
                                title: post.title,
                                content: post.selftext,
                                image: post.url,
                                creationDate: new Date(post.created*1000),
                                link: `https://reddit.com${post.permalink}`,
                                author: post.author.name
                            }
                            return p
                        })
        
                        subreddit.handler(posts);
                    })
                })
            }, this.INTERVAL)
        }
        
    }

}