from django.shortcuts import render
from .models import Datastructure,dataTypeMapping
from users.models import CustomUser
from django.http import HttpResponse,JsonResponse
import json

# Create your views here.

def save(request):
    try:
        user = CustomUser.objects.get(username=request.user.username)
    except Exception as e:
        return JsonResponse({'result': False, 'data': 'user not logged in'})
    else:
        dataStructure = Datastructure(
            name = request.POST['name'],
            user = user
        )
        dataTypes    = json.loads(request.POST['dataTypes'])
        try:
            dataStructure.save()
            for dataType in dataTypes:
                dataMapping = dataTypeMapping(
                    datastructure_id = dataStructure.id,
                    datatype_id = dataType['id'],
                    name = dataType['name']
                )
                dataMapping.save()
                print(dataMapping.id)
        except Exception as e:
            return JsonResponse({'result': False, 'data': 'insertion failed'})
        else:
            return JsonResponse({'result': True,'data':dataStructure.id})

def delete(request):
    try:
        dataStructure = Datastructure.objects.get(pk = request.POST['id'])
        dataStructure.delete()
    except Exception as e:
        return JsonResponse({'result': False, 'data': 'insertion failed'})
    else:
        return JsonResponse({'result': True})

def update(request):
    try:
        dataStructure = Datastructure.objects.get(pk = request.POST['id'])
        dataStructure.name = request.POST['name']
        dataStructure.save()
        mappings = dataTypeMapping.objects.filter(datastructure_id=dataStructure.id)
        for mapping in mappings:
            mapping.delete()
        dataTypes = json.loads(request.POST['dataTypes'])
        for dataType in dataTypes:
            dataMapping = dataTypeMapping(
                datastructure_id=dataStructure.id,
                datatype_id=dataType['id'],
                name=dataType['name']
            )
            dataMapping.save()
            print(dataMapping.id)

    except Exception as e:
        return JsonResponse({'result': False, 'data': 'insertion failed','error' : str(e)})
    else:
        return JsonResponse({'result': True})

def deleteMultiple(request):
    try:
        ids = request.POST.getlist('ids[]')
        print("ids")
        print(ids)
        for id in ids:
            dataStructure = Datastructure.objects.get(pk=id)
            dataStructure.delete()
    except Exception as e:
        return JsonResponse({'result': False, 'data': 'insertion failed'})
    else:
        return JsonResponse({'result': True})

def getDataStructure(request):
    try:
        dataStructure = Datastructure.objects.get(pk=request.POST['id'])

        dataStructureDict = {
            "name" : dataStructure.name,
            "id"   : dataStructure.id
        }

        mappings = dataTypeMapping.objects.filter(datastructure_id = dataStructure.id)
        mappingList = []
        for mapping in mappings:
            temp = {'name':mapping.name,'dataTypeName':mapping.datatype.name,'dataTypeId':mapping.datatype.id}
            mappingList.append(temp)

        dataStructureDict['dataTypes'] = mappingList


        return JsonResponse(dataStructureDict,safe=False)
    except Exception as e:
        return JsonResponse({'result': False, 'data': 'insertion failed','error':str(e)})
    else:
        return JsonResponse({'result': True})


