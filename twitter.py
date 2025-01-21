import tweepy
import time
import random
import string
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv('api_key')
api_secret = os.getenv('api_secret')
bearer_token = os.getenv('bearer_token')
access_token = os.getenv('access_token')
access_token_secret = os.getenv('access_token_secret')

wait_time = int(input("Set the delay between tweets (in seconds): "))
media_name = input("Name of media attachement (leave blank for no media upload): ")

def generate_random_string():
    letters = string.ascii_letters + string.digits
    random_string = ''.join(random.choice(letters) for _ in range(random.randint(8, 13)))
    return random_string

def bot():
    client = tweepy.Client(bearer_token, api_key, api_secret, access_token, access_token_secret)
    auth = tweepy.OAuth1UserHandler(api_key, api_secret, access_token, access_token_secret)
    api = tweepy.API(auth)
    
    def check_media():
        if media_name:     
            media = api.media_upload(media_name)
            media_id = media.media_id
            return media_id
        return False
        
    with open("content.txt", 'r', encoding='utf-8') as f:
        content = f.read()
        current_time = datetime.now().strftime("%H:%M:%S")

        print(f"[{current_time}] Uploading...")

        if check_media():
            client.create_tweet(
                media_ids=[check_media()],
                text = content+ "\n" + generate_random_string()
            )
        else:
            client.create_tweet(
                text = content+ "\n" + generate_random_string()
            )

        print(f"[{current_time}] Success, waiting {wait_time}s.")

        time.sleep(wait_time)
    bot()
bot()