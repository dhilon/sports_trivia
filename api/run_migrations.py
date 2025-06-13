from models import db, User, Question, Game, Score, Friends
from peewee import *

# Drop all tables if they exist
db.drop_tables([User, Question, Game, Score, Friends], safe=True, cascade=True)

# Drop and recreate sequences

# Create all tables
db.create_tables([User, Question, Game, Score, Friends], safe=True)


print("Migration applied successfully!")
