from django.contrib import admin
from .models import *
from GestionUser.models import Grado

# Register your models here.
admin.site.register(CategoriaJuego)
admin.site.register(Nivel)
admin.site.register(Tipo)
admin.site.register(Punteo)
admin.site.register(Juego)
admin.site.register(NivelJuego)
admin.site.register(TipoJuego)
admin.site.register(PunteoJuego)
admin.site.register(Puntuacion)
admin.site.register(Grado)