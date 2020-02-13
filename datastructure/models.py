from django.db import models
from django.conf import settings
import jsonfield
from datatypes.models import Datatype
# Create your models here.

class Datastructure(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.name

class dataTypeMapping(models.Model):
    datastructure = models.ForeignKey(Datastructure, on_delete=models.CASCADE)
    name = models.CharField(max_length=128)
    datatype     = models.ForeignKey(Datatype, on_delete=models.CASCADE)


    def __str__(self):
        return self.datastructure.name

    # class Meta:
    #     unique_together = ('datastructure', 'datatype',)

