import datetime

from django.db import models
from pygments.lexers import get_lexer_by_name
from pygments.formatters.html import HtmlFormatter
from pygments import highlight
from pygments.styles import get_all_styles
from pygments.lexers import get_all_lexers


LEXERS = [item for item in get_all_lexers() if item[1]]
LANGUAGE_CHOICES = sorted([(item[1][0], item[0]) for item in LEXERS])
STYLE_CHOICES = sorted([(item, item) for item in get_all_styles()])

class Personnage(models.Model):
    nom = models.CharField(max_length=300)

    def __str__(self):
        return self.nom


class Partie(models.Model):
    stadePartieEnCours = models.IntegerField(default=0)  # 0 = non lance, 1 = choix des noms perso,...
    listePersonnages = models.ManyToManyField(Personnage, related_name='personnages')
    owner = models.ForeignKey('auth.User', related_name='parties', blank=True, null=True, on_delete=models.SET_NULL)
    linenos = models.BooleanField(default=False)
    language = models.CharField(choices=LANGUAGE_CHOICES, default='python', max_length=100)
    style = models.CharField(choices=STYLE_CHOICES, default='friendly', max_length=100)
    highlighted = models.TextField(default='here')

    def save(self, *args, **kwargs):
        lexer = get_lexer_by_name(self.language)
        linenos = 'table' if self.linenos else False
        options = {'stadePartieEnCours': self.stadePartieEnCours} if self.stadePartieEnCours else {}
        formatter = HtmlFormatter(style=self.style, linenos=linenos,
                                  full=True, **options)
        self.highlighted = highlight(self.code, lexer, formatter)
        super(Partie, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.id)


class Equipe(models.Model):
    nom = models.CharField(max_length=200)

    def __str__(self):
        return self.nom


class Joueur(models.Model):
    nom = models.CharField(max_length=200)
    partiencours = models.ForeignKey(Partie, related_name='partieencours', blank=True, null=True, on_delete=models.SET_NULL)
    equipe = models.ForeignKey(Equipe, related_name='equipe', blank=True, null=True, on_delete=models.SET_NULL)
    owner = models.ForeignKey('auth.User', related_name='joueurs', blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.nom
