from django.contrib import admin
from .models import DailySalesSummary, WeeklyTrend, MonthlyReport

admin.site.register(DailySalesSummary)
admin.site.register(WeeklyTrend)
admin.site.register(MonthlyReport)
