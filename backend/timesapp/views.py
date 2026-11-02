from django.utils.crypto import get_random_string
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .models import Partie, Joueur, Equipe, Personnage, User
from .serializers import partieSerializer, joueurSerializer, UserSerializer, CreateUserSerializer, equipeSerializer, \
    personnageSerializer


class Parties(ModelViewSet):
    queryset = Partie.objects.all()
    serializer_class = partieSerializer


class CreateUserView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        user = request.data.get('user')
        if not user:
            return Response({'response': 'error', 'message': 'No data found blob'})
        serializer = CreateUserSerializer(data=user)
        if not serializer.is_valid():
            return Response({'response': 'error', 'message': serializer.errors})
        serializer.save()
        return Response({'response': 'success', 'message': 'user created succesfully'})


class CreateJoueurView(APIView):
    def post(self, request):
        joueur = request.data.get('joueur')
        if not joueur:
            return Response({'response': 'error', 'message': 'No data found blob'})
        serializer = joueurSerializer(data=joueur)
        if not serializer.is_valid():
            return Response({'response': 'error', 'message': serializer.errors})
        serializer.save()
        return Response(serializer.data)


class UpdateJoueurView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Joueur.objects.all()
    serializer_class = joueurSerializer


class CreatePartieView(APIView):
    def post(self, request):
        partie = request.data.get('partie')
        if not partie:
            return Response({'response': 'error', 'message': 'No data found blob'})
        partie['code_unique'] = get_random_string(6, '1234567890QWERTYUIOPASDFGHJKLZXCVBNM')
        serializer = partieSerializer(data=partie)
        if not serializer.is_valid():
            return Response({'response': 'error', 'message': serializer.errors})
        saved_partie = serializer.save()
        Equipe.objects.create(nom='1', partie_id=saved_partie)
        Equipe.objects.create(nom='2', partie_id=saved_partie)
        return Response(serializer.data)


class CreateEquipeView(APIView):
    def post(self, request):
        equipe = request.data.get('equipe')
        if not equipe:
            return Response({'response': 'error', 'message': 'No data found blob'})
        serializer = equipeSerializer(data=equipe)
        if not serializer.is_valid():
            return Response({'response': 'error', 'message': serializer.errors})
        serializer.save()
        return Response(serializer.data)


class PersonnageDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Personnage.objects.all()
    serializer_class = personnageSerializer


class PersonnageList(generics.ListCreateAPIView):
    queryset = Personnage.objects.all()
    serializer_class = personnageSerializer


class UpdateEquipeView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Equipe.objects.all()
    serializer_class = equipeSerializer


class GetEquipeFromPartie(generics.ListAPIView):
    serializer_class = equipeSerializer

    def get_queryset(self):
        return Equipe.objects.filter(partie_id=self.kwargs['idpartie'])


class GetUserFromId(generics.ListAPIView):
    """Only your own account: the app never needs anybody else's email."""
    serializer_class = UserSerializer

    def get_queryset(self):
        return User.objects.filter(pk=self.kwargs['iduser']).filter(pk=self.request.user.pk)


class GetPartieFromGameCode(generics.ListAPIView):
    serializer_class = partieSerializer

    def get_queryset(self):
        return Partie.objects.filter(code_unique=self.kwargs['codepartie'])
