from datetime import datetime
from peewee import (
    Model,
    AutoField,
    CharField,
    DateTimeField,
    ForeignKeyField,
    IntegerField,
    FloatField,
    ManyToManyField,
    TextField,
)
from playhouse.postgres_ext import PostgresqlExtDatabase
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import json

db = PostgresqlExtDatabase(
    "sports_trivia", user="dhilon", password="password", host="localhost", port=5432
)


def default_scores():
    return {
        "basketball": 100,
        "soccer": 100,
        "baseball": 100,
        "football": 100,
        "tennis": 100,
        "hockey": 100,
    }


class BaseModel(Model):
    class Meta:
        database = db


class User(BaseModel, UserMixin):
    id = AutoField(primary_key=True)
    username = CharField()
    password_hash = CharField(default=" ")
    created_at = DateTimeField(default=datetime.now())

    @property
    def password(self):
        raise AttributeError("Password is write-only")

    @password.setter
    def password(self, plaintext: str):
        # hash & store
        self.password_hash = generate_password_hash(plaintext)

    # --- verify helper for your login route -------------
    def verify_password(self, plaintext: str) -> bool:
        return check_password_hash(str(self.password_hash), plaintext)


class Friends(BaseModel):
    user = ForeignKeyField(User, backref="friendships")
    friend = ForeignKeyField(User, backref="friend_of")


class Score(BaseModel):
    id = AutoField(primary_key=True)
    userId = ForeignKeyField(User, backref="scores")
    sport = CharField()  # Switch this to a Enum with a type
    score = IntegerField()


class Question(BaseModel):
    id = AutoField(primary_key=True)
    text = CharField()
    answer = CharField()
    sport = CharField()
    difficulty = IntegerField(default=50)  # Default to middle difficulty


class Game(
    BaseModel
):  # TODO: add a num questions answered field (dict by user)and maybe more advanced stats like accuracy for multiplayer
    id = AutoField(primary_key=True)
    status = CharField()
    type = CharField()
    sport = CharField()
    date = DateTimeField(default=datetime.now())
    players = ManyToManyField(User, backref="games")
    questions = ManyToManyField(Question, backref="games")
    time = FloatField(default=0)
    player_scores = TextField(default="{}")  # Store JSON string of {player_id: score}
    current_question = IntegerField(default=0)

    def get_scores(self):
        return json.loads(str(self.player_scores)) if self.player_scores else {}

    def set_score(self, player_id, score):
        scores = self.get_scores()
        scores[str(player_id)] = score
        self.player_scores = json.dumps(scores)
        self.save()
