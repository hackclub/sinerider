# Sinerider Social Services / Links
### Project board - [link](https://github.com/orgs/hackclub/projects/33)

### Airtable base - [link](https://airtable.com/appRrAVVwcQpvGBnR/tbl6tTcTOLi9P1iPv/viwDm2dR5RvkTl0BF?blocks=hide)
- **Leaderboard** table - used to keep track of high scores that have been previously submitted to the service (includes invalid submissions), both for caching and UI presentation purposes.
- **Puzzles** table - used to keep track of the queued (unpublished) and active (published) puzzles.
- **RedditCheckedId** - Used for Reddit integration bookkeeping.
- **TwitterWorkQueue** - Used for Twitter integration bookkeeping.
- **Config** - Key/value table used for general service runtime configuration/bookkeeping

### Services

**sinerider-scoring** (node - web service - DigitalOcean)
[repo](https://github.com/JosiasAurel/sinerider-scoring) /
[deployment](https://cloud.digitalocean.com/apps/0f8f3315-d414-4857-862a-d6e5bacad0bc/overview)
 - Is NOT exposed to end-user traffic.  Exposes a /score endpoint that runs a Sinerider level using puppeteer/chrome and returns a scoring result (whether a level is completed within 30 seconds, time taken, etc).  Also returns a URL to a video showing the gameplay.

**sinerider-api** (node - web service - Heroku)
[repo](https://github.com/hackclub/sinerider-api) /
[deployment](https://dashboard.heroku.com/apps/sinerider-api)
- IS exposed to end-user traffic.  Exposes endpoints that allow for the retrieval and programming of daily puzzles.  Integrates with the Reddit and Twitter bots and orchestrates them.  A script that can be used to upload new random puzzles [here](https://github.com/hackclub/sinerider-api/blob/main/scripts/create_new_puzzles.py).

**sinerider-twitter-bot** (python - web service + worker - Heroku)
[repo](https://github.com/developedbytoby/sinerider-twitter-bot) /
[deployment](https://dashboard.heroku.com/apps/sinerider-twitter)
- Is NOT exposed to end-user traffic.  Has a worker and web service component.  The worker is responsible for polling Twitter for new relevant tweets, queueing work for later processing, dispatching work to the scoring service, and auto-responding to Twitter submissions.

**sinerider-reddit-bot** (node - web service + worker - Heroku)
[repo](https://github.com/GalaxyGamingBoy/sinerider-reddit-bot) /
[deployment](https://dashboard.heroku.com/apps/sinerider-reddit)
- Is NOT exposed to end-user traffic.  Has a worker and web service component.  The worker is responsible for polling Reddit for new relevant submissions, queueing work for later processing, dispatching work to the scoring service, and auto-responding to Reddit submissions.

**sinerider-leaderboard** (node - Vercel)
[repo](https://github.com/hackclub/sinerider-leaderboard) /
[deployment](https://vercel.com/hackclub/sinerider-leaderboard)
- IS exposed to end-user traffic.  It is the UI portion of the leaderboard.
