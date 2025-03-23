from django.urls import path
from .views import *

urlpatterns = [
    path("register/",RegisterView.as_view(), name="register"),
    path("login/",LoginView.as_view(), name="login"),
    path("logout/",LogoutView.as_view(), name="logout"),
    path("refresh-token/",RefreshAccessTokenView.as_view(), name="refresh-token"),
    path("check-username/",CheckUsernameView.as_view(), name="check-username"),
    path("check-email/",CheckEmailView.as_view(), name="check-email"),
    path("user-info/",GetUserInfo.as_view(), name="user-info"),
    path("update-user-info/",UpdateUserInfo.as_view(), name="update-user-info"),
    path("user/",GetUsers.as_view(), name="user"),
]