from django.conf.urls import url
from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
    url('^ws/timesapp/chat/(?P<room_name>[^/]+)/(?P<token>[^/]+)/$', consumers.PartieConsumer),
]
"""
channel_routing = {
    'websocket.connect': consumers.PartieConsumer.connect(),
    'websocket.receive': consumers.ws_receive,
    'websocket.disconnect': consumers.ws_disconnect,
}"""