from django.conf.urls import url
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('timesapp/', include('timesapp.urls')),
    path('admin/', admin.site.urls),
]
