# Generated by Django 4.1.1 on 2023-09-08 06:06

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Chatlog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('conversation_id', models.CharField(max_length=100)),
                ('chatlog_id', models.CharField(max_length=100)),
                ('time', models.DateTimeField(default=datetime.datetime.now)),
                ('is_user', models.BooleanField()),
                ('chatlog', models.TextField(max_length=3000)),
                ('status', models.CharField(blank=True, max_length=1, null=True)),
            ],
        ),
    ]
