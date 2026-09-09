from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta, date
from decimal import Decimal
import random

User = get_user_model()


class Command(BaseCommand):
    help = "Seed demo data for SHOPIQ (users, shop, products, customers, invoices, AI insights)"

    def handle(self, *args, **options):
        self.stdout.write("Seeding demo data...")
        self._seed_users()
        self._seed_shop()
        self._seed_categories_products()
        self._seed_invoices()
        self._seed_ai_insights()
        self.stdout.write(self.style.SUCCESS("Demo data seeded successfully!"))

    def _seed_users(self):
        from accounts.models import User
        admin = User.objects.filter(username='admin').first()
        if not admin:
            admin = User.objects.create_superuser('admin', 'admin@shopiq.com', 'admin123')
            admin.first_name = 'Marilyn'
            admin.last_name = 'Trosclair'
            admin.role = 'shop_owner'
            admin.save()

    def _seed_shop(self):
        from shops.models import Shop
        owner = User.objects.filter(username='admin').first()
        shop, _ = Shop.objects.get_or_create(
            owner=owner, name='Sri Vinayaka Stores',
            defaults={
                'shop_type': 'grocery',
                'address': '12, Gandhi Street',
                'city': 'Chennai', 'state': 'Tamil Nadu',
                'pincode': '600028', 'phone': '+91 98765 43210',
                'email': 'store@example.com', 'gst_number': '33ABCDE1234F1Z5',
                'health_score': 82,
            })
        self.shop = shop

    def _seed_categories_products(self):
        from shops.models import Shop
        from products.models import Category, Product, Supplier

        owner = User.objects.filter(username='admin').first()
        shop = Shop.objects.filter(owner=owner).first()
        if not shop:
            return

        suppliers = [
            {'name': 'Dairy Supplier Co.', 'phone': '+91 98765 43210'},
            {'name': 'United Distributors', 'phone': '+91 97654 32109'},
            {'name': 'HUL Distributor', 'phone': '+91 96543 21098'},
            {'name': 'Colgate-Palmolive', 'phone': '+91 95432 10987'},
            {'name': 'Amul Dist.', 'phone': '+91 94321 09876'},
        ]
        sup_objs = []
        for s in suppliers:
            obj, _ = Supplier.objects.get_or_create(shop=shop, name=s['name'], defaults={'phone': s['phone']})
            sup_objs.append(obj)

        categories = ['Dairy', 'Biscuits', 'Grocery', 'Detergent', 'Personal Care', 'Beverages']
        cat_objs = {}
        for c in categories:
            obj, _ = Category.objects.get_or_create(shop=shop, name=c)
            cat_objs[c] = obj

        products = [
            ('Aavin Milk 500ml', 'Dairy', 0, 24, 28, 8, 'pcs'),
            ('Parle G Glucose', 'Biscuits', 1, 8, 10, 250, 'pcs'),
            ('Tata Salt 1kg', 'Grocery', 2, 22, 28, 120, 'pkt'),
            ('Surf Excel 1kg', 'Detergent', 2, 125, 155, 5, 'pkt'),
            ('Colgate 150g', 'Personal Care', 3, 62, 78, 0, 'pcs'),
            ('Amul Butter 100g', 'Dairy', 4, 48, 58, 45, 'pcs'),
            ('Old Gold Flour 1kg', 'Grocery', 2, 38, 45, 18, 'pkt'),
            ('Kissan Jam 500g', 'Grocery', 1, 88, 110, 30, 'jar'),
            ('Lux Soap 125g', 'Personal Care', 3, 28, 38, 95, 'pcs'),
            ('Dove Shampoo 180ml', 'Personal Care', 3, 72, 95, 40, 'pcs'),
        ]

        for idx, (name, cat, sup_idx, cost, price, stock, unit) in enumerate(products):
            sku = f"P-{1001+idx}"
            if not Product.objects.filter(sku=sku).exists():
                Product.objects.create(
                    shop=shop,
                    category=cat_objs[cat],
                    supplier=sup_objs[sup_idx],
                    name=name, sku=sku,
                    cost_price=cost, selling_price=price,
                    stock_quantity=stock, min_stock_level=5, max_stock_level=500,
                    unit=unit,
                )

    def _seed_invoices(self):
        from shops.models import Shop
        from billing.models import Customer, Invoice, InvoiceItem
        from products.models import Product

        owner = User.objects.filter(username='admin').first()
        shop = Shop.objects.filter(owner=owner).first()
        if not shop or self._count_invoices() > 0:
            return

        customers = [
            {'name': 'Ramesh Kumar', 'phone': '+91 98765 43210'},
            {'name': 'Sundar Raj', 'phone': '+91 97654 32109'},
            {'name': 'Priya Sharma', 'phone': '+91 96543 21098'},
        ]
        cust_objs = []
        for c in customers:
            obj, _ = Customer.objects.get_or_create(shop=shop, name=c['name'], defaults={'phone': c['phone']})
            cust_objs.append(obj)

        products = list(Product.objects.filter(shop=shop))
        if not products:
            return

        for day_offset in range(0, 14):
            d = timezone.now() - timedelta(days=day_offset)
            for _ in range(random.randint(3, 8)):
                items = random.sample(products, k=random.randint(1, 5))
                subtotal = 0
                inv_items = []
                for p in items:
                    qty = random.randint(1, 4)
                    total = Decimal(p.selling_price) * qty
                    subtotal += total
                    inv_items.append((p, qty, total))

                invoice = Invoice.objects.create(
                    shop=shop,
                    customer=random.choice(cust_objs) if random.random() > 0.4 else None,
                    created_by=owner,
                    invoice_number=f"INV-{d.strftime('%Y%m%d')}-{random.randint(100,999)}",
                    subtotal=subtotal,
                    tax_amount=subtotal * Decimal('0.05'),
                    total_amount=subtotal * Decimal('1.05'),
                    paid_amount=subtotal * Decimal('1.05'),
                    payment_status='paid',
                    payment_mode=random.choice(['cash', 'upi', 'card']),
                    created_at=d,
                )
                for p, qty, total in inv_items:
                    InvoiceItem.objects.create(
                        invoice=invoice, product=p,
                        quantity=qty, unit_price=p.selling_price,
                        total=total,
                    )
                    p.stock_quantity -= qty
                    p.last_sold_at = d
                    p.avg_daily_sales = (p.avg_daily_sales * 13 + qty) / 14
                    if p.stock_quantity > 0:
                        p.days_of_stock = p.stock_quantity / max(p.avg_daily_sales, 0.1)
                    p.save()

    def _count_invoices(self):
        from billing.models import Invoice
        return Invoice.objects.count()

    def _seed_ai_insights(self):
        from shops.models import Shop
        from ai_insights.models import AIInsight, AutoReorder
        from products.models import Product

        owner = User.objects.filter(username='admin').first()
        shop = Shop.objects.filter(owner=owner).first()
        if not shop:
            return

        low_stock = Product.objects.filter(shop=shop, stock_quantity__lte=10).first()
        if low_stock:
            AIInsight.objects.get_or_create(
                shop=shop, insight_type='stock_alert', title=f'{low_stock.name} stock low',
                defaults={
                    'message': f'Current: {low_stock.stock_quantity} units. Predicted stock-out within 2 days at current sale rate.',
                    'priority': 'high',
                })
            AutoReorder.objects.get_or_create(
                shop=shop, product_name=low_stock.name,
                defaults={
                    'current_stock': low_stock.stock_quantity,
                    'avg_daily_sales': low_stock.avg_daily_sales or 2,
                    'expected_stockout_days': 1,
                    'suggested_quantity': 50,
                    'supplier_name': 'Dairy Supplier Co.',
                    'supplier_phone': '+91 98765 43210',
                })

        AIInsight.objects.get_or_create(
            shop=shop, insight_type='sales_drop', title='Sales down 18% today',
            defaults={
                'message': 'Evening sales dropped 22% compared to last week. Check stock-outs and promotions.',
                'priority': 'high',
            }) if not AIInsight.objects.filter(shop=shop, insight_type='sales_drop').exists() else None

        AIInsight.objects.get_or_create(
            shop=shop, insight_type='health_score', title='Business Health: 82/100',
            defaults={
                'message': 'Good overall health. Focus on profit margin and dead stock to improve.',
                'priority': 'medium',
            }) if not AIInsight.objects.filter(shop=shop, insight_type='health_score').exists() else None
