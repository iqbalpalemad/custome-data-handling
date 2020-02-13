from django.db import models

# Create your models here.
from django.db import models

# Create your models here.
class Datatype(models.Model):
    id   = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128)

    def __str__(self):
        return self.name
