# Generated by Django 2.2 on 2020-02-15 10:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('datastructure', '0007_datastructuredata'),
    ]

    operations = [
        migrations.CreateModel(
            name='fileData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='uploads/')),
            ],
        ),
    ]
