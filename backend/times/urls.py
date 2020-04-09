from django.conf.urls import url
from django.contrib import admin
from django.urls import include, path
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

urlpatterns = [
    path('admin/', admin.site.urls),
    path('timesapp/', include('timesapp.urls')),
    path(r'api-token-auth/', obtain_jwt_token),
    path(r'api-token-refresh/', refresh_jwt_token),
    path(r'api-token-verify/', verify_jwt_token),
]
