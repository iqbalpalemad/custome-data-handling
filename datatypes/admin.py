from django.contrib import admin
from .models import Datatype
# Register your models here.
class DatatypeAdmin(admin.ModelAdmin):
    pass


admin.site.register(Datatype, DatatypeAdmin)