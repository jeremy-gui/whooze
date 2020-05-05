from django.contrib.auth import authenticate, login
from django.http import JsonResponse, HttpResponse
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.observer.generics import ObserverModelInstanceMixin
from rest_framework.decorators import action, api_view
from rest_framework import status, permissions
from rest_framework.mixins import UpdateModelMixin
from rest_framework.utils import json
from rest_framework.viewsets import ModelViewSet

from timesapp.permissions import IsOwnerOrReadOnly
from rest_framework.generics import ListAPIView, GenericAPIView
from rest_framework.response import Response
from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework import mixins
from rest_framework import generics
from django.shortcuts import render

from .models import Partie, Joueur, Equipe, Personnage, User
from .serializers import partieSerializer, joueurSerializer, UserSerializer, UserSerializerWithToken, equipeSerializer, \
    personnageSerializer


def index(request, path=''):
    """
    The home page. This renders the container for the single-page app.
    """
    return render(request, 'timesapp/index.html')



def room(request, room_name):
    return render(request, 'timesapp/room.html', {
        'room_name': room_name
    })



class HomePageView(TemplateView):
    def get(self, request, **kwargs):
        return render(request, 'timesapp/index.html', context=None)


class Parties(ModelViewSet):
    queryset = Partie.objects.all()
    serializer_class = partieSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PartieCourante(ModelViewSet):
    queryset = Partie.objects.all()
    serializer_class = partieSerializer
    permission_classes = [permissions.IsAuthenticated,
                          IsOwnerOrReadOnly]


class Joueurs(ModelViewSet):
    queryset = Joueur.objects.all()
    serializer_class = joueurSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class JoueurDetail(ModelViewSet):
    queryset = Joueur.objects.all()
    serializer_class = joueurSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly]


class Equipes(ModelViewSet):
    queryset = Equipe.objects.all()
    serializer_class = equipeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class EquipeDetail(ModelViewSet):
    queryset = Equipe.objects.all()
    serializer_class = equipeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class UserList(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@api_view(['GET'])
def get_current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

class CreateUserView(APIView):
    permission_classes = (permissions.AllowAny, )
    def post(self,request):
        user = request.data.get('user')
        if not user:
            return Response({'response' : 'error', 'message' : 'No data found blob'})
        serializer = UserSerializerWithToken(data=user)
        if serializer.is_valid():
            saved_user = serializer.save()
        else:
            return Response({"response" : "error", "message" : serializer.errors})
        return Response({"response" : "success", "message" : "user created succesfully"})

class CreateJoueurView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    def post(self,request):
        joueur = request.data.get('joueur')
        if not joueur:
            return Response({'response' : 'error', 'message' : 'No data found blob'})
        serializer = joueurSerializer(data=joueur)
        if serializer.is_valid():
            saved_joueur = serializer.save()
        else:
            return Response({"response" : "error", "message" : serializer.errors})
        return Response(serializer.data)

class UpdateJoueurView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Joueur.objects.all()
    serializer_class = joueurSerializer


class CreatePartieView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    def post(self,request):
        partie = request.data.get('partie')

        if not partie:
            return Response({'response' : 'error', 'message' : 'No data found blob'})


        partie['code_unique'] = User.objects.make_random_password(6, '1234567890qwertyuiopasdfghjklzxcvbnm', ).upper()

        serializer = partieSerializer(data=partie)
        if serializer.is_valid():
            saved_partie = serializer.save()
            equipe1 = Equipe(nom='1', partie_id=saved_partie)
            equipe2 = Equipe(nom='2', partie_id=saved_partie)
            equipe1.save()
            equipe2.save()
        else:
            return Response({"response" : "error", "message" : serializer.errors})
        return Response(serializer.data)


class UpdatePartieView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Partie.objects.all()
    serializer_class = partieSerializer

class CreateEquipeView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    def post(self,request):
        equipe = request.data.get('equipe')
        if not equipe:
            return Response({'response' : 'error', 'message' : 'No data found blob'})
        serializer = equipeSerializer(data=equipe)
        if serializer.is_valid():
            saved_equipe = serializer.save()
        else:
            return Response({"response" : "error", "message" : serializer.errors})
        return Response(serializer.data)
"""
class CreatePersonnageView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        personnage = request.data.get('personnage')
        if not personnage:
            return Response({'response': 'error', 'message': 'No data found blob'})
        serializer = personnageSerializer(data=personnage)
        if serializer.is_valid():
            saved_personnage = serializer.save()
        else:
            return Response({"response": "error", "message": serializer.errors})
        return Response(serializer.data)
"""
class PersonnageDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Personnage.objects.all()
    serializer_class = personnageSerializer


class PersonnageList(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Personnage.objects.all()
    serializer_class = personnageSerializer


class UpdateEquipeView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Equipe.objects.all()
    serializer_class = joueurSerializer

class GetEquipeFromPartie(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = equipeSerializer

    def get_queryset(self):
        idpartie = self.kwargs['idpartie']
        return Equipe.objects.filter(partie_id=idpartie)

class GetUserFromId(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_queryset(self):
        iduser = self.kwargs['iduser']
        return User.objects.filter(pk=iduser)


class GetPartieFromGameCode(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = partieSerializer

    def get_queryset(self):
        code = self.kwargs['codepartie']
        return Partie.objects.filter(code_unique=code)

class GetPartieFromId(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = partieSerializer

    def get_queryset(self):
        idpartie = self.kwargs['idpartie']
        return Partie.objects.filter(id=idpartie)

class GetJoueurFromId(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = joueurSerializer

    def get_queryset(self):
        idjoueur = self.kwargs['idpartie']
        return Joueur.objects.filter(id=idjoueur)

class GetAllPlayerOfOneEquipe(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = joueurSerializer

    def get_queryset(self):
        idEquipe = self.kwargs['idequipe']
        return Joueur.objects.filter(equipe=idEquipe)