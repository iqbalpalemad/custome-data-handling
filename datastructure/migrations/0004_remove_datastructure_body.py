# Generated by Django 2.2 on 2020-02-13 12:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('datastructure', '0003_datatypemapping'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='datastructure',
            name='body',
        ),
    ]