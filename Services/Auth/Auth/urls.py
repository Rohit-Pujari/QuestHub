from django.urls import path
from .views import *

urlpatterns = [
    path("register/",RegisterView.as_view(), name="register"),
    path("login/",LoginView.as_view(), name="login"),
    path("logout/",LogoutView.as_view(), name="logout"),
    path("refresh-token/",RefreshAccessTokenView.as_view(), name="refresh-token"),
    path("check-username/",CheckUsernameView.as_view(), name="check-username"),
    path("check-email/",CheckEmailView.as_view(), name="check-email"),
]