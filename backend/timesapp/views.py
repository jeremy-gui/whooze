from django.http import JsonResponse, HttpResponse
from rest_framework.decorators import action, api_view
from rest_framework import status, permissions
from rest_framework.utils import json

from timesapp.permissions import IsOwnerOrReadOnly
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework import mixins
from rest_framework import generics
from django.shortcuts import render
from django.contrib.auth.models import User

from .models import Partie, Joueur, Equipe, Personnage
from .serializers import partieSerializer, joueurSerializer, userSerializer


class Parties(generics.ListCreateAPIView):
    queryset = Partie.objects.all()
    serializer_class = partieSerializer
    permission_classes = [permissions.IsAuthenticated,
                          IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PartieCourante(generics.RetrieveUpdateDestroyAPIView):
    queryset = Partie.objects.all()
    serializer_class = partieSerializer
    permission_classes = [permissions.IsAuthenticated,
                          IsOwnerOrReadOnly]


class Joueurs(generics.ListCreateAPIView):
    queryset = Joueur.objects.all()
    serializer_class = joueurSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class JoueurDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Joueur.objects.all()
    serializer_class = joueurSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly]


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = userSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = userSerializer


def index(request, path=''):
    """
    The home page. This renders the container for the single-page app.
    """
    return render(request, 'index.html')

class LinksPageView(TemplateView):
    def get(self, request, **kwargs):
        return render(request, 'timesapp/links.html', context=None)


class Customers(TemplateView):
    def getCust(request):
        name = 'liran'
        return HttpResponse('{ "name":"' + name + '", "age":31, "city":"New York" }')


@api_view(["POST"])
def CalcTest(x1):
    try:
        x = json.loads(x1.body)
        y = str(x*100)
        return JsonResponse("Result:"+y,safe=False)
    except ValueError as e:
        return Response(e.args[0], status.HTTP_400_BAD_REQUEST)