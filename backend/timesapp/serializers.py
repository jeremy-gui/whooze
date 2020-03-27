from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Partie, Joueur


class partieSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Partie
        fields = '__all__'


class joueurSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Joueur
        fields = '__all__'


class userSerializer(serializers.ModelSerializer):
    parties = serializers.PrimaryKeyRelatedField(many=True, queryset=Partie.objects.all())
    joueurs = serializers.PrimaryKeyRelatedField(many=True, queryset=Joueur.objects.all())

    class Meta:
        model = User
        fields = ['id', 'username', 'parties', 'joueurs']
