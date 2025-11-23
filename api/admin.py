from django.contrib import admin

from .models import Member, AuthToken


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "created_at")
    search_fields = ("username",)
    readonly_fields = ("created_at",)


@admin.register(AuthToken)
class AuthTokenAdmin(admin.ModelAdmin):
    list_display = ("id", "member", "key", "created_at")
    search_fields = ("member__username", "key")
    readonly_fields = ("created_at",)
