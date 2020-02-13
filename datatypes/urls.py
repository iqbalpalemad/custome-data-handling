from django.urls import path

from . import views

urlpatterns = [
      path('getAllDataTypes', views.getAllDataTypes, name='getAllDataTypes'),
]