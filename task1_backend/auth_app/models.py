from django.db import models
from django.contrib.auth.models import User
gender_choices=[('male','male'),
        ('female', 'Female'),
        ('other', 'Other'),
         ]
role_choices=[('admin','admin'),
              ('user','user')]
class UserProfile(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    full_name=models.CharField(max_length=100,null=True,blank=True)
    gender=models.CharField(max_length=10,choices=gender_choices,default='other',null=True,blank=True)
    # DOB=models.DateField(null=True,blank=True)
    phone=models.CharField(max_length=15,null=True,blank=True)
    address = models.TextField()
    location = models.CharField(max_length=100)
    # phone = models.CharField(max_length=15)
    linkedin = models.URLField()
    designation = models.CharField(max_length=100)
    role = models.CharField(max_length=50,choices=role_choices,default='user')

    def __str__(self):
     return self.user.username

status_choices=[
   ('completed','completed'),
   ('inprogress','inprogress')
]  
class Notes(models.Model):
    title=models.CharField(max_length=200)
    content=models.TextField()
    status=models.CharField(max_length=20,choices=status_choices,default='inprogress')
    created_at=models.DateTimeField(auto_now_add=True)
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name='notes')

    def __str__(self):
       return self.title