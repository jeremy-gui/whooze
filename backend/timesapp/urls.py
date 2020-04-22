from django.urls import path, re_path
from django.contrib import admin
from rest_framework import routers

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
    path(r'joueur/create', timesapp.CreateJoueurView.as_view()),
    path(r'joueur/update/<int:pk>', timesapp.UpdateJoueurView.as_view()),
    path(r'joueur/get/<int:idjoueur>', timesapp.GetJoueurFromId.as_view()),
    path(r'partie/create', timesapp.CreatePartieView.as_view()),
    path(r'partie/update/<int:pk>', timesapp.UpdatePartieView.as_view()),
    path(r'equipe/create', timesapp.CreateEquipeView.as_view()),
    path(r'equipe/update/<int:pk>', timesapp.UpdateEquipeView.as_view()),
    path(r'equipe/frompartie/<int:idpartie>', timesapp.GetEquipeFromPartie.as_view()),
    path(r'partie/fromgamecode/<codepartie>', timesapp.GetPartieFromGameCode.as_view()),
    path(r'partie/get/<int:idpartie>', timesapp.GetPartieFromId.as_view()),
    path(r'personnage/', timesapp.PersonnageList.as_view()),
    path(r'personnage/<int:pk>', timesapp.PersonnageDetail.as_view()),
    path(r'chat/<str:room_name>/', timesapp.room, name='room'),
    path(r'', views.index, name='index')
]
urlpatterns += [
    path(r'api-auth/', include('rest_framework.urls')),
]