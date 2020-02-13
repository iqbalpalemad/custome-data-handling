from django.shortcuts import render,redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import HttpResponse, JsonResponse,HttpResponseRedirect
from datastructure.models import Datastructure
from django.urls import reverse


# Create your views here.
def index(request):
    if request.user.is_authenticated:
        if request.user.is_superuser:
            print("admin")
            return HttpResponseRedirect(reverse('admin:index'))
        else:
            print("noraml user")
        dataStructures = Datastructure.objects.filter(user__username =request.user.username)
        context = {'dataStructures':dataStructures}
        return render(request, "user/home.html", context)
    else:
        return redirect(reverse('login'))



