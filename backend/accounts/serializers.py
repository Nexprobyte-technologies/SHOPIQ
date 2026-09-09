from rest_framework import serializers
from .models import User, generate_12_digit_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'status', 'phone', 'language', 'is_active_subscription', 'is_staff', 'is_superuser']
        read_only_fields = ['id']


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    auto_password = serializers.SerializerMethodField(method_name='get_generated_password', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'auto_password', 'first_name', 'last_name', 'role', 'status', 'phone']

    def get_generated_password(self, obj):
        return getattr(obj, '_generated_password', None)

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if not password:
            password = generate_12_digit_password()
            user._generated_password = password
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
