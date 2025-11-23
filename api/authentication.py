from typing import Optional, Tuple

from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.request import Request

from .models import AuthToken, Member


class MemberTokenAuthentication(BaseAuthentication):
    """Custom token-based authentication for Member using a Bearer token."""

    keyword = "Bearer"

    def authenticate(self, request: Request) -> Optional[Tuple[Member, None]]:
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            # No authorization header provided; let other authenticators (if any) run.
            return None

        prefix = f"{self.keyword} "
        if not auth_header.startswith(prefix):
            # Header is present but not in the expected format.
            raise AuthenticationFailed(
                "Invalid Authorization header format. Expected 'Bearer <token>'."
            )

        token = auth_header[len(prefix) :].strip()
        if not token:
            raise AuthenticationFailed("Authentication token is missing.")

        try:
            auth_token = AuthToken.objects.select_related("member").get(key=token)
        except AuthToken.DoesNotExist:
            raise AuthenticationFailed("Invalid or expired authentication token.")

        member = auth_token.member
        if member is None:
            raise AuthenticationFailed("Token user does not exist.")

        return member, None
