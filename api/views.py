from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import AuthToken, Member
from .serializers import (
    LoginSerializer,
    MemberSerializer,
    MessageSerializer,
    RegistrationSerializer,
)


class HelloView(APIView):
    """A simple API endpoint that returns a greeting message."""

    @extend_schema(
        responses={200: MessageSerializer}, description="Get a hello world message"
    )
    def get(self, request):
        data = {"message": "Hello!", "timestamp": timezone.now()}
        serializer = MessageSerializer(data)
        return Response(serializer.data)


class RegisterView(APIView):
    """Register a new Member and return a token."""

    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=RegistrationSerializer,
        responses={201: MemberSerializer},
        description="Register a new member and receive an authentication token.",
    )
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        member: Member = serializer.save()
        token = AuthToken.create_for_member(member)

        member_data = MemberSerializer(member).data
        response_data = {**member_data, "token": token.key}
        return Response(response_data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """Authenticate an existing Member and return a new token."""

    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=LoginSerializer,
        responses={200: MemberSerializer},
        description="Log in an existing member and receive an authentication token.",
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        member: Member = serializer.validated_data["member"]
        token = AuthToken.create_for_member(member)

        member_data = MemberSerializer(member).data
        response_data = {**member_data, "token": token.key}
        return Response(response_data, status=status.HTTP_200_OK)


class ProfileView(APIView):
    """Return the profile of the currently authenticated Member."""

    # Uses default authentication (MemberTokenAuthentication) and IsAuthenticated

    @extend_schema(
        responses={200: MemberSerializer},
        description="Get the profile of the currently authenticated member.",
    )
    def get(self, request):
        member: Member = request.user
        serializer = MemberSerializer(member)
        return Response(serializer.data, status=status.HTTP_200_OK)
