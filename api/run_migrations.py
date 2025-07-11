from models import db, Game
from peewee import TextField

# Connect to database
if db.is_closed():
    db.connect()

# Add the new column
try:
    # Add player_scores column to Game table
    db.execute_sql("ALTER TABLE game ADD COLUMN player_scores TEXT DEFAULT '{}';")
    print("Successfully added player_scores column to game table!")
except Exception as e:
    print(f"Error adding column: {e}")
    # Column might already exist

db.close()
