from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [("accounts", "0001_initial")]

    operations = [
        migrations.CreateModel(
            name="Customer",
            fields=[
                ("id", models.CharField(max_length=30, primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=160)),
                ("email", models.EmailField(max_length=254, unique=True)),
                ("phone", models.CharField(blank=True, max_length=40)),
                ("created_at", models.DateTimeField(db_column="createdAt")),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="Payment",
            fields=[
                ("id", models.CharField(max_length=30, primary_key=True, serialize=False)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=12)),
                ("currency", models.CharField(default="INR", max_length=3)),
                ("status", models.CharField(default="PAID", max_length=20)),
                ("payment_method", models.CharField(default="OTHER", max_length=40)),
                ("reference", models.CharField(blank=True, max_length=120)),
                ("created_at", models.DateTimeField(db_column="createdAt")),
                ("customer", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="payments", to="accounts.customer")),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]
