# Generated by Django 4.1.1 on 2023-10-30 15:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assessments', '0002_assessmentresponse_delete_asessmentresponse'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assessment',
            name='assessment_id',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='assessmentquestion',
            name='assessment_question_id',
            field=models.CharField(default='', max_length=100),
        ),
    ]
