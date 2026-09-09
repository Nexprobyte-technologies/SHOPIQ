from rest_framework import serializers
from .models import Shop, ShopStaff


class ShopSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)
    products_count = serializers.SerializerMethodField()
    health_score_display = serializers.SerializerMethodField()

    class Meta:
        model = Shop
        fields = '__all__'

    def get_products_count(self, obj):
        return obj.products.count()

    def get_health_score_display(self, obj):
        score = obj.health_score
        if score >= 80:
            return 'Excellent'
        elif score >= 60:
            return 'Good'
        elif score >= 40:
            return 'Fair'
        return 'Poor'


class ShopStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopStaff
        fields = '__all__'
