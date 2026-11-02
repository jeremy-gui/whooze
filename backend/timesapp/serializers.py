from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Partie, Joueur, User, Equipe, Personnage


class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id']


class partieSerializer(serializers.ModelSerializer):
    owner = userSerializer(many=False, read_only=True)
    owner_id = serializers.IntegerField(write_only=True)


    class Meta:
        model = Partie
        fields = '__all__'


class joueurSerializer(serializers.ModelSerializer):
    owner = userSerializer(many=False, read_only=True)
    owner_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Joueur
        fields = '__all__'

class equipeSerializer(serializers.ModelSerializer):
    partie = partieSerializer(many=False, read_only=True)
    partie_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Equipe
        fields = '__all__'

class personnageSerializer(serializers.ModelSerializer):
    owner = userSerializer(many=False, read_only=True)

    class Meta:
        model = Personnage
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'email')
        read_only_fields = fields


class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    class Meta:
        model = User
        fields = ('email', 'password')
