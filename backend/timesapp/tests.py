from asgiref.sync import async_to_sync, sync_to_async
from channels.testing import WebsocketCommunicator
from django.test import TransactionTestCase, override_settings
from rest_framework.test import APIClient

from times.asgi import application
from timesapp.models import Equipe, User

PASSWORD = 'Str0ng-test-pass'
IN_MEMORY = {'default': {'BACKEND': 'channels.layers.InMemoryChannelLayer'}}


def signup_and_login(email):
    client = APIClient()
    credentials = {'email': email, 'password': PASSWORD}
    response = client.post('/timesapp/users/create', {'user': credentials}, format='json')
    assert response.data['response'] == 'success', response.data
    token = client.post('/api-token-auth/', credentials, format='json').data['access']
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
    return client, User.objects.get(email=email).pk, token


def create_game(client, user_id):
    return client.post('/timesapp/partie/create', {'partie': {'owner_id': user_id}}, format='json').data


@override_settings(CHANNEL_LAYERS=IN_MEMORY)
class WhoozeTests(TransactionTestCase):
    def test_nothing_is_readable_anonymously(self):
        for url in ('personnage/', 'api/parties', 'user/get/1', 'equipe/frompartie/1', 'partie/fromgamecode/X'):
            self.assertEqual(APIClient().get('/timesapp/' + url).status_code, 401, url)

    def test_weak_password_is_refused(self):
        data = {'user': {'email': 'weak@example.com', 'password': '123'}}
        self.assertEqual(APIClient().post('/timesapp/users/create', data, format='json').data['response'], 'error')

    def test_other_players_email_stays_private(self):
        alice, alice_id, _ = signup_and_login('alice@example.com')
        bob, _, _ = signup_and_login('bob@example.com')
        self.assertEqual(bob.get(f'/timesapp/user/get/{alice_id}').data, [])
        self.assertEqual(alice.get(f'/timesapp/user/get/{alice_id}').data[0]['email'], 'alice@example.com')
        partie = create_game(alice, alice_id)
        self.assertEqual(partie['owner'], {'id': alice_id})
        self.assertNotIn('alice', str(bob.get('/timesapp/partie/fromgamecode/' + partie['code_unique']).data))

    def test_game_setup_over_rest_and_websocket(self):
        async_to_sync(self._game)()

    async def _game(self):
        partie, token = await sync_to_async(self._setup)()
        code = partie['code_unique']

        ws = WebsocketCommunicator(application, f'/ws/timesapp/chat/{code}/{token}/')
        self.assertTrue((await ws.connect())[0])
        await ws.send_json_to({'message': '', 'requete': 'get_team1', 'token': token})
        answer = (await ws.receive_json_from())['message']
        self.assertEqual(answer['requete'], 'get_team1')
        self.assertIn('"username": "Alice"', answer['equipe'])
        await ws.send_json_to({'message': [1, 2], 'requete': 'majScoret2', 'token': token})
        self.assertEqual((await ws.receive_json_from())['message']['score2'], [1, 2])
        self.assertEqual((await Equipe.objects.aget(partie_id=partie['id'], nom='2')).score, 2)
        await ws.disconnect()

        bad = WebsocketCommunicator(application, f'/ws/timesapp/chat/{code}/not-a-token/')
        self.assertFalse((await bad.connect())[0])
        await bad.disconnect()

    def _setup(self):
        alice, user_id, token = signup_and_login('alice@example.com')
        partie = create_game(alice, user_id)
        equipes = alice.get(f"/timesapp/equipe/frompartie/{partie['id']}").data
        self.assertEqual([e['nom'] for e in equipes], ['1', '2'])
        alice.post('/timesapp/joueur/create', {'joueur': {
            'username': 'Alice', 'owner_id': user_id, 'partiencours': partie['id'], 'equipe': equipes[0]['id'],
        }}, format='json')
        return partie, token
