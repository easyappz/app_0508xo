from rest_framework import serializers

from .models import Member, Message
from .utils import hash_password, verify_password


class HelloMessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=200)
    timestamp = serializers.DateTimeField(read_only=True)


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ("id", "username", "created_at")
        read_only_fields = ("id", "username", "created_at")


class RegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)

    def validate_username(self, value: str) -> str:
        if Member.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def create(self, validated_data):
        username = validated_data["username"]
        password = validated_data["password"]
        password_hash = hash_password(password)
        member = Member.objects.create(username=username, password_hash=password_hash)
        return member


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        if not username or not password:
            raise serializers.ValidationError(
                {"non_field_errors": ["Username and password are required."]}
            )

        try:
            member = Member.objects.get(username=username)
        except Member.DoesNotExist:
            raise serializers.ValidationError(
                {"non_field_errors": ["Invalid username or password."]}
            )

        if not verify_password(password, member.password_hash):
            raise serializers.ValidationError(
                {"non_field_errors": ["Invalid username or password."]}
            )

        attrs["member"] = member
        return attrs


class MessageSerializer(serializers.ModelSerializer):
    member_username = serializers.CharField(source="member.username", read_only=True)

    class Meta:
        model = Message
        fields = ("id", "member_username", "text", "created_at")
        read_only_fields = ("id", "member_username", "created_at")

    def validate_text(self, value: str) -> str:
        if not value or not value.strip():
            raise serializers.ValidationError("Text cannot be empty.")
        return value
