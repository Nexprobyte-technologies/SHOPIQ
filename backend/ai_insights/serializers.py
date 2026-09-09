from rest_framework import serializers
from .models import AIInsight, AutoReorder, CustomerPrediction


class AIInsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIInsight
        fields = '__all__'


class AutoReorderSerializer(serializers.ModelSerializer):
    class Meta:
        model = AutoReorder
        fields = '__all__'


class CustomerPredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerPrediction
        fields = '__all__'
