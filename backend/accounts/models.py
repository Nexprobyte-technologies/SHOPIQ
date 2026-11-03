from django.db import models

# Django manages these SQLite tables through its migrations.
class User(models.Model):
    id = models.CharField(primary_key=True, max_length=30)
    name = models.TextField()
    email = models.TextField(unique=True)
    password_hash = models.TextField(db_column="passwordHash")
    role = models.TextField(default="STORE_OWNER")
    created_at = models.DateTimeField(db_column="createdAt")

    class Meta:
        db_table = '"User"'


class Store(models.Model):
    id = models.CharField(primary_key=True, max_length=30)
    name = models.TextField()
    category = models.TextField()
    owner = models.OneToOneField(User, db_column="ownerId", on_delete=models.DO_NOTHING, related_name="store")
    created_at = models.DateTimeField(db_column="createdAt")

    class Meta:
        db_table = '"Store"'
