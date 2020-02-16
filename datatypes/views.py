from django.shortcuts import render
from .models import Datatype
from django.http import JsonResponse
from datastructure.models import Datastructure,dataTypeMapping
# Create your views here.

def getAllDataTypes(request):
    datatTypes = Datatype.objects.all()
    datatTypeList = []
    for datatType in datatTypes:
        temp = {'name':datatType.name,'id':datatType.id}
        datatTypeList.append(temp)
    return JsonResponse(datatTypeList,safe=False)

def test(request):
    ds = dataTypeMapping.objects.filter(datastructure__user__username='test_user')
    r ={};
    for d in ds:
        print(d.datastructure.name)
        temp = [{'fieldName':d.name,'dataTypeName':d.datatype.name,'id':d.id}]
        if d.datastructure.name in r:
            r[d.datastructure.name].extend(temp)
        else:
            r[d.datastructure.name] = temp

    print(r)
    return JsonResponse(r,safe=False)


	
