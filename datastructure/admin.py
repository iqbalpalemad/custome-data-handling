from django.contrib import admin

from .models import Datastructure, dataTypeMapping,DatastructureData
# Register your models here.

class dataStructureDataTypeMapping(admin.TabularInline):
    model = dataTypeMapping
    extra = 0

class DatastructureAdmin(admin.ModelAdmin):
    def get_username(self, customer):
        return customer.user.username
    get_username.short_description = 'Username'

    def get_name(self, customer):
        return customer.user.first_name + " " + customer.user.last_name

    get_name.short_description = 'Name of user'

    def datastructure(self,Datastructure):
       return Datastructure.name

    datastructure.short_description = "Data structure name"


    list_display = [
        'datastructure',
        'get_username',
        'get_name',

    ]

    fields = [
        'user',
        'name',
    ]

    inlines = [
        dataStructureDataTypeMapping,
    ]


admin.site.register(Datastructure, DatastructureAdmin)
