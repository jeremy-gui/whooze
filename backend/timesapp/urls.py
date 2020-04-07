from django.urls import path, re_path
from django.contrib import admin
from rest_framework import routers
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token

import timesapp.views as timesapp
from django.conf.urls import include, url

from timesapp import views

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'joueurs', views.Joueurs)
router.register(r'Joueurdetail', views.Parties)
router.register(r'users', views.UserList)
router.register(r'userdetail', views.UserDetail)
router.register(r'parties', views.Parties)
router.register(r'partiecourante', views.Parties)

urlpatterns = [
    path(r'api/', include(router.urls)),
    path(r'current_user/', timesapp.get_current_user),
    path(r'users/create', timesapp.CreateUserView.as_view()),
    path(r'', views.index, name='index')
]
urlpatterns += [
    path(r'api-auth/', include('rest_framework.urls')),
]