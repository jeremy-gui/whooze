from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
    path(r'ws/timesapp/chat/<str:room_name>/<str:token>/', consumers.PartieConsumer),
]
"""
channel_routing = {
    'websocket.connect': consumers.PartieConsumer.connect(),
    'websocket.receive': consumers.ws_receive,
    'websocket.disconnect': consumers.ws_disconnect,
}"""