from django.db import models
from django.contrib.auth.models import (
	BaseUserManager, AbstractBaseUser, PermissionsMixin
)

# Create your models here.
class ManejadorUsuario(BaseUserManager):
	def create_user(self, alias, password=None):
		if not alias:
			raise ValueError('Debe haber alias de usuario')

		user = self.model(
			alias = alias
		)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, alias, password):
		user = self.create_user(alias, password)
		user.is_admin = True
		user.save(using=self._db)
		return user

class Grado(models.Model):
	grado = models.CharField(max_length=40)

	def __str__(self):
		return self.grado

class Usuario(AbstractBaseUser):
	alias = models.CharField(max_length=20,unique=True)

	is_admin = models.BooleanField(default=False)
	is_active = models.BooleanField(default=True)

	objects = ManejadorUsuario()

	USERNAME_FIELD = 'alias'
	REQUIRED_FIELDS = []

	def get_full_name(self):
		return self.alias

	def get_short_name(self):
		return self.alias

	def is_staff(self):
		return self.is_admin

	def has_perm(self, perm, obj=None):
		return True

	def has_module_perms(self, app_label):
		return True

	def __str__(self):
		return self.alias

class GradoUsuario(models.Model):
	grado = models.ForeignKey(Grado)
	usuario = models.OneToOneField(Usuario)