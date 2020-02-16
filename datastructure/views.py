from django.shortcuts import render
from .models import Datastructure,dataTypeMapping,DatastructureData,fileData
from users.models import CustomUser
from django.http import HttpResponse,JsonResponse
import json
from django_datatables_view.base_datatable_view import BaseDatatableView
from django.utils.html import escape

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

def saveData(request):
    try:
        newData = DatastructureData(
            name = request.POST['name'],
            data = request.POST['data'],
            datastructure_id = request.POST['dataStructure_id']
        )
        newData.save()
    except Exception as e:
        return JsonResponse({'result': False, 'data': 'insertion failed', 'error': str(e)})
    else:
        return JsonResponse({'result': True, 'id': newData.id,'dataStructureName':newData.datastructure.name})



def delete(request):
    try:
        dataStructure = Datastructure.objects.get(pk = request.POST['id'])
        dataStructure.delete()
    except Exception as e:
        return JsonResponse({'result': False, 'data': 'insertion failed'})
    else:
        return JsonResponse({'result': True})

def deleteData(request):
    try:
        dataStructureData = DatastructureData.objects.get(pk = request.POST['id'])
        dataStructureData.delete()
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

def updateData(request):
    try:
        dataStructureData = DatastructureData.objects.get(pk = request.POST['id'])
        dataStructureData.name = request.POST['name']
        dataStructureData.data = request.POST['data']
        dataStructureData.datastructure_id = request.POST['dataStructure_id']
        dataStructureData.save()
    except Exception as e:
        return JsonResponse({'result': False, 'data': 'insertion failed'})
    else:
        return JsonResponse({'result': True,'data_structure_name':dataStructureData.datastructure.name})

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

def data_delete_multiple(request):
    try:
        ids = request.POST.getlist('ids[]')
        print("ids")
        print(ids)
        for id in ids:
            dataStructureData = DatastructureData.objects.get(pk=id)
            dataStructureData.delete()
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
            temp = {'name':mapping.name,'dataTypeName':mapping.datatype.name,'dataTypeId':mapping.datatype.id,'mappingId':mapping.id}
            mappingList.append(temp)

        dataStructureDict['dataTypes'] = mappingList


        return JsonResponse(dataStructureDict,safe=False)
    except Exception as e:
        return JsonResponse({'result': False, 'data': 'insertion failed','error':str(e)})
    else:
        return JsonResponse({'result': True})

def getData(request):
    try:
        dataStructureData = DatastructureData.objects.get(pk=request.POST['id'])
        dataStructureDataDict = {
            'name'            : dataStructureData.name,
            'id'              : dataStructureData.id,
            'data'            : dataStructureData.data,
            'dataStructureId' : dataStructureData.datastructure.id
        }
    except Exception as e:
        return JsonResponse({'result': False, 'data': 'insertion failed', 'error': str(e)})
    else:
        return JsonResponse({'result': True,'data':dataStructureDataDict})

def getAllData(request):
    try:
        dataStructureDatas = DatastructureData.objects.all()
        returnData = []
        for dataStructureData in dataStructureDatas:
            temp = {'id':dataStructureData.id,
                    'userName':dataStructureData.datastructure.user.first_name+" "+dataStructureData.datastructure.user.last_name,
                    'name':dataStructureData.name,
                    'dataStructureName':dataStructureData.datastructure.name,
                    'dataStructureId':dataStructureData.datastructure.id}
            returnData.append(temp)
    except Exception as e:
        return JsonResponse({'result': False, 'data': 'insertion failed', 'error': str(e)})
    else:
        return JsonResponse({'result': True, 'data': returnData})



def getAllDataStructures(request):
    dataStructures = Datastructure.objects.filter(user__username=request.user.username)
    dataStructureList = []
    for dataStructure in dataStructures:
        temp = {'name': dataStructure.name, 'id': dataStructure.id}
        dataStructureList.append(temp)
    return JsonResponse(dataStructureList, safe=False)

def getAllDataStructuresById(request):
    dataStructures = Datastructure.objects.filter(pk=request.POST['id'])
    dataStructureList = []
    for dataStructure in dataStructures:
        temp = {'name': dataStructure.name, 'id': dataStructure.id}
        dataStructureList.append(temp)
    return JsonResponse(dataStructureList, safe=False)

def uploadFile(request):
    print(request.FILES['file'])
    print(request.POST)
    try:
        newFile = fileData(
            file = request.FILES['file']
        )
        newFile.save()
    except Exception as e:
        print("exception")
        print(str(e))
        return JsonResponse({'result': False})
    else:
        return JsonResponse({'result': True, 'data': newFile.file.url})




