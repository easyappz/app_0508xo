from django.contrib.auth.hashers import check_password, make_password


def hash_password(plain_password: str) -> str:
    """Hash a plain text password using Django's password hasher."""
    return make_password(plain_password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    """Verify a plain text password against the stored hash."""
    return check_password(plain_password, password_hash)
