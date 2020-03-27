from django.urls import path, re_path
from django.contrib import admin
import timesapp.views as timesapp
from django.conf.urls import include, url

urlpatterns = [
    path(r'', timesapp.HomePageView.as_view()),
    path('parties/', timesapp.Parties.as_view(), name="index"),
    path('partie/<int:pk>/', timesapp.PartieCourante.as_view(), name="Partie en cours"),
    path('joueurs/', timesapp.Joueurs.as_view(), name="Liste des joueurs"),
    path('joueurs/<int:pk>/', timesapp.JoueurDetail.as_view()),
    path('users/', timesapp.UserList.as_view()),
    path('users/<int:pk>/', timesapp.UserDetail.as_view()),
    path('links/', timesapp.LinksPageView.as_view()),  # simple view
    path('getcust/', timesapp.Customers.getCust),  # simple view
    path('apitest/', timesapp.CalcTest),  # for REST API test
]

urlpatterns += [
    path('api-auth/', include('rest_framework.urls')),
]
