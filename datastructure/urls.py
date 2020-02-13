from django.urls import path

from . import views

urlpatterns = [
      path('save/', views.save, name='save'),
      path('delete/', views.delete, name='delete'),
      path('delete_multiple/', views.deleteMultiple, name='deleteMultiple'),
      path('getDataStructure/', views.getDataStructure, name='getDataStructure'),
      path('update/', views.update, name='update')
]