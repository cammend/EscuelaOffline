"""EscuelitaOffline URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from Core.views import *
from django.contrib.auth import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^index/', Index.as_view()),
    url(r'^juegos/(?P<slug>[-\w]+)/$', BaseJuego.as_view()),
    url(r'^juegos/(?P<slug>[-\w]+)/categoria/$', CategoriaDeJuegos.as_view()),
    url(r'^entrar/$', views.login, {'template_name': 'login.html'} ),
    url(r'^salir/$', views.logout, {'next_page': '/entrar/'} ),
    url(r'^crear/$', NuevoUsuario.as_view() ),
    url(r'^guardar_punteo/$', guardarPunteo ),
]
