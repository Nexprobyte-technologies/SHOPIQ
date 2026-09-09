from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Category, Supplier, Product, StockMovement
from .serializers import CategorySerializer, SupplierSerializer, ProductSerializer, StockMovementSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        shop_id = self.request.query_params.get('shop_id')
        search = self.request.query_params.get('search')
        stock_status = self.request.query_params.get('stock_status')
        category = self.request.query_params.get('category')

        if shop_id:
            qs = qs.filter(shop_id=shop_id)
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(sku__icontains=search) | Q(barcode__icontains=search))
        if stock_status == 'low':
            qs = qs.filter(stock_quantity__lte=models.F('min_stock_level'))
        if stock_status == 'out':
            qs = qs.filter(stock_quantity=0)
        if category:
            qs = qs.filter(category_id=category)
        return qs

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        products = Product.objects.filter(stock_quantity__lte=models.F('min_stock_level'))
        return Response(ProductSerializer(products, many=True).data)

    @action(detail=False, methods=['get'])
    def dead_stock(self, request):
        products = Product.objects.filter(is_dead_stock=True)
        return Response(ProductSerializer(products, many=True).data)

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        shop_id = request.query_params.get('shop_id')
        if not shop_id:
            return Response({'error': 'shop_id required'}, status=400)
        products = Product.objects.filter(shop_id=shop_id)
        total = products.count()
        low_stock = products.filter(stock_quantity__lte=models.F('min_stock_level')).count()
        out_of_stock = products.filter(stock_quantity=0).count()
        dead_stock = products.filter(is_dead_stock=True).count()
        total_value = sum(p.selling_price * p.stock_quantity for p in products)
        return Response({
            'total_products': total,
            'low_stock': low_stock,
            'out_of_stock': out_of_stock,
            'dead_stock': dead_stock,
            'total_inventory_value': float(total_value),
        })


class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [permissions.IsAuthenticated]
