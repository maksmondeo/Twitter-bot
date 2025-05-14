from django.urls import path

from .views import TweetBotAPIView

urlpatterns = [
    path("tweet/", TweetBotAPIView.as_view(), name="tweet-bot"),
]
