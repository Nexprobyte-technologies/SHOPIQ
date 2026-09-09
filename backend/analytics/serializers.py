from rest_framework import serializers
from .models import DailySalesSummary, WeeklyTrend, MonthlyReport


class DailySalesSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = DailySalesSummary
        fields = '__all__'


class WeeklyTrendSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyTrend
        fields = '__all__'


class MonthlyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyReport
        fields = '__all__'
