from django.shortcuts import render
from datastructure.models import Datastructure,dataTypeMapping,DatastructureData,fileData
import json
from django.http import JsonResponse

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class getDataStructure(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self,request):
        try:
            if 'username' in request.GET:
                print("inside if")
                dataStructures = Datastructure.objects.filter(user__username = request.GET['username'])
            else:
                print("inside else")
                dataStructures = Datastructure.objects.all()

        except Exception as e:
            message = "errro occured"
            if 'username' in request.GET:
                message = "user not found"
            return JsonResponse({'result': False, 'message': message})
        else:
            dataStructureList = []
            for dataStructure in dataStructures:
                temp = {'data_structure':{'name':dataStructure.name},
                        "owner":{
                            'username':dataStructure.user.username,
                            'name':dataStructure.user.first_name+" "+dataStructure.user.last_name}}
                dataStructureList.append(temp)

            return JsonResponse({'result': True, 'data': dataStructureList})

class getData(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            if 'username' in request.GET:
                dataStructureDatas = DatastructureData.objects.filter(datastructure__user__username=request.GET['username'])
            else:
                dataStructureDatas = DatastructureData.objects.all()
        except Exception as e:
            message = "errro occured"
            if 'username' in request.GET:
                message = "user not found"
            return JsonResponse({'result': False, 'message': message})
        else:
            dataStructureDataDict = {}

            for dataStructureData in dataStructureDatas :
                temp = {'name':dataStructureData.name,'data':[]}
                tempJsonDatas = json.loads(dataStructureData.data)
                print(tempJsonDatas)
                tempDataList = {}
                for tempJsonData in tempJsonDatas:
                    tempDataList = {'name':tempJsonData['dataName'],'data_type':tempJsonData['dataTypeName'],'dat_value':tempJsonData['dataValue']}
                temp['data'].append(tempDataList)
                if dataStructureData.datastructure.name in dataStructureDataDict:
                    dataStructureDataDict[dataStructureData.datastructure.name].append(temp)
                else:
                    dataStructureDataDict[dataStructureData.datastructure.name] = [temp]

        return JsonResponse({'result': True, 'data': dataStructureDataDict})


