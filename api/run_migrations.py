from playhouse.migrate import PostgresqlMigrator, migrate
from models import db
from peewee import CharField, IntegerField  # Or whatever field you’re adding

# Initialize migrator
migrator = PostgresqlMigrator(db)

# Example Migration: Add an 'email' column to the 'user' table //need to be able to reset database and initialize database
with db.atomic():
    migrate(
        #migrator.add_column('question', 'difficulty', IntegerField(null=True)),
    )

print("Migration applied successfully!")
