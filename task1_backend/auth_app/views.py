from django.shortcuts import render

from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics

from rest_framework import status
from .serializers import *
from .models import *
from rest_framework.permissions import IsAuthenticated
from .mixins import *
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username=request.data.get('username')
    password=request.data.get('password')
    if User.objects.filter(username=username).exists():
        return custom404(request,"Username already exists")
    user=User.objects.create_user(username=username,password=password)
    return custom200("User created successfully",{'username':user.username})

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login successful',
            'username': user.username,
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
class ProfileViewPost(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return UserProfile.objects.filter(user=self.request.user).first()

    def get(self, request, *args, **kwargs):
        profile = self.get_object()
        if profile:
            serializer = self.get_serializer(profile)
            return custom200("Profile retrieved successfully", serializer.data)
        else:
            return custom404(request, "Profile not found")

    def post(self, request, *args, **kwargs):
        if self.get_object():
            return custom404(request, "Profile already exists")
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return custom200("Profile created successfully", serializer.data)
        else:
            return custom404(request, serializer.errors)


class ProfileViewPatch(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        profile_id = self.kwargs.get('id')
        try:
            return UserProfile.objects.get(id=profile_id)
        except UserProfile.DoesNotExist:
            return None

    def patch(self, request, *args, **kwargs):
        profile = self.get_object()
        if not profile:
            return custom404(request, "Profile not found")
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return custom200("Profile updated successfully", serializer.data)
        else:
            return custom404(request, serializer.errors)

    def delete(self, request, *args, **kwargs):
        profile = self.get_object()
        if not profile:
            return custom404(request, "Profile not found")
        profile.delete()
        return custom200("Profile deleted successfully")


class NotesViewPost(generics.ListCreateAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=NotesSerializer
    def get_queryset(self):
        user=self.request.user
        try:
            profile=user.userprofile
            if profile.role=='admin':
                return Notes.objects.all()
            else:
                return Notes.objects.filter(user=user)
        except UserProfile.DoesNotExist:
            return Notes.objects.none()
        return Notes.objects.all().order_by('-created_at')
    def get(self,request,*args,**kwargs):
        queryset=self.get_queryset()
        serializer=self.get_serializer(queryset,many=True)
        return custom200("Notes retrieved successfully",serializer.data)
    def post(self,request,*args,**kwargs):
        serializer=self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return custom200("Data created successfully",serializer.data)
        else:
            return custom404(request,serializer.errors)
    
class NotesViewPatch(generics.RetrieveUpdateDestroyAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=NotesSerializer
    def get_queryset(self):
        return Notes.objects.all()
    def get_object(self):
        note_id=self.kwargs.get('id')
        try:
            return Notes.objects.get(id=note_id)
        except Notes.DoesNotExist:
            return None
    def get(self,request,*args,**kwargs):
        note=self.get_object()
        if not note:
            return custom404(request,"Note not found")
        serializer=self.get_serializer(note)
        return custom200("Note retrieved successfully",serializer.data)
    def patch(self,request,*args,**kwargs):
        note=self.get_object()
        if not note:
            return custom404(request,"Note not found")
        serializer=self.get_serializer(note,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return custom200("Note updated successfully",serializer.data)
        else:
            return custom404(request,serializer.errors)
    def delete(self,request,*args,**kwargs):
        note=self.get_object()
        if not note:
            return custom404(request,"Note not found")
        else:
          note.delete()
          return custom200("Note deleted successfully")
        

class UserFilterNotes(generics.ListAPIView):
    serializer_class=NotesSerializer
    def get_queryset(self):
        queryset=Notes.objects.all()
        username=self.request.query_params.get('username',None)
        status=self.request.query_params.get('status',None)
        if username:
            queryset=queryset.filter(user__username__icontains=username)
        
        if status:
            queryset=queryset.filter(status__icontains=status)
        return queryset

class NotesCount(generics.ListAPIView):
   
    permission_classes=[IsAuthenticated]
    def get(self,request):
        total_notes=Notes.objects.all().count()
        completed_notes=Notes.objects.filter(status='completed').count()
        inprogress_notes=Notes.objects.filter(status='inprogress').count()
        return Response({
            "total_notes": total_notes,
            "completed_notes": completed_notes,
            "inprogress_notes": inprogress_notes
        })