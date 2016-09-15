from django.shortcuts import render
from django.views.generic import TemplateView

# Create your views here.
class Index(TemplateView):
	template_name = 'index.html'

class Memory(TemplateView):
	template_name = 'juegos_tipo.html'