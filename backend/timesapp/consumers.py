import json
from channels.auth import login
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from djangochannelsrestframework.consumers import AsyncAPIConsumer
from django.core import serializers
from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer

from timesapp.models import Partie, Joueur, Equipe, User, Personnage
from timesapp.serializers import userSerializer, joueurSerializer, partieSerializer


class PartieConsumer(AsyncAPIConsumer):
    currentround = 0
    indexJoueurEquipe1 = 0
    indexJoueurEquipe2 = 0
    currentteam = 1
    prochainJoueur = ""

    async def connect(self):

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.token = self.scope['url_route']['kwargs']['token']
        self.room_group_name = 'chat_%s' % self.room_name
        user = {}
        user['user'] = {}
        user['user']['token'] = self.token
        try:
            user = await self.verifyToken(user['user'])
            await login(self.scope, user['user'])
            await database_sync_to_async(self.scope["session"].save)()
            if(user['user'].is_authenticated):
                self.scope['user'] = user['user']

                # Join room group
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name,
                )
                await self.accept()
        except Exception as inst:
            event = {}
            event['message'] = inst
            self.chat_message(event)
            await self.disconnect(event['code'])

    async def disconnect(self, close_code):
        partie = await self.getPartie()

        if self.scope['partie'].stadePartieEnCours == partie.CREATE_TEAMS :
            retu = await self.deletePlayerInTeam(partie)

            self.scope['joueur'] = ""
            event = {}
            event['message'] = ""
            self.chat_message(event)
            equipe2 = await self.getAllPlayerOfEquipe2(self.scope['partie'])
            data = {}
            data["requete"] = 'get_team2'
            data["equipe"] = equipe2
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': data,
                }
            )
            equipe1 = await self.getAllPlayerOfEquipe1(self.scope['partie'])
            data = {}
            data["requete"] = 'get_team1'
            data["equipe"] = equipe1
            if retu != False:
                data["newpartie"] = 'True'
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': data,
                }
            )

        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )




    @database_sync_to_async
    def deletePlayerInTeam(self, partie):
        data = False
        Joueur.objects.filter(partiencours=partie, owner=self.scope['user']).update(equipe=None)
        if self.scope['user'].id == partie.owner.id:
            players = Joueur.objects.filter(equipe_id__in=Equipe.objects.filter(partie_id=partie))
            player = Joueur.objects.filter(equipe_id__in=Equipe.objects.filter(partie_id=partie))[:1]

            if players.count() > 0:
                usertobeowner = User.objects.get(id=player.get().owner.id)
                Partie.objects.filter(pk=partie.pk).update(owner_id=usertobeowner.id)
                data = Partie.objects.filter(pk=partie.pk)
                self.scope['partie'] = data.get()
        return data

    @database_sync_to_async
    def verifyToken(self, user):
        data = {'token': user['token']}
        valid_data = VerifyJSONWebTokenSerializer().validate(data)

        return valid_data

    @database_sync_to_async
    def majScoreT1(self, idPartie, data):
        score = len(data)
        equipe = Equipe.objects.get(partie_id=idPartie, nom='1')
        Equipe.objects.filter(pk=equipe.pk).update(score=score)
        equipe = Equipe.objects.get(partie_id=idPartie, nom='1')
        self.scope['equipe1'] = equipe

        return data

    @database_sync_to_async
    def majScoreT2(self, idPartie, data):
        score = len(data)
        equipe = Equipe.objects.get(partie_id=idPartie, nom='2')
        Equipe.objects.filter(pk=equipe.pk).update(score=score)
        equipe = Equipe.objects.get(partie_id=idPartie, nom='1')
        self.scope['equipe2'] = equipe

        return data
    @database_sync_to_async
    def getAllPlayerOfEquipe1(self, idPartie):
        equipe = Equipe.objects.get(partie_id=idPartie, nom='1')
        self.scope['equipe1'] = equipe
        players = serializers.serialize("json", Joueur.objects.filter(equipe_id=equipe))

        return players

    @database_sync_to_async
    def getAllPlayerOfEquipe2(self, idPartie):
        equipe = Equipe.objects.get(partie_id=idPartie, nom='2')
        self.scope['equipe2'] = equipe
        players = serializers.serialize("json", Joueur.objects.filter(equipe_id=equipe))

        return players

    @database_sync_to_async
    def getAllPersonnageFromTeams(self, playersTeam1, playersTeam2):

        listcomplete = json.loads(playersTeam1) + json.loads(playersTeam2)

        listofIds = []
        for jId in listcomplete:
            listofIds.append(jId['pk'])

        list = Personnage.objects.filter(playerowner__in=Joueur.objects.filter(pk__in=listofIds))
        return serializers.serialize("json", list)

    @database_sync_to_async
    def getCurrentPlayer(self):
        user = User.objects.get(pk=self.scope['user'].id)
        joueur = Joueur.objects.filter(partiencours=self.scope['partie'], owner=user.id)
        self.scope['joueur'] = joueur

        return joueur

    @database_sync_to_async
    def setCurrentPlayerReadyToStart(self, readyornot):
        Joueur.objects.filter(pk=self.scope['joueur'].get().id).update(readytostart=readyornot)
        self.scope['joueur'].readytostart = readyornot

    @database_sync_to_async
    def getPartie(self):
        partie = Partie.objects.get(code_unique=self.room_name)
        self.scope['partie'] = partie
        return self.scope['partie']

    @database_sync_to_async
    def letsCreatePerso(self, partie):
        Partie.objects.filter(id=partie.id).update(stadePartieEnCours=partie.CHOOSE_PERSO)
        data = Partie.objects.filter(id=partie.id)
        self.scope['partie'] = data
        return  serializers.serialize("json", data)

    @database_sync_to_async
    def letsStartTheGame(self, partie):
        Partie.objects.filter(id=partie.id).update(stadePartieEnCours=partie.ROUND_1)
        data = Partie.objects.filter(id=partie.id)
        self.scope['partie'] = data
        return  serializers.serialize("json", data)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json['requete'])
        message = text_data_json['message']
        requete = text_data_json['requete']

        user = self.scope['user']

        # Send message to room group

        if (user.is_authenticated == True) :
            if (requete == 'get_team1') :
                idEquipe = await self.getPartie()
                equipe = await self.getAllPlayerOfEquipe1(self.scope['partie'])
                data = {}

                data["requete"] = requete
                data["equipe"] = equipe
                tobesend = data
                await self.getCurrentPlayer()
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': tobesend,
                    }
                )
            if (requete == 'get_team2'):
                idEquipe = await self.getPartie()
                equipe = await self.getAllPlayerOfEquipe2(self.scope['partie'])
                data = {}

                data["requete"] = requete
                data["equipe"] = equipe
                tobesend = data
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': tobesend
                    },
                )

            if (requete == 'letsstartround1'):
                await self.getPartie()
                updatedpartie = await self.letsStartTheGame(self.scope['partie'])
                data = {}
                data["requete"] = requete
                data["majpartie"] = updatedpartie
                tobesend = data

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': tobesend
                    },
                )
            if (requete == 'getnextplayer'):
                await self.getPartie()
                self.playersTeam2 = await self.getAllPlayerOfEquipe2(self.scope['partie'])
                self.playersTeam1 = await self.getAllPlayerOfEquipe1(self.scope['partie'])
                jteam1 = json.loads(self.playersTeam1)
                jteam2 = json.loads(self.playersTeam2)
                prochainjoueur = ""
                if (message=='0'):
                    self.indexJoueurEquipe1 = 0
                    self.indexJoueurEquipe2 = 0
                    self.currentteam = 1
                    prochainjoueur = jteam1[self.indexJoueurEquipe1]

                else :
                    if (message['currentround'] == 1):
                        if (message['currentteam'] == 1):
                            self.indexJoueurEquipe1 = message['indexJoueurEquipe1']+1
                            self.currentteam = 2
                            prochainjoueur = jteam2[message['indexJoueurEquipe2']]
                        elif (message['currentteam'] == 2):
                            self.indexJoueurEquipe2 = message['indexJoueurEquipe2'] + 1
                            self.currentteam = 1
                            prochainjoueur = jteam1[message['indexJoueurEquipe1']]


                print(prochainjoueur)
                data = {}
                data["requete"] = requete
                data["quijoue"] = prochainjoueur
                data["indexJoueurEquipe1"] = self.indexJoueurEquipe1
                data["indexJoueurEquipe2"] = self.indexJoueurEquipe2
                tobesend = data

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': tobesend
                    },
                )

            if (requete == 'letscreateperso') :
                await self.getPartie()
                updatedpartie = await self.letsCreatePerso(self.scope['partie'])

                data = {}
                data["requete"] = requete
                data["message"] = updatedpartie
                tobesend = data

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': tobesend
                    },
                )
            if (requete == 'readytostart') :
                await self.getPartie()
                await self.getCurrentPlayer()
                await self.setCurrentPlayerReadyToStart(message)
                await self.getPartie()
                equipe1 = await self.getAllPlayerOfEquipe2(self.scope['partie'])
                equipe2 = await self.getAllPlayerOfEquipe1(self.scope['partie'])

                data = {}
                data["equipe1"] = equipe1
                data["equipe2"] = equipe2

                self.scope["readytostart"] = message

                data["requete"] = 'majteam'

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': data
                    },
                )

            if (requete == 'listepersocomplete'):
                await self.getPartie()
                await self.getCurrentPlayer()
                playersTeam2 = await self.getAllPlayerOfEquipe2(self.scope['partie'])
                playersTeam1 = await self.getAllPlayerOfEquipe1(self.scope['partie'])
                data = {}
                data["requete"] = requete
                data["liste"] = await self.getAllPersonnageFromTeams(playersTeam1, playersTeam2)

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': data
                    },
                )
            if (requete == 'startround1'):
                await self.getPartie()
                await self.getCurrentPlayer()
                playersTeam2 = await self.getAllPlayerOfEquipe2(self.scope['partie'])
                playersTeam1 = await self.getAllPlayerOfEquipe1(self.scope['partie'])
                self.currentround = 1
                data = {}
                data["requete"] = requete
                data["data"] = message
                print(message)
                self.scope["listepersonnage"] = await self.getAllPersonnageFromTeams(playersTeam1, playersTeam2)

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': data
                    },
                )
            if (requete == 'majScoret1'):
                await self.getPartie()
                await self.majScoreT1(self.scope['partie'], message)
                data = {}
                data["requete"] = requete
                data["score1"] = message
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': data
                    },
                )
            if (requete == 'majScoret2'):
                await self.majScoreT2(self.scope['partie'], message)
                data = {}
                data["requete"] = requete
                data["score2"] = message
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': data
                    },
                )
            if (requete == 'nextplayersameround'):
                data = {}
                data["requete"] = requete
                data["data"] = message
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': data
                    },
                )


            if (requete == 'message') :
                tellme = user.email + " say : " + message
                data = {}
                data["requete"] = requete
                data["message"] = tellme
                tobesend = data

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': tobesend
                    },
                )

        else :
            """
            test envoi message chat avec controle token
            """
            user = await self.verifyToken(text_data_json['user'])
            self.scope['user'] = user['user']

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': self.scope['user'].email+" say : " + message
                }
            )

        # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        user = self.scope['user']
        # Send message to WebSocket
        if(user.is_anonymous == False) :
            await self.send(text_data=json.dumps({
                'message': message
            }))
        else :
           await self.disconnect(message["code"])
