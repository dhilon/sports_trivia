from models import db, Game
from peewee import TextField

# Connect to database
if db.is_closed():
    db.connect()

# Add the new column
try:
    # Add player_scores column to Game table
    db.execute_sql('ALTER TABLE "game" DROP COLUMN dead;')
    print("Successfully deleted dead column from game table!")
except Exception as e:
    print(f"Error deleting column: {e}")
    # Column might already exist

db.close()
