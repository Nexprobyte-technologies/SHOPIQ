from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AIInsight, AutoReorder, CustomerPrediction
from .serializers import AIInsightSerializer, AutoReorderSerializer, CustomerPredictionSerializer


class AIInsightViewSet(viewsets.ModelViewSet):
    queryset = AIInsight.objects.all()
    serializer_class = AIInsightSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        shop_id = self.request.query_params.get('shop_id')
        insight_type = self.request.query_params.get('type')
        if shop_id:
            qs = qs.filter(shop_id=shop_id)
        if insight_type:
            qs = qs.filter(insight_type=insight_type)
        return qs

    @action(detail=False, methods=['get'])
    def unread(self, request):
        qs = self.get_queryset().filter(is_read=False)
        return Response(AIInsightSerializer(qs, many=True).data)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        insight = self.get_object()
        insight.is_read = True
        insight.save()
        return Response({'status': 'marked as read'})

    @action(detail=True, methods=['post'])
    def mark_actioned(self, request, pk=None):
        insight = self.get_object()
        insight.is_actioned = True
        insight.action_taken = request.data.get('action_taken', '')
        insight.save()
        return Response({'status': 'actioned'})


class AutoReorderViewSet(viewsets.ModelViewSet):
    queryset = AutoReorder.objects.all()
    serializer_class = AutoReorderSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        reorder = self.get_object()
        reorder.status = 'approved'
        reorder.save()
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'])
    def send_order(self, request, pk=None):
        reorder = self.get_object()
        reorder.status = 'sent'
        reorder.order_sent_via = request.data.get('via', 'whatsapp')
        reorder.save()
        return Response({'status': 'order sent'})


class CustomerPredictionViewSet(viewsets.ModelViewSet):
    queryset = CustomerPrediction.objects.all()
    serializer_class = CustomerPredictionSerializer
    permission_classes = [permissions.IsAuthenticated]
