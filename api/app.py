import random
from flask import Flask, request, Response, abort, jsonify, session
import datetime
from flask_cors import CORS
from models import db, User, Question, Game, Score, Friends, default_scores
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from datetime import datetime, timedelta
from init import init_db
from peewee import IntegrityError


    
class JSONResponse(Response):
    default_mimetype = 'application/json'


app = Flask(__name__)
init_db()
CORS(
    app,
    supports_credentials=True,
    resources={r"/*": {"origins": "http://localhost:5173"}}
)
app.config.update(
    SECRET_KEY="a-very-secret-string",
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",  # Change from "None" for localhost
    SESSION_COOKIE_SECURE=False,    # Keep False for localhost
    PERMANENT_SESSION_LIFETIME=timedelta(hours=24)  # Optional
)
#app.response_class = JSONResponse
app.config["SECRET_KEY"] = "a-very-secret-string"
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

if __name__ == '__main__': 
    app.run(debug=True, use_reloader=False, port=5000)
    
    
#helper functions
def recent_user():
    return User.select().order_by(User.id.desc()).limit(1).get()

def recent_game():
    return Game.select().order_by(Game.id.desc()).limit(1).get()

@app.errorhandler(404)
def not_found(error):
    response = jsonify({'error': 'Not Found', 'message': str(error)})
    print(str(error))
    response.status_code = 404
    return response

@login_manager.unauthorized_handler
def on_unauthorized():
    # Return 401 JSON instead of a redirect
    return jsonify({"error": "authentication required"}), 401
  
@login_manager.user_loader
def load_user(user_id: str):
    try:
        user_obj = User.get_or_none(User.id == int(user_id))
        return user_obj
    except Exception as e:
        app.logger.error("user_loader exception: %s", e)
        return None



@app.route('/me/', methods=["GET"])
def who_am_i():
    return get_user(current_user.username), 200

@app.route('/rankings/', methods=['GET'])
def get_user_rankings():
    if not current_user.is_authenticated:
        return {'error': 'Not authenticated'}, 401

    rankings = {}
    sports = ["basketball", "soccer", "baseball", "football", "tennis", "hockey"]
    
    for sport in sports:
        # Get all scores for this sport, ordered by score descending
        scores = (Score
                 .select(Score, User)
                 .join(User)
                 .where(Score.sport == sport)
                 .order_by(Score.score.desc()))
        
        # Convert to list to find index
        scores_list = list(scores)
        
        # Find user's score and position
        user_score = next((score for score in scores_list if score.userId == current_user), None)
        if user_score:
            position = scores_list.index(user_score) + 1  # 1-based ranking
            total_players = len(scores_list)
            rankings[sport] = {
                "position": position,
                "total_players": total_players,
                "score": user_score.score
            }
    
    return rankings

@app.route('/users/', methods=['POST', 'GET'])
def all_users():
    if request.method == 'GET':
        return list_users()
    else:
        payload = request.get_json() or {}
        # required fields
        username = payload.get('username')
        password = payload.get('password')
        if not username or not password:
            return {'error': 'username and password are required'}, 400

        try:
            if (User.get_or_none(username=username)):
                return {'error': 'username already exists'}, 400
            user = User.create(username=username, password=password, created_at=datetime.now(), id=recent_user().id + 1)
            scores = default_scores()
            for sport in scores:
                Score.create(userId=user, sport=sport, score=scores[sport])
        except Exception as e:
            return {'error': str(e)}, 400

        return {'id': user.id, 'username': user.username}, 201



@app.route('/games/', methods=['POST', 'GET'])
def all_games():
    if request.method == 'GET':
        return list_games()
    else:
        payload = request.get_json() or {}
        # required fields
        game_type = payload.get('type').replace(" ", "_").lower()
        sport = payload.get('sport')
        if not game_type or not sport:
            return {'error': 'type and sport are required'}, 400

        try:
            game = Game.create(type=game_type, sport=sport, date=datetime.now(), time=0, status="in_progress", id=recent_game().id + 1)
            sport_questions = [x for x in Question.select().where(Question.sport==sport)]
            rqs = random.sample(sport_questions, random.randint(8, 12)) #default set to pyramid amount of questions, should figure fluid amounts for rapid fire and around the horn
            game.questions.add(rqs) #mixes question difficulty here
            game.players.add([current_user])
        except Exception as e:
            return {'error': str(e)}, 400

        return {'id': game.id}, 201

@app.route('/games/<int:id>', methods=['POST', 'GET'])
def get_game(id): #implement a post method here for JoinCard in Home Screen for when other users join the game, returning the same information as GET
    
    game=Game.get_or_none(id=id)
    if game:
        gameInfo = {
            "id": game.id,
            "type": game.type,
            "players": [get_user(x.username) for x in game.players],
            "time": game.time,
            "questions": [get_question(x.id) for x in game.questions],
            "date": game.date,
            "status": game.status,
            "sport": game.sport
        }
        if request.method == 'GET':
            return gameInfo
        else:
            payload = request.get_json() or {}
            status = payload.get('status')
            time = payload.get('time')
            if game.type == "tower_of_power" and not time:
                return {'error': "Tower of Power is a one player game"}, 429
            if time:
                game.time = (datetime.now() - game.date).total_seconds()
                game.save()
            if status == "finished" or status == "in_progress":
                game.status = status
                game.save()
                return {'message': 'status updated'}, 200
            try:
                game.players.add([current_user])
            except Exception as e:
                return {'error': "You are already in this game"}, 400
            
            return {
                "id": game.id,
                "type": game.type,
                "sport": game.sport
            }
          
    else:
        return {'error': "Game " + str(id) + " not found"}, 404
    

def get_leaderboard_for_sport(sport):
    scores = Score.select().where(Score.sport == sport).order_by(Score.score.desc())
    return {x.userId.username: x.score for x in scores}


@app.route('/leaderboard/', methods=['GET'])
def get_leaderboard():
    basketball_leaderboard = get_leaderboard_for_sport("basketball")
    soccer_leaderboard = get_leaderboard_for_sport("soccer")
    football_leaderboard = get_leaderboard_for_sport("football")
    baseball_leaderboard = get_leaderboard_for_sport("baseball")
    hockey_leaderboard = get_leaderboard_for_sport("hockey")
    tennis_leaderboard = get_leaderboard_for_sport("tennis")
    #total_leaderboard = get_leaderboard_for_sport("total")
    return {
        "basketball": basketball_leaderboard,
        "soccer": soccer_leaderboard,
        "football": football_leaderboard,
        "baseball": baseball_leaderboard,
        "hockey": hockey_leaderboard,
        "tennis": tennis_leaderboard,
        #"total": total_leaderboard
    }, 200
      

@app.route('/users/<name>/', methods=['GET', 'POST', 'OPTIONS'])
def user_detail(name):
    if request.method == 'OPTIONS':
        return '', 200
        
    if request.method == 'GET':
        return get_user(name)
        
    if db.is_closed():
        db.connect()

    # 2) Look up the user (404 if not found)
    user = User.get_or_none(User.username == name)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # 3) Get the fields the client wants to change
    data = request.get_json() or {}

    # 4) Mutate the instance
    if 'password' in data and data['password'] != '':
        user.password = data['password']
        user.save()
    if 'friends' in data:
        for fname in data['friends']:
            friend = User.get_or_none(User.username == fname)
            if friend:
                existing_friendship = Friends.get_or_none(
                    (Friends.user == user) & (Friends.friend == friend)
                )
                if not existing_friendship:
                    Friends.create(user=user, friend=friend)
                    Friends.create(user=friend, friend=user)
                    return {'message': 'friend added'}, 200
                else:
                    return {'error': 'Friend already added'}, 400
            else:
              return {'error': 'Friend not found'}, 404
    if 'scores' in data:
        sports_list = list(data['scores'].keys())
        Score.delete().where(
            (Score.userId == user) & 
            (Score.sport.in_(sports_list))
        ).execute()
        for entry in data['scores']:
            sport = entry
            score = data['scores'][sport]
            if sport is not None and score is not None:
                Score.create(
                    userId=user,
                    sport=sport,
                    score=score
                )

    # 5) Save back to the database
    user.save()

    return {
        "id": user.id,
        "username": user.username,
    }

def get_user(name=None):
    user=User.get(username=name)
    if user:
        return {
            "id": user.id,
            "username": user.username,
            "scores": {score.sport: score.score for score in user.scores},
            "friends": [get_friend(f.friend.username) for f in Friends.select().where(Friends.user == user)],
            "created_at": user.created_at
        }
    else:
        return abort(404, description="User " + name + " not found")
      
def get_friend(name=None): #avoid recursion
    user=User.get(username=name) #include POST as well for adding friends
    if user:
        return {
            "id": user.id,
            "username": user.username,
            "scores": {score.sport: score.score for score in user.scores},
            "friends": [], #friends of friends will not be accessible
            "created_at": user.created_at
        }
    else:
        return abort(404, description="User " + name + " not found")

@app.route('/users/<name>/games')
def get_user_games(name=None):
    user=User.get(username=name)
    if user:
        return [get_game(x.id) for x in user.games]
    else:
        return abort(404, description="User " + name + " not found")


@app.route('/questions/<int:questionId>')
def get_question(questionId):
    question = Question.get(id=questionId)
    if question:
        return {
            "id": question.id,
            "text": question.text,
            "answer": question.answer,
            "sport": question.sport,
            "difficulty": question.difficulty
        }
    else:
        return abort(404, description="Question " + questionId + " not found")




@app.route('/login/', methods=['POST']) #login
def login():
    payload = request.get_json() or {}
    username = payload.get('username')
    password = payload.get('password')
    if not username or not password:
        return {'error': 'username and password required'}, 400

    user = User.get_or_none(User.username == username)
    if not user:
        return {'error': 'no such user'}, 404

    if not user.verify_password(password):
        return {'error': 'incorrect password'}, 401

    login_user(user)
    session['me'] = 'me'
    return {'id': user.id, 'username': user.username}, 200

@app.route('/logout/', methods=['GET']) #logout
@login_required
def logout():
    logout_user()
    return {'message': 'logged out'}, 200





#string display

def list_users():
    if db.is_closed():
        db.connect()
    u = User.select()
    items = list(map(lambda u: f"{u.id}: {u.username}", u))
    text = '\n'.join(items)
    return text, 200, {"Content-Type": "text/plain"}
  

def list_games():
    if db.is_closed():
        db.connect()
    g = Game.select()
    items = list(map(lambda g: f"{g.id}: {g.status}, {g.type}", g))
    text = '\n'.join(items)
    return text, 200, {"Content-Type": "text/plain"}
  
@app.route('/questions')
def list_questions():
    if db.is_closed():
        db.connect()
    q = Question.select()
    items = list(map(lambda q: f"{q.id}: {q.text} (Difficulty: {q.difficulty})", q))
    text = '\n'.join(items)
    return text, 200, {"Content-Type": "text/plain"}

