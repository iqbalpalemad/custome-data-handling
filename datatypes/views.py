from django.shortcuts import render
from .models import Datatype
from django.http import JsonResponse
# Create your views here.

def getAllDataTypes(request):
    datatTypes = Datatype.objects.all()
    datatTypeList = []
    for datatType in datatTypes:
        temp = {'name':datatType.name,'id':datatType.id}
        datatTypeList.append(temp)
    return JsonResponse(datatTypeList,safe=False)

	
