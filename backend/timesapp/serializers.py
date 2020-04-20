from rest_framework import serializers
from rest_framework_jwt.settings import api_settings

from .models import Partie, Joueur, User, Equipe


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

class UserSerializerWithToken(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    token = serializers.SerializerMethodField()

    def get_token(self, object):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(object)
        token = jwt_encode_handler(payload)
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
        fields = ('token', 'email', 'password')