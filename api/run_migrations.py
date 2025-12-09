from models import db, Game
from peewee import TextField

# Connect to database
if db.is_closed():
    db.connect()

# Add the new column
try:
    # Add player_scores column to Game table
    db.execute_sql('ALTER TABLE "user" ADD COLUMN profile_picture TEXT;')
    print("Successfully added profile picture column to user table!")
except Exception as e:
    print(f"Error adding profile picture column to user table: {e}")
    # Column might already exist

db.close()
