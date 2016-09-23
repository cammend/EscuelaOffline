from django import forms
from .models import Usuario, Grado, GradoUsuario

class UsuarioForm(forms.ModelForm):
	grado = forms.ModelChoiceField(queryset=Grado.objects.all())
	password1 = forms.CharField(label='Contraseña', widget=forms.PasswordInput)
	password2 = forms.CharField(label='Confirmar Contraseña', widget=forms.PasswordInput)

	def clean_password2(self):
		# Check that the two password entries match
		password1 = self.cleaned_data.get("password1")
		password2 = self.cleaned_data.get("password2")
		if password1 and password2 and password1 != password2:
			raise forms.ValidationError("Contraseñas no coinciden!!!")
		return password2

	def save(self, commit=True):
		# Save the provided password in hashed format
		user = super(UsuarioForm, self).save(commit=False)
		user.set_password(self.cleaned_data["password1"])
		if commit:
			user.save()
			gradoU = GradoUsuario(usuario=user, grado=self.cleaned_data['grado'])
			gradoU.save()
		return user

	class Meta:
		model = Usuario
		fields = ('alias',)