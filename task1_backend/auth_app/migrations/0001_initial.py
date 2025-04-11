# Generated by Django 5.2 on 2025-04-07 07:37

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('DOB', models.DateField(blank=True, null=True)),
                ('address', models.TextField()),
                ('location', models.CharField(max_length=100)),
                ('phone', models.CharField(max_length=15)),
                ('linkedin', models.URLField()),
                ('designation', models.CharField(max_length=100)),
                ('role', models.CharField(max_length=50)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
