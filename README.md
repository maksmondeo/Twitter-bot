# Twitter/X.com Bot (with Media Upload)

This Python script automates posting tweets on Twitter/X.com. It reads tweet content from a file (`content.txt`), and optionally uploads media attachments. The script uses the Tweepy library to interact with the Twitter API.

## ATTENTION ⚠️
Currently, a random string is being added at the end of your tweet - that's because **your tweet will get shadowbanned** if it's going to be 1:1 replica of one of your tweets.

## Requirements
- Tweepy library
- A Twitter Developer account for API credentials (at this moment 100 tweets per day are free)
- A `.env` file containing your Twitter API credentials