from django.urls import path

from .views import TweetBotAPIView

urlpatterns = [
    path("", TweetBotAPIView.as_view(), name="tweet-bot"),
]
