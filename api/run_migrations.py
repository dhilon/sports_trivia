from models import db, User, Question, Game, Score, Friends, GameQuestion
from peewee import *

# Drop all tables if they exist
db.drop_tables([User, Question, Game, Score, Friends, GameQuestion], safe=True, cascade=True)

# Drop and recreate sequences
with db.atomic():
    db.execute_sql('DROP SEQUENCE IF EXISTS user_id_seq CASCADE;')
    db.execute_sql('DROP SEQUENCE IF EXISTS question_id_seq CASCADE;')
    db.execute_sql('DROP SEQUENCE IF EXISTS game_id_seq CASCADE;')
    db.execute_sql('DROP SEQUENCE IF EXISTS score_id_seq CASCADE;')
    db.execute_sql('CREATE SEQUENCE user_id_seq START WITH 1;')
    db.execute_sql('CREATE SEQUENCE question_id_seq START WITH 1;')
    db.execute_sql('CREATE SEQUENCE game_id_seq START WITH 1;')
    db.execute_sql('CREATE SEQUENCE score_id_seq START WITH 1;')

# Create all tables
db.create_tables([User, Question, Game, Score, Friends, GameQuestion], safe=True)

# Set each sequence to the max id in its table
with db.atomic():
    db.execute_sql("SELECT setval('user_id_seq', (SELECT COALESCE(MAX(id), 1) FROM \"user\"));")
    db.execute_sql("SELECT setval('question_id_seq', (SELECT COALESCE(MAX(id), 1) FROM question));")
    db.execute_sql("SELECT setval('game_id_seq', (SELECT COALESCE(MAX(id), 1) FROM game));")
    db.execute_sql("SELECT setval('score_id_seq', (SELECT COALESCE(MAX(id), 1) FROM score));")

print("Migration applied successfully!")
