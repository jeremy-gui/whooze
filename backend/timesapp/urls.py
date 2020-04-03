from django.urls import path, re_path
from django.contrib import admin
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token

import timesapp.views as timesapp
from django.conf.urls import include, url

from timesapp import views

urlpatterns = [
    path(r'', views.index, name='index'),
]

urlpatterns += [
    path('api-auth/', include('rest_framework.urls')),
]
