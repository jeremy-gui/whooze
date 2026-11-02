from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('timesapp/', include('timesapp.urls')),
    path('api-token-auth/', jwt_views.TokenObtainPairView.as_view(), name='token_create'),  # override sjwt stock token
    path('api-token-refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api-token-verify/', jwt_views.TokenVerifyView.as_view(), name='token_verify'),
]
