import datetime

from django.conf import settings
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
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

class Equipe(models.Model):
    nom = models.CharField(max_length=200)

    def __str__(self):
        return self.nom

class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

class User(AbstractUser):
    """User model."""

    username = None
    email = models.EmailField('email', unique=True)
    parties = None
    joueurs = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()


class Partie(models.Model):
    stadePartieEnCours = models.IntegerField(default=0)  # 0 = non lance, 1 = choix des noms perso,...
    listePersonnages = models.ManyToManyField(Personnage, related_name='personnages')

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='parties', blank=True, null=True, on_delete=models.SET_NULL)
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


class Joueur(models.Model):
    username = models.CharField(max_length=200)
    partiencours = models.ForeignKey(Partie, related_name='partieencours', blank=True, null=True, on_delete=models.SET_NULL)
    equipe = models.ForeignKey(Equipe, related_name='equipe', blank=True, null=True, on_delete=models.SET_NULL)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='user', blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.username

class JoueurManager():

    def _create_joueur(self, username, owner, **extra_fields):
        """Create and save a Joueur with the given username and owner."""
        if not username:
            raise ValueError('The given username must be set')
        joueur = self.model(username=username, **extra_fields)
        joueur.owner = self.model(owner=owner, **extra_fields)
        joueur.save(using=self._db)
        return joueur


    def create_joueur(self, username, owner=None, **extra_fields):

        return self._create_user(username, owner, **extra_fields)