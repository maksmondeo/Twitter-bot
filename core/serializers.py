from rest_framework import serializers


class TweetBotSerializer(serializers.Serializer):
    api_key = serializers.CharField()
    api_secret = serializers.CharField()
    bearer_token = serializers.CharField()
    access_token = serializers.CharField()
    access_token_secret = serializers.CharField()
    wait_time = serializers.IntegerField(default=30)
    random_string = serializers.BooleanField(default=True)
    content = serializers.CharField()
    media = serializers.FileField(required=False)
