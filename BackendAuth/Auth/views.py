from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import RegisterationSerializer, LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken

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
            response = Response({"username": user.username, "access_token": str(refresh.access_token)}, status=status.HTTP_200_OK)
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