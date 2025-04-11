from django.urls import path
from .views import *

urlpatterns=[
    path('register/',register_view,name='register'),
    path('login/',login_view,name='login'),
    path('profile_post/',ProfileViewPost.as_view(),name='profilePost'),
    path('profile/<int:id>/', ProfileViewPatch.as_view(), name='profile-patch-delete'),
    path('notes_post/',NotesViewPost.as_view(),name='notesPost'),
    path('notes/<int:id>/',NotesViewPatch.as_view(),name='notes-patch-delete'),
    path('filter-notes/',UserFilterNotes.as_view(),name='filter-notes'),
    path('notes-count/',NotesCount.as_view(),name='notes-count')
]