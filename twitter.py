import os
import random
import string
import time
from datetime import datetime
from threading import Thread

import tweepy
from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt


@method_decorator(csrf_exempt, name="dispatch")
class TweetBotView(View):
    def post(self: "TweetBotView", request) -> JsonResponse:
        # Get data from POST
        api_key = request.POST.get("api_key")
        api_secret = request.POST.get("api_secret")
        bearer_token = request.POST.get("bearer_token")
        access_token = request.POST.get("access_token")
        access_token_secret = request.POST.get("access_token_secret")
        wait_time = int(request.POST.get("wait_time", 30))
        content = request.POST.get("content", "")
        media_file = request.FILES.get("media", None)

        media_path = None
        if media_file:
            media_path = default_storage.save(media_file.name, media_file)

        def generate_random_string():
            letters = string.ascii_letters + string.digits
            return "".join(random.choice(letters) for _ in range(random.randint(8, 13)))

        def run_bot():
            client = tweepy.Client(
                bearer_token=bearer_token,
                consumer_key=api_key,
                consumer_secret=api_secret,
                access_token=access_token,
                access_token_secret=access_token_secret,
            )
            auth = tweepy.OAuth1UserHandler(api_key, api_secret, access_token, access_token_secret)
            api = tweepy.API(auth)

            current_time = datetime.now().strftime("%H:%M:%S")
            print(f"[{current_time}] Uploading...")

            try:
                if media_path:
                    full_media_path = os.path.join(default_storage.location, media_path)
                    media = api.media_upload(full_media_path)
                    client.create_tweet(
                        text=content + "\n" + generate_random_string(),
                        media_ids=[media.media_id],
                    )
                else:
                    client.create_tweet(text=content + "\n" + generate_random_string())
            except Exception as e:
                print("Tweet failed:", e)
            print(f"[{current_time}] Success. Waiting {wait_time}s.")
            time.sleep(wait_time)

        # Run bot asynchronously
        Thread(target=run_bot).start()

        return JsonResponse({"status": "Tweet scheduled"})
