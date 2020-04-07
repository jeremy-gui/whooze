from django.contrib.auth import authenticate, login
from django.http import JsonResponse, HttpResponse
from rest_framework.decorators import action, api_view
from rest_framework import status, permissions
from rest_framework.utils import json
from rest_framework.viewsets import ModelViewSet

from timesapp.permissions import IsOwnerOrReadOnly
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework import mixins
from rest_framework import generics
from django.shortcuts import render

from .models import Partie, Joueur, Equipe, Personnage, User
from .serializers import partieSerializer, joueurSerializer, userSerializer, UserSerializerWithToken


def index(request, path=''):
    """
    The home page. This renders the container for the single-page app.
    """
    return render(request, 'timesapp/index.html')


class HomePageView(TemplateView):
    def get(self, request, **kwargs):
        return render(request, 'timesapp/index.html', context=None)


class Parties(ModelViewSet):
    queryset = Partie.objects.all()
    serializer_class = partieSerializer
    permission_classes = [permissions.IsAuthenticated,
                          IsOwnerOrReadOnly]

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


"""generics.ListAPIView"""


class UserList(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = userSerializer


class UserDetail(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = userSerializer

@api_view(['GET'])
def get_current_user(request):
    serializer = userSerializer(request.user)
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
        y = str(x * 100)
        return JsonResponse("Result:" + y, safe=False)
    except ValueError as e:
        return Response(e.args[0], status.HTTP_400_BAD_REQUEST)
