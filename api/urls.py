from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    path('token/', obtain_auth_token, name='api_token'),
    path('get_datastructures/',views.getDataStructure.as_view(),name='get_datastructures'),
    path('get_datas/',views.getData.as_view(),name='getData')
]