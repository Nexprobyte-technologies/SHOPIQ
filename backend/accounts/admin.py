from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from .models import User, generate_12_digit_password


class AutoPasswordUserCreationForm(UserCreationForm):
    """User creation that auto-generates a 12-digit password when left blank."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in ("password1", "password2"):
            self.fields[field].required = False
            self.fields[field].help_text = (
                "Leave blank to auto-generate a 12-digit numeric password."
            )

    def _post_clean(self):
        forms.ModelForm._post_clean(self)
        password = self.cleaned_data.get("password2") or ""
        if self.errors:
            return
        if password:
            try:
                validate_password(password, self.instance)
            except ValidationError as exc:
                self.add_error("password2", exc)
                return
            self.instance.set_password(password)

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        if commit:
            user.save()
        return user


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    add_form = AutoPasswordUserCreationForm
    list_display = ('username', 'email', 'role', 'status', 'is_staff', 'is_active')
    list_filter = ('role', 'status', 'is_staff', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Role & Status', {'fields': ('role', 'status', 'phone')}),
    )
    actions = ['generate_password_action']

    def save_model(self, request, obj, form, change):
        if not change and not obj.password:
            generated = generate_12_digit_password()
            obj.set_password(generated)
            super().save_model(request, obj, form, change)
            self.message_user(
                request,
                "[%s] Auto-generated 12-digit password: %s" % (obj.username, generated),
                'SUCCESS',
            )
        else:
            super().save_model(request, obj, form, change)

    @admin.action(description="Generate 12-digit password (auto)")
    def generate_password_action(self, request, queryset):
        for user in queryset:
            generated = generate_12_digit_password()
            user.set_password(generated)
            user.save(update_fields=["password"])
            self.message_user(
                request,
                "[%s] New 12-digit password: %s" % (user.username, generated),
                'SUCCESS',
            )