from django.contrib import admin

from .models import Joueur, Personnage, Partie, Equipe

admin.site.register(Joueur)
admin.site.register(Personnage)
admin.site.register(Partie)
admin.site.register(Equipe)
