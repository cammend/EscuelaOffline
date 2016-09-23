from django.db import models
from GestionUser.models import Usuario

# Create your models here.

class CategoriaJuego(models.Model):
	nombre = models.CharField(max_length=30)
	icono = models.CharField(max_length=20)

	def __str__(self):
		return self.nombre

	class Meta:
		ordering = ['nombre']

class Nivel(models.Model):
	nombre = models.CharField(max_length=30)
	codigo = models.IntegerField()

	def __str__(self):
		return self.nombre

	class Meta:
		ordering = ['codigo']

class Tipo(models.Model):
	nombre = models.CharField(max_length=30)
	codigo = models.IntegerField()

	def __str__(self):
		return self.nombre

	class Meta:
		ordering = ['nombre']

class Punteo(models.Model):
	nombre = models.CharField(max_length=20)

	def __str__(self):
		return self.nombre

class Juego(models.Model):
	nombre = models.CharField(max_length=30)
	icono = models.CharField(max_length=20)
	instrucciones = models.TextField()
	categoriaJuego = models.ForeignKey(CategoriaJuego)

	def __str__(self):
		return self.nombre

	class Meta:
		ordering = ['nombre']

class NivelJuego(models.Model):
	juego = models.ForeignKey(Juego)
	nivel = models.ForeignKey(Nivel)

	def __str__(self):
		return '%s - %s' % (self.juego, self.nivel)


class TipoJuego(models.Model):
	juego = models.ForeignKey(Juego)
	tipo = models.ForeignKey(Tipo)

	def __str__(self):
		return '%s - %s' % (self.juego, self.tipo)

class PunteoJuego(models.Model):
	juego = models.ForeignKey(Juego)
	punteo = models.ForeignKey(Punteo)

	def __str__(self):
		return '%s - %s' % (self.juego, self.punteo)

class Puntuacion(models.Model):
	punteoMax = models.CharField(max_length=10)
	punteoMin = models.CharField(max_length=10)
	user = models.ForeignKey(Usuario)
	juego = models.ForeignKey(Juego)
	cod_nivel = models.ForeignKey(Nivel) #guarda el código del nivel
	cod_tipo = models.ForeignKey(Tipo, null=True) #guarda el código del tipo
	des_punteo = models.ForeignKey(Punteo) #hace ref a la descripcion del punteo

	def __str__(self):
		return '%s: %s' % (self.juego, self.des_punteo)

	class Meta:
		ordering = ['cod_nivel']