import os
import random
import string
import time
from datetime import datetime
from threading import Thread

import tweepy
from django.core.files.storage import default_storage
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import TweetBotSerializer


class TweetBotAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = TweetBotSerializer

    def post(self: "TweetBotAPIView", request):
        print(request)
        serializer = TweetBotSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        api_key = data["api_key"]
        api_secret = data["api_secret"]
        bearer_token = data["bearer_token"]
        access_token = data["access_token"]
        access_token_secret = data["access_token_secret"]
        wait_time = data.get("wait_time", 30)
        content = data.get("content", "")
        media_file = data.get("media", None)
        use_random = data.get("random_string", True)

        media_path = None
        if media_file:
            media_path = default_storage.save(media_file.name, media_file)

        def generate_random_string():
            return "".join(random.choices(string.ascii_letters + string.digits, k=random.randint(8, 13)))

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

            tweet_text = content
            if use_random:
                tweet_text += "\n" + generate_random_string()

            try:
                if media_path:
                    full_media_path = os.path.join(default_storage.location, media_path)
                    media = api.media_upload(full_media_path)
                    client.create_tweet(text=tweet_text, media_ids=[media.media_id])
                else:
                    client.create_tweet(text=tweet_text)
            except Exception as e:
                print("Tweet failed:", e)

            current_time = datetime.now().strftime("%H:%M:%S")
            print(f"[{current_time}] Success. Waiting {wait_time}s.")
            time.sleep(wait_time)

        Thread(target=run_bot).start()
        return Response({"status": "Tweet scheduled"}, status=status.HTTP_200_OK)

    def get_view_name(self) -> str:
        return "TweetBot Api"

    def get_view_description(self, html=False) -> str:
        return "Send tweets with optional media and randomized string suffix."
