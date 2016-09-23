from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from .models import *
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic.base import View
from django.contrib.auth.forms import UserCreationForm
from django.views.generic.edit import FormView
from django.contrib.auth import login, authenticate
from GestionUser.forms import UsuarioForm

class NewUserBase(FormView):
	"""
	Clase para crear un nuevo usuario. Por defecto se usa un formulario que usa el modelo 'User'
	de django. Si se tiene un usuario personalizado se puede cambiar dicho formulario por el 
	correspondiente. Ésta clase por defecto 'crea' y 'loguea' al nuevo usuario, solo si no hay
	ningun usuario logueado! (auto_login=True), por lo que obligatoriamente hay q proporcionar
	una url para después del logue (url_for_login). Si se coloca (auto_login=False) hay que 
	definir la variable (success_url).
	"""
	form_class = UserCreationForm
	template_name = 'registrar.html'
	auto_login = True #para que al crear el usuario se inicie sesión automáticamente
	url_for_login = None #Url para redireccionar luego de loguer al nuevo usuario.

	def get_success_url(self):
		if self.auto_login: return self.url_for_login
		return self.success_url

	def form_valid(self, form):
		form.save()
		if self.auto_login and not self.request.user.is_authenticated():
			username = form.cleaned_data['username']
			password = form.cleaned_data['password1']
			user = authenticate(username=username, password=password)
			if user is not None and user.is_active:
				login(self.request, user)
		return redirect( self.get_success_url() )

	def form_invalid(self, form):
		ctx = {'form': form}
		return render(self.request, self.template_name, ctx)

	def dispatch(self, *args, **kwargs):
		if self.url_for_login is None and self.auto_login:
			raise Exception("'url_for_login' no debe ser 'None' cuando 'auto_login' sea 'True'")
		if self.success_url is None and not self.auto_login:
			raise Exception("'success_url' no debe ser 'None' cuando 'auto_login' sea 'False'")
		return super(NewUserBase, self).dispatch(*args, **kwargs)


# EJEMPLO DE USO DE NewUserBase
class NuevoUsuario(NewUserBase):
	form_class = UsuarioForm
	url_for_login = '/index/'

# Seguridad de Login
class Logueado(View):
	@method_decorator(login_required)
	def dispatch(self, *args, **kwargs):
		return super(Logueado, self).dispatch(*args, **kwargs)

# Create your views here.
class Index(ListView, Logueado):
	template_name = 'index.html'
	model = CategoriaJuego
	context_object_name = 'categoria'
	paginate_by = 3

	def get_context_data(self, **kwargs):
		context = super(Index, self).get_context_data(**kwargs)
		return context

class CategoriaDeJuegos(ListView, Logueado):
	template_name = 'juegos_categoria.html'
	slug_field = 'categoriaJuego'
	context_object_name = 'juegos'
	paginate_by = 4

	def get_queryset(self):
		return Juego.objects.filter(categoriaJuego=self.kwargs['slug'])

	def get_context_data(self, **kwargs):
		context = super(CategoriaDeJuegos, self).get_context_data(**kwargs)
		context['categoria'] = CategoriaJuego.objects.get(id=self.kwargs['slug'])
		return context

def hay_tipo(tipos):
	for t in tipos:
		return True
	return False

class BaseJuego(TemplateView, Logueado):

	def get_template_names(self):
		nombre_juego = Juego.objects.get(id=self.kwargs['slug']).nombre
		if( nombre_juego == 'Memoria Numérica' ):
			return 'Memory/memory.html'
		elif( nombre_juego == 'Memoria Inglés' ):
			return 'Memory/memory-ingles.html'
		elif( nombre_juego == 'Respuesta Múltiple Matemáticas' ):
			return 'SelectMultiple/multi_select.html'

	def get_context_data(self, **kwargs):
		context = super(BaseJuego, self).get_context_data(**kwargs)
		context['niveles'] = NivelJuego.objects.filter(juego=kwargs['slug']) #los niveles del juego
		tipo_juego = TipoJuego.objects.filter(juego=kwargs['slug'])
		context['tipo'] = tipo_juego
		context['juego_tipo'] = hay_tipo(tipo_juego) #para decirle q el juego tiene tipos
		context['juego'] = Juego.objects.get(id=kwargs['slug']) #mandamos el juego (object)
		context['punteos'] = Puntuacion.objects.filter(juego=kwargs['slug'], user=self.request.user)
		context['des_punteo'] = PunteoJuego.objects.get(juego=kwargs['slug']).punteo
		context['urlback'] = self.request.path
		return context


def guardarPunteo(request):
	if request.method == 'POST':
		idjuego = request.POST['idjuego']
		idnivel = request.POST['idnivel']
		idtipo  = request.POST['idtipo']
		urlback = request.POST['urlback']
		punteo  = request.POST['punteo']
		#obteniendo el nivel, tipo, punteo (objects)
		obj_nivel = Nivel.objects.filter(codigo=idnivel)
		obj_nivel_j = NivelJuego.objects.get(juego=idjuego, nivel=obj_nivel).nivel
		obj_tipo_j = None
		punteo_j = PunteoJuego.objects.get(juego=idjuego).punteo
		if (idtipo):
			obj_tipo  = Tipo.objects.filter(codigo=idtipo)
			obj_tipo_j  = TipoJuego.objects.get(juego=idjuego, tipo=obj_tipo).tipo
		print(obj_nivel_j)
		print(obj_tipo_j)
		print(punteo_j)

		puntuacion = None
		try:
			if (idtipo):
				puntuacion = Puntuacion.objects.get(user=request.user, 
													juego=idjuego, 
													cod_nivel=obj_nivel_j,
													cod_tipo=obj_tipo_j,
													des_punteo=punteo_j)
			else:
				puntuacion = Puntuacion.objects.get(user=request.user, 
													juego=idjuego, 
													cod_nivel=obj_nivel_j,
													des_punteo=punteo_j)
		except Exception:
			pass

		if puntuacion: #si ya existe una puntuación
			pmax = puntuacion.punteoMax
			pmin = puntuacion.punteoMin
			if (punteo > pmax):
				puntuacion.punteoMax = punteo
			elif (punteo < pmin):
				puntuacion.punteoMin = punteo
			puntuacion.save()
		else: #si no existe puntuación, agregamos una nueva
			juego = Juego.objects.get(id=idjuego)
			nivel = Nivel.objects.filter(codigo=idnivel)
			nivel_j = NivelJuego.objects.get(juego=idjuego, nivel=nivel).nivel
			tipo_j = None
			print(idtipo)
			if (idtipo):
				tipo  = Tipo.objects.filter(codigo=idtipo)
				tipo_j  = TipoJuego.objects.get(juego=idjuego, tipo=tipo).tipo

			Puntuacion.objects.create(user=request.user,
									  juego=juego,
									  cod_nivel=nivel_j,
									  cod_tipo=tipo_j,
									  des_punteo=punteo_j,
									  punteoMax=punteo,
									  punteoMin=punteo)		

	return redirect(urlback)