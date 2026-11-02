from django.urls import include, path
from rest_framework import routers

from timesapp import views

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'parties', views.Parties)

urlpatterns = [
    path('api/', include(router.urls)),
    path('user/get/<int:iduser>', views.GetUserFromId.as_view()),
    path('users/create', views.CreateUserView.as_view()),
    path('joueur/create', views.CreateJoueurView.as_view()),
    path('joueur/update/<int:pk>', views.UpdateJoueurView.as_view()),
    path('partie/create', views.CreatePartieView.as_view()),
    path('equipe/update/<int:pk>', views.UpdateEquipeView.as_view()),
    path('equipe/create', views.CreateEquipeView.as_view()),
    path('equipe/frompartie/<int:idpartie>', views.GetEquipeFromPartie.as_view()),
    path('partie/fromgamecode/<codepartie>', views.GetPartieFromGameCode.as_view()),
    path('personnage/', views.PersonnageList.as_view()),
    path('personnage/<int:pk>', views.PersonnageDetail.as_view()),
]
