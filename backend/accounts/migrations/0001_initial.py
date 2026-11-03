from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    dependencies = []

    operations = [
        migrations.CreateModel(
            name="User",
            fields=[
                ("id", models.CharField(max_length=30, primary_key=True, serialize=False)),
                ("name", models.TextField()),
                ("email", models.TextField(unique=True)),
                ("password_hash", models.TextField(db_column="passwordHash")),
                ("role", models.TextField(default="STORE_OWNER")),
                ("created_at", models.DateTimeField(db_column="createdAt")),
            ],
            options={"db_table": '"User"'},
        ),
        migrations.CreateModel(
            name="Store",
            fields=[
                ("id", models.CharField(max_length=30, primary_key=True, serialize=False)),
                ("name", models.TextField()),
                ("category", models.TextField()),
                ("created_at", models.DateTimeField(db_column="createdAt")),
                ("owner", models.OneToOneField(db_column="ownerId", on_delete=django.db.models.deletion.DO_NOTHING, related_name="store", to="accounts.user")),
            ],
            options={"db_table": '"Store"'},
        ),
    ]
