from django.conf.urls import url
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('timesapp/', include('timesapp.urls')),
    path('api-token-auth/', jwt_views.TokenObtainPairView.as_view(), name='token_create'),  # override sjwt stock token
    path('api-token-refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]
