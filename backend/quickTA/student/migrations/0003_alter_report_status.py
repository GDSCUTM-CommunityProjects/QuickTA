# Generated by Django 4.1.1 on 2023-09-08 16:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0002_alter_conversation_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='report',
            name='status',
            field=models.CharField(default='O', max_length=1),
        ),
    ]
