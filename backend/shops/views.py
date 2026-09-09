from rest_framework import viewsets, permissions
from .models import Shop, ShopStaff
from .serializers import ShopSerializer, ShopStaffSerializer


class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role in ['super_admin', 'dev_admin']:
            return Shop.objects.all()
        return Shop.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ShopStaffViewSet(viewsets.ModelViewSet):
    queryset = ShopStaff.objects.all()
    serializer_class = ShopStaffSerializer
    permission_classes = [permissions.IsAuthenticated]
