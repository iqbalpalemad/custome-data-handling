from django.urls import path

from . import views

urlpatterns = [
      path('save/', views.save, name='save'),
      path('delete/', views.delete, name='delete'),
      path('delete_multiple/', views.deleteMultiple, name='deleteMultiple'),
      path('getDataStructure/', views.getDataStructure, name='getDataStructure'),
      path('update/', views.update, name='update'),
      path('getAllDataStructures/',views.getAllDataStructures,name="getAllDataStructures"),
      path('saveData/',views.saveData,name='saveData'),
      path('deleteData/',views.deleteData,name='deleteData'),
      path('data_delete_multiple/',views.data_delete_multiple,name='data_delete_multiple'),
      path('getData/',views.getData,name='getData'),
      path('updateData/',views.updateData,name='updateData'),
      path('uploadFile/',views.uploadFile,name='uploadFile'),
      path('getAllData/',views.getAllData,name='getAllData'),
      path('getAllDataStructuresById/',views.getAllDataStructuresById,name='getAllDataStructuresById')
]