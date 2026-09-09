from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = "Seed the 4 role-based admin users (Status 1-4) for the admin panels"

    ADMINS = [
        {
            'username': 'admin',
            'password': 'admin123',
            'role': 'dev_admin',
            'status': 1,
            'first_name': 'Dev',
            'last_name': 'Admin',
            'email': 'dev@shopiq.com',
        },
        {
            'username': 'superadmin',
            'password': 'superadmin@123',
            'role': 'super_admin',
            'status': 2,
            'first_name': 'Super',
            'last_name': 'Admin',
            'email': 'superadmin@shopiq.com',
        },
        {
            'username': 'billadmin',
            'password': 'billadmin@123',
            'role': 'billing_admin',
            'status': 3,
            'first_name': 'Billing',
            'last_name': 'Admin',
            'email': 'billing@shopiq.com',
        },
        {
            'username': 'stackadmin',
            'password': 'stackadmin@123',
            'role': 'stock_admin',
            'status': 4,
            'first_name': 'Stock',
            'last_name': 'Admin',
            'email': 'stock@shopiq.com',
        },
    ]

    def handle(self, *args, **options):
        for info in self.ADMINS:
            user = User.objects.filter(username=info['username']).first()
            if user:
                user.role = info['role']
                user.status = info['status']
                user.is_staff = True
                user.is_active = True
                user.set_password(info['password'])
                user.first_name = info['first_name']
                user.last_name = info['last_name']
                user.email = info['email']
                user.save()
                self.stdout.write(self.style.WARNING(f"Updated: {info['username']} (Status {info['status']})"))
            else:
                user = User.objects.create_user(
                    username=info['username'],
                    password=info['password'],
                    role=info['role'],
                    status=info['status'],
                    is_staff=True,
                    is_active=True,
                    first_name=info['first_name'],
                    last_name=info['last_name'],
                    email=info['email'],
                )
                if info['username'] == 'admin':
                    user.is_superuser = True
                    user.save()
                self.stdout.write(self.style.SUCCESS(f"Created: {info['username']} (Status {info['status']})"))

        self.stdout.write(self.style.SUCCESS("Admin roles seeded successfully!"))
