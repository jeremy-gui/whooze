from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Partie, Joueur, User, Equipe, Personnage


class userSerializer(serializers.ModelSerializer):
    parties = serializers.PrimaryKeyRelatedField(many=True, queryset=Partie.objects.all())
    joueurs = serializers.PrimaryKeyRelatedField(many=True, queryset=Joueur.objects.all())

    class Meta:
        model = User
        fields = ['id', 'email', 'parties', 'joueurs']


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
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        return data

    def create(self, validated_data):
        data = {
            key: value for key, value in validated_data.items()
            if key not in ('password')
        }
        data['password'] = validated_data['password']
        return self.Meta.model.objects.create_user(**data)

    class Meta:
        model = get_user_model()
        fields = (
            'id', 'email', 'password', 'parties', 'joueurs'
        )
        read_only_fields = ('id',)

class UserSerializerWithToken(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    token = serializers.SerializerMethodField()
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        user_data = UserSerializer(user).data
        for key, value in user_data.items():
            if key != 'id':
                token[key] = value
        return token

    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    class Meta:
        model = User
        fields = ('token', 'email', 'password', 'parties', 'joueurs')