from django.db import models
import secrets


class Member(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_authenticated(self):
        """Always return True so DRF treats Member as authenticated principal."""
        return True

    def __str__(self) -> str:
        return self.username


class AuthToken(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="tokens")
    key = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Token for {self.member.username}"

    @staticmethod
    def generate_key() -> str:
        """Generate a secure random token string using the standard library."""
        return secrets.token_hex(20)

    @classmethod
    def create_for_member(cls, member: Member) -> "AuthToken":
        """Helper to create a new token instance for the given member."""
        key = cls.generate_key()
        return cls.objects.create(member=member, key=key)
