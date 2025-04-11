from rest_framework import serializers
from .models import User, UserProfile,Notes

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserProfile
        fields='__all__'
        read_only_fields=['id','user']

class NotesSerializer(serializers.ModelSerializer):
    username=serializers.CharField(source='user.username',read_only=True)
    class Meta:
     model=Notes
     fields=['id', 'title', 'content', 'created_at', 'username','status']
     read_only_fields=['id','username','created_at']