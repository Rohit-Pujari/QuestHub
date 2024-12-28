from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import RegisterationSerializer, LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = RegisterationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()  # Save the user instance
                user_data = {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,  # Include other fields if required
                }
                return Response(
                    {"user": user_data, "message": "User registered successfully"},
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                return Response(
                    {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            response = Response({"username": user.username,"id": user.id, "access_token": str(refresh.access_token)}, status=status.HTTP_200_OK)
            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                secure=True,
                httponly=True,
                samesite="Strict",
                expires=30*24*60*60,
            )
            return response
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    

class RefreshAccessTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            try:
                refresh = RefreshToken(refresh_token)
                access_token = str(refresh.access_token)
                response = Response({"access_token": access_token}, status=status.HTTP_200_OK)
                response.set_cookie(
                    key='refresh_token',
                    value=str(refresh),
                    secure=True,
                    httponly=True,
                    samesite="Strict",
                    expires=30*24*60*60,
                )
                return response
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            

class LogoutView(APIView):
    
    def post(self, request):
        response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        response.delete_cookie('refresh_token')
        return response
    
class CheckUsernameView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        username = request.GET.get('username',None)
        if username:
            try:
                user = UserModel.objects.get(username=username)
                return Response({"exists": True}, status=status.HTTP_200_OK)
            except UserModel.DoesNotExist:
                return Response({"exists": False}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid username"}, status=status.HTTP_400_BAD_REQUEST)

class CheckEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        email = request.GET.get('email',None)
        if email:
            try:
                user = UserModel.objects.get(email=email)
                return Response({"exists": True}, status=status.HTTP_200_OK)
            except UserModel.DoesNotExist:
                return Response({"exists": False}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid username"}, status=status.HTTP_400_BAD_REQUEST)
    
class GetUserInfo(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        user = request.GET.get('userId',None)
        if user:
            try:
                user = UserModel.objects.get(id=user)
                user_data = {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,  # Include other fields if required
                }
            except UserModel.DoesNotExist:
                return Response({"exists": False}, status=status.HTTP_200_OK)
        
        return Response({"user": user_data}, status=status.HTTP_200_OK)