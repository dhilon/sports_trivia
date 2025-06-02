import pdb
import random
from flask import Flask, make_response, request, render_template, Response, abort, jsonify, redirect, session, url_for
import datetime
from flask_cors import CORS
from models import db, User, Question, Game, Score, Friends
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from werkzeug.security import check_password_hash
from peewee import IntegrityError
from datetime import datetime

users = [
    {
        "id": 1,
        "username": "dhilon",
        "password": "password",
        "scores": {
            "basketball": 150,
            "soccer": 20,
            "baseball": 40,
            "football": 100,
            "tennis": 55,
            "hockey": 23
        },
        "friends": ["maya", "john", "sue", "bob"],
        "created_at": datetime.now()
    },
    {
        "id": 2,
        "username": "maya",
        "password": "password2",
        "scores": {
            "basketball": 15,
            "soccer": 2,
            "baseball": 4,
            "football": 10,
            "tennis": 5,
            "hockey": 2
        },
        "friends": ["dhilon", "john", "sue", "chad"],
        "created_at": datetime.now()
    },
    {
        "id": 3,
        "username": "john",
        "password": "password3",
        "scores": {
            "basketball": 100,
            "soccer": 100,
            "baseball": 100,
            "football": 100,
            "tennis": 100,
            "hockey": 100
        },
        "friends": ["dhilon", "maya", "bob", "chad"],
        "created_at": datetime.now()
    },
    {
        "id": 4,
        "username": "sue",
        "password": "greenLeaf47",
        "scores": {
            "basketball": 95,
            "soccer": 18,
            "baseball": 42,
            "football": 88,
            "tennis": 60,
            "hockey": 25
        },
        "friends": ["dhilon", "maya", "bob", "chad"],
        "created_at": datetime.now()
    },
    {
        "id": 5,
        "username": "bob",
        "password": "skyDiver82",
        "scores": {
            "basketball": 110,
            "soccer": 22,
            "baseball": 38,
            "football": 92,
            "tennis": 50,
            "hockey": 20
        },
        "friends": ["dhilon", "john", "sue", "chad"],
        "created_at": datetime.now()
    },
    {
        "id": 6,
        "username": "chad",
        "password": "riverStone19",
        "scores": {
            "basketball": 105,
            "soccer": 25,
            "baseball": 45,
            "football": 95,
            "tennis": 52,
            "hockey": 28
        },
        "friends": ["dhilon", "maya", "john", "sue"],
        "created_at": datetime.now()
    },
    {
        "id": 7,
        "username": "alex",
        "password": "blueSky73",
        "scores": {
            "basketball": 85,
            "soccer": 30,
            "baseball": 50,
            "football": 110,
            "tennis": 48,
            "hockey": 27
        },
        "friends": ["maya", "john", "sue", "bob"],
        "created_at": datetime.now()
    },
    {
        "id": 8,
        "username": "taylor",
        "password": "sunFlower56",
        "scores": {
            "basketball": 95,
            "soccer": 15,
            "baseball": 45,
            "football": 105,
            "tennis": 62,
            "hockey": 22
        },
        "friends": ["dhilon", "maya", "chad", "alex"],
        "created_at": datetime.now()
    },
    {
        "id": 9,
        "username": "jamie",
        "password": "moonLight31",
        "scores": {
            "basketball": 100,
            "soccer": 28,
            "baseball": 48,
            "football": 90,
            "tennis": 55,
            "hockey": 30
        },
        "friends": ["john", "sue", "bob", "taylor"],
        "created_at": datetime.now()
    },
]

 

games = [
    {
        "id": 1,
        "type": "around_the_horn",
        "players": ["dhilon", "maya", "john", "sue"],
        "time": 300,
        "questions": [1, 3, 5, 7, 9],
        "date": datetime.now(),
        "status": "win",
        "sport": "basketball"
    },
    {
        "id": 2,
        "type": "pyramid",
        "players": ["dhilon"],
        "time": 200,
        "questions": [2, 4, 6, 8, 10],
        "date": datetime.now(),
        "status": "loss",
        "sport": "basketball"
    },
    {
        "id": 3,
        "type": "rapid_fire",
        "players": ["dhilon", "maya", "john", "sue"],
        "time": 300,
        "questions": [9],
        "date": datetime.now(),
        "status": "win",
        "sport": "basketball"
    },
    {
        "id": 4,
        "type": "pyramid",
        "players": ["dhilon"],
        "time": 400,
        "questions": [5],
        "date": datetime.now(),
        "status": "in progress",
        "sport": "basketball"
    }
]



questions = [
  {
    "id": 1,
    "text": "How many innings are in a standard Major League Baseball game?",
    "answer": "9",
    "sport": "baseball"
  },
  {
    "id": 2,
    "text": "How many Grand Slam tournaments are played in professional tennis each year?",
    "answer": "4",
    "sport": "tennis"
  },
  {
    "id": 3,
    "text": "Which country has won the most FIFA World Cups?",
    "answer": "Brazil",
    "sport": "soccer"
  },
  {
    "id": 4,
    "text": "How many players are on the court for one basketball team during play?",
    "answer": "5",
    "sport": "basketball"
  },
  {
    "id": 5,
    "text": "How many points is a touchdown worth in American football?",
    "answer": "6",
    "sport": "football"
  },
  {
    "id": 6,
    "text": "How many championships did Michael Jordan win with the Chicago Bulls?",
    "answer": "6",
    "sport": "basketball"
  },
  {
    "id": 7,
    "text": "How long (in minutes) is each half in a professional soccer match?",
    "answer": "45 minutes",
    "sport": "soccer"
  },
  {
    "id": 8,
    "text": "How many bases must a baseball player touch to score a run?",
    "answer": "4",
    "sport": "baseball"
  },
  {
    "id": 9,
    "text": "How many sets does a men’s Grand Slam tennis match play?",
    "answer": "5",
    "sport": "tennis"
  },
  {
    "id": 10,
    "text": "In basketball, how many points is a free throw worth?",
    "answer": "1",
    "sport": "basketball"
  },
  {
    "id": 11,
    "text": "On an ice hockey rink, how many players (including the goalie) does each team have on the ice?",
    "answer": "6",
    "sport": "hockey"
  },
  {
    "id": 12,
    "text": "How many yards is a standard American football field goal attempted from when kicked from the 20-yard line?",
    "answer": "37",
    "sport": "football"
  },
  {
    "id": 13,
    "text": "Who was the first player in NBA history to record a five-by-five (at least 5 in points, rebounds, assists, steals, and blocks) in a single game?",
    "answer": "Hakeem Olajuwon",
    "sport": "basketball"
  },
  {
    "id": 14,
    "text": "Which team holds the record for the fewest points scored in a single quarter during the shot-clock era (post–1954)?",
    "answer": "Chicago Bulls",
    "sport": "basketball"
  },
  {
    "id": 15,
    "text": "Name the only player to win the NBA MVP, Coach of the Year, and Executive of the Year awards over the course of his career.",
    "answer": "Larry Bird",
    "sport": "basketball"
  },
  {
    "id": 16,
    "text": "Who was the first undrafted player to lead the league in steals for a season?",
    "answer": "Mookie Blaylock",
    "sport": "basketball"
  },
  {
    "id": 17,
    "text": "Which player grabbed 55 rebounds in one NBA game, setting the modern (post-1973) single-game rebound record?",
    "answer": "Charles Barkley",
    "sport": "basketball"
  },
  {
    "id": 18,
    "text": "Which arena hosted the most NBA Finals games without ever hosting a championship-clinching game?",
    "answer": "Spectrum (Philadelphia)",
    "sport": "basketball"
  },
  {
    "id": 19,
    "text": "Who was the first player born and raised outside the United States to win the NBA MVP award?",
    "answer": "Nikola Jokić",
    "sport": "basketball"
  },
  {
    "id": 20,
    "text": "What coach holds the record for the longest time between first and second NBA Coach of the Year awards?",
    "answer": "Hubie Brown (1978 and 2004)",
    "sport": "basketball"
  },
  {
    "id": 21,
    "text": "Which NBA player scored in double figures in every game of a playoff series without a single teammate scoring in double figures in any game?",
    "answer": "Michael Jordan",
    "sport": "basketball"
  },
  {
    "id": 22,
    "text": "Who was the youngest player ever to record a triple-double in an NBA game?",
    "answer": "LaMelo Ball",
    "sport": "basketball"
  },
  {
    "id": 23,
    "text": "Which player holds the record for most points scored in an NBA preseason game?",
    "answer": "Kobe Bryant",
    "sport": "basketball"
  },
  {
    "id": 24,
    "text": "Who is the only player in NBA history to average at least 27 points, 10 assists, and 8 rebounds in a season?",
    "answer": "Oscar Robertson",
    "sport": "basketball"
  },
  {
    "id": 25,
    "text": "Which NBA team once played an entire season without a single player taller than 6'7\"?",
    "answer": "Miami Heat",
    "sport": "basketball"
  },
  {
    "id": 26,
    "text": "Who was the first—and remains the only—undrafted rookie to win Rookie of the Year?",
    "answer": "Wes Unseld",
    "sport": "basketball"
  },
  {
    "id": 27,
    "text": "Which player holds the NBA record for most consecutive field goals made without a miss in a single game (minimum 10 attempts)?",
    "answer": "Zach LaVine",
    "sport": "basketball"
  },
  {
    "id": 28,
    "text": "Which NBA player averaged over 7 blocks per game over a playoff series (minimum three games)?",
    "answer": "Mark Eaton",
    "sport": "basketball"
  },
  {
    "id": 29,
    "text": "Who is the only player to record at least 10 steals and 10 blocks in the same NBA game?",
    "answer": "Hakeem Olajuwon",
    "sport": "basketball"
  },
  {
    "id": 30,
    "text": "Which season featured the only quadruple-overtime Finals game in NBA history?",
    "answer": "1976",
    "sport": "basketball"
  },
  {
    "id": 31,
    "text": "Who is the tallest player ever to play in the NBA All-Star Game?",
    "answer": "Manute Bol (7'7\")",
    "sport": "basketball"
  },
  {
    "id": 32,
    "text": "Who won Rookie of the Year for the 2009 NBA draft class?",
    "answer": "Tyreke Evans",
    "sport": "basketball"
  },
  {
    "id": 33,
    "text": "Which goaltender holds the NHL record for the most career shutouts?",
    "answer": "Martin Brodeur",
    "sport": "hockey"
  },
  {
    "id": 34,
    "text": "Who was the first player in NHL history to score 50 goals in 50 games?",
    "answer": "Maurice “Rocket” Richard",
    "sport": "hockey"
  },
  {
    "id": 35,
    "text": "Which team was the first American-based franchise to win the Stanley Cup?",
    "answer": "Boston Bruins (1929)",
    "sport": "hockey"
  },
  {
    "id": 36,
    "text": "Who holds the NHL single-season record for most assists?",
    "answer": "Wayne Gretzky (163 assists)",
    "sport": "hockey"
  },
  {
    "id": 37,
    "text": "Who is the all-time leading goal scorer in international men’s soccer?",
    "answer": "Cristiano Ronaldo",
    "sport": "soccer"
  },
  {
    "id": 38,
    "text": "Which club has won the most UEFA Champions League titles?",
    "answer": "Real Madrid",
    "sport": "soccer"
  },
  {
    "id": 39,
    "text": "Who was the first African player to win the Ballon d’Or?",
    "answer": "George Weah",
    "sport": "soccer"
  },
  {
    "id": 40,
    "text": "Which goalkeeper holds the Premier League record for most consecutive clean sheets?",
    "answer": "Edwin van der Sar (14 clean sheets)",
    "sport": "soccer"
  },
  {
    "id": 41,
    "text": "Who holds the MLB record for the most career hits?",
    "answer": "Pete Rose (4,256 hits)",
    "sport": "baseball"
  },
  {
    "id": 42,
    "text": "Which pitcher holds the MLB record for the most career strikeouts?",
    "answer": "Nolan Ryan (5,714 strikeouts)",
    "sport": "baseball"
  },
  {
    "id": 43,
    "text": "Who threw the only perfect game in World Series history?",
    "answer": "Don Larsen (1956)",
    "sport": "baseball"
  },
  {
    "id": 44,
    "text": "Which franchise holds the record for the most World Series titles?",
    "answer": "New York Yankees (27 titles)",
    "sport": "baseball"
  },
  {
    "id": 45,
    "text": "Who holds the NFL record for most career passing yards?",
    "answer": "Tom Brady",
    "sport": "football"
  },
  {
    "id": 46,
    "text": "Which NFL team has the most Super Bowl victories?",
    "answer": "Pittsburgh Steelers & New England Patriots (6 each)",
    "sport": "football"
  },
  {
    "id": 47,
    "text": "Which player holds the NFL single-season sack record?",
    "answer": "Michael Strahan (22.5 sacks)",
    "sport": "football"
  },
  {
    "id": 48,
    "text": "Who holds the NFL record for most rushing yards in a single season?",
    "answer": "Eric Dickerson (2,105 yards)",
    "sport": "football"
  },
  {
    "id": 49,
    "text": "Who holds the record for most Grand Slam singles titles in men’s tennis?",
    "answer": "Novak Djokovic",
    "sport": "tennis"
  },
  {
    "id": 50,
    "text": "Who was the last player to complete the Calendar Grand Slam in women’s tennis?",
    "answer": "Steffi Graf (1988)",
    "sport": "tennis"
  },
  {
    "id": 51,
    "text": "Who was the first tennis player to win both Olympic gold and Wimbledon in the same year?",
    "answer": "Steffi Graf (1988)",
    "sport": "tennis"
  },
  {
    "id": 52,
    "text": "Who is the youngest male player to win a Grand Slam singles title in the Open Era?",
    "answer": "Michael Chang (1989 French Open, age 17)",
    "sport": "tennis"
  },
  {
    "id": 53,
    "text": "Which player has the most career goals in NHL history?",
    "answer": "Wayne Gretzky (894 goals)",
    "sport": "hockey"
  },
  {
    "id": 54,
    "text": "Which NHL team holds the record for the longest unbeaten streak in a single season?",
    "answer": "Philadelphia Flyers (35 games, 1979-80)",
    "sport": "hockey"
  },
  {
    "id": 55,
    "text": "Who was the first player to score 100 points in an NHL season?",
    "answer": "Phil Esposito (1968-69)",
    "sport": "hockey"
  },
  {
    "id": 56,
    "text": "Which goaltender has the most career wins in NHL history?",
    "answer": "Martin Brodeur (691 wins)",
    "sport": "hockey"
  },
  {
    "id": 57,
    "text": "Who holds the NHL record for the most career penalty minutes?",
    "answer": "Dave “Tiger” Williams (3,966 PIM)",
    "sport": "hockey"
  },
  {
    "id": 58,
    "text": "Which player recorded the fastest hat-trick in NHL history (from start of first goal to third goal)?",
    "answer": "Bill Mosienko (21 seconds, 1952)",
    "sport": "hockey"
  },
  {
    "id": 59,
    "text": "Which franchise has the most Stanley Cup championships?",
    "answer": "Montreal Canadiens (24 titles)",
    "sport": "hockey"
  },
  {
    "id": 60,
    "text": "Who was the first goaltender to record 60 wins in a single NHL season?",
    "answer": "Martin Brodeur (2006-07)",
    "sport": "hockey"
  },
  {
    "id": 61,
    "text": "Who holds the NHL single-season record for most points by a defenseman?",
    "answer": "Bobby Orr (139 points, 1970-71)",
    "sport": "hockey"
  },
  {
    "id": 62,
    "text": "Which player has the most career playoff points in NHL history?",
    "answer": "Wayne Gretzky (382 points)",
    "sport": "hockey"
  },
  {
    "id": 63,
    "text": "Who was the youngest player to ever play in an NHL game?",
    "answer": "Bobby Orr (age 18)",
    "sport": "hockey"
  },
  {
    "id": 64,
    "text": "Which NHL season saw the highest average goals per game?",
    "answer": "1981-82 (7.18 goals per game)",
    "sport": "hockey"
  },
  {
    "id": 65,
    "text": "Who was the first defenseman to win the Conn Smythe Trophy?",
    "answer": "Bobby Orr (1969)",
    "sport": "hockey"
  },
  {
    "id": 66,
    "text": "Which player holds the record for most overtime goals in NHL playoff history?",
    "answer": "Joe Sakic (8 OT goals)",
    "sport": "hockey"
  },
  {
    "id": 67,
    "text": "Who is the all-time leading scorer for the “Original Six” era?",
    "answer": "Gordie Howe",
    "sport": "hockey"
  },
  {
    "id": 68,
    "text": "Which team won the first Winter Classic outdoor game in NHL history?",
    "answer": "Buffalo Sabres (2008)",
    "sport": "hockey"
  },
  {
    "id": 69,
    "text": "Which player has the most career game-winning goals in NHL history?",
    "answer": "Jaromír Jágr (135 GWG)",
    "sport": "hockey"
  },
  {
    "id": 70,
    "text": "Who holds the record for the fastest skater competition in NHL All-Star Skills?",
    "answer": "Connor McDavid (13.378 seconds, 2017)",
    "sport": "hockey"
  },
  {
    "id": 71,
    "text": "Which goaltender has the lowest career goals-against average (GAA) with a minimum of 250 games played?",
    "answer": "Ken Dryden (2.24 GAA)",
    "sport": "hockey"
  },
  {
    "id": 72,
    "text": "Which player won the Hart Trophy as MVP despite missing 15 games in a season?",
    "answer": "Connor McDavid (2016-17)",
    "sport": "hockey"
  },
  {
    "id": 73,
    "text": "Which player has scored the most goals in a single Premier League season?",
    "answer": "Mohamed Salah (32 goals, 2017-18)",
    "sport": "soccer"
  },
  {
    "id": 74,
    "text": "Which national team has the most Copa América titles?",
    "answer": "Argentina (15 titles)",
    "sport": "soccer"
  },
  {
    "id": 75,
    "text": "Who is the all-time leading scorer in World Cup history (goals)?",
    "answer": "Miroslav Klose (16 goals)",
    "sport": "soccer"
  },
  {
    "id": 76,
    "text": "Which club holds the record for most consecutive UEFA Champions League final appearances?",
    "answer": "Real Madrid (3 consecutive finals, 2016–2018)",
    "sport": "soccer"
  },
  {
    "id": 77,
    "text": "Who has the most career assists in Premier League history?",
    "answer": "Ryan Giggs (162 assists)",
    "sport": "soccer"
  },
  {
    "id": 78,
    "text": "Which country won the first Women’s World Cup in 1991?",
    "answer": "United States",
    "sport": "soccer"
  },
  {
    "id": 79,
    "text": "Who holds the record for the fastest red card in Premier League history?",
    "answer": "Keith Gillespie (12 seconds)",
    "sport": "soccer"
  },
  {
    "id": 80,
    "text": "Which player has the most UEFA European Championship goals?",
    "answer": "Cristiano Ronaldo (14 goals)",
    "sport": "soccer"
  },
  {
    "id": 81,
    "text": "Who was the first player to win the Golden Boot in both the Premier League and Bundesliga?",
    "answer": "Emmanuel Adebayor",
    "sport": "soccer"
  },
  {
    "id": 82,
    "text": "Which manager has won the most UEFA Champions League titles?",
    "answer": "Carlo Ancelotti (4 titles)",
    "sport": "soccer"
  },
  {
    "id": 83,
    "text": "Who scored the only hat-trick in a World Cup final?",
    "answer": "Geoff Hurst (1966)",
    "sport": "soccer"
  },
  {
    "id": 84,
    "text": "Which club has won the most consecutive La Liga titles?",
    "answer": "Real Madrid (5 titles, 1961–1965)",
    "sport": "soccer"
  },
  {
    "id": 85,
    "text": "Who holds the record for most consecutive clean sheets in the English Football League?",
    "answer": "Edwin van der Sar (14 clean sheets, 2008–09)",
    "sport": "soccer"
  },
  {
    "id": 86,
    "text": "Which goalkeeper has the most penalty saves in Premier League history?",
    "answer": "David James (13 saves)",
    "sport": "soccer"
  },
  {
    "id": 87,
    "text": "Which player scored the winning goal in the 2010 World Cup final?",
    "answer": "Andrés Iniesta",
    "sport": "soccer"
  },
  {
    "id": 88,
    "text": "Who is the youngest player to ever play in a FIFA World Cup match?",
    "answer": "Norman Whiteside (age 17, 1982)",
    "sport": "soccer"
  },
  {
    "id": 89,
    "text": "Which manager holds the record for most Premier League wins?",
    "answer": "Sir Alex Ferguson (528 wins)",
    "sport": "soccer"
  },
  {
    "id": 90,
    "text": "Which country won back-to-back Women’s World Cups in 2015 and 2019?",
    "answer": "United States",
    "sport": "soccer"
  },
  {
    "id": 91,
    "text": "Which team has the most consecutive Major League Soccer Cup wins?",
    "answer": "Los Angeles Galaxy (2002, 2005)",
    "sport": "soccer"
  },
  {
    "id": 92,
    "text": "Who scored the fastest goal in World Cup history (10.8 seconds)?",
    "answer": "Hakan Şükür (2002)",
    "sport": "soccer"
  },
  {
    "id": 93,
    "text": "Who holds the MLB record for the most career home runs?",
    "answer": "Barry Bonds (762)",
    "sport": "baseball"
  },
  {
    "id": 94,
    "text": "Which pitcher has the most no-hitters in MLB history?",
    "answer": "Nolan Ryan (7)",
    "sport": "baseball"
  },
  {
    "id": 95,
    "text": "Who was the first designated hitter to hit 500 career home runs?",
    "answer": "David Ortiz",
    "sport": "baseball"
  },
  {
    "id": 96,
    "text": "Which player has the most consecutive games played ('Iron Man' streak) in MLB history?",
    "answer": "Cal Ripken Jr. (2,632 games)",
    "sport": "baseball"
  },
  {
    "id": 97,
    "text": "Who holds the single-season batting average record (.440)?",
    "answer": "Ted Williams (1941)",
    "sport": "baseball"
  },
  {
    "id": 98,
    "text": "Which team holds the MLB record for most wins in a single season?",
    "answer": "Seattle Mariners (116 wins, 2001)",
    "sport": "baseball"
  },
  {
    "id": 99,
    "text": "Who threw the fastest pitch ever recorded in MLB history (105.1 mph)?",
    "answer": "Aroldis Chapman",
    "sport": "baseball"
  },
  {
    "id": 100,
    "text": "Which player has the most career stolen bases in MLB history?",
    "answer": "Rickey Henderson (1,406)",
    "sport": "baseball"
  },
  {
    "id": 101,
    "text": "Which catcher has caught the most no-hitters in MLB history?",
    "answer": "Jason Varitek (4)",
    "sport": "baseball"
  },
  {
    "id": 102,
    "text": "Who holds the single-season record for most strikeouts by a batter (223)?",
    "answer": "Mark Reynolds (2009)",
    "sport": "baseball"
  },
  {
    "id": 103,
    "text": "Which pitcher recorded an 0.86 ERA in the modern (post-1900) era?",
    "answer": "Pedro Martínez (2000 AL)",
    "sport": "baseball"
  },
  {
    "id": 104,
    "text": "Who has the most career RBIs in MLB history?",
    "answer": "Hank Aaron (2,297)",
    "sport": "baseball"
  },
  {
    "id": 105,
    "text": "Which player hit for the cycle and also pitched a shutout in the same game?",
    "answer": "Babe Ruth",
    "sport": "baseball"
  },
  {
    "id": 106,
    "text": "Who holds the AL record for most hits in a single season (262)?",
    "answer": "Ichiro Suzuki (2004)",
    "sport": "baseball"
  },
  {
    "id": 107,
    "text": "Which player has won the most Gold Glove Awards?",
    "answer": "Greg Maddux (18)",
    "sport": "baseball"
  },
  {
    "id": 108,
    "text": "Who is the only player to record a 30-30 season (30 home runs, 30 stolen bases) and also win MVP that same year?",
    "answer": "Alfonso Soriano (2004)",
    "sport": "baseball"
  },
  {
    "id": 109,
    "text": "Which pitcher has the highest career batting average by a pitcher (.261)?",
    "answer": "Sandy Koufax",
    "sport": "baseball"
  },
  {
    "id": 110,
    "text": "Who holds the record for most consecutive strikeouts in a single MLB game (10)?",
    "answer": "Tom Seaver",
    "sport": "baseball"
  },
  {
    "id": 111,
    "text": "Which team had the longest postseason drought before returning to the playoffs (26 seasons)?",
    "answer": "Seattle Mariners",
    "sport": "baseball"
  },
  {
    "id": 112,
    "text": "Who is the only player to win MVP in both the AL and NL?",
    "answer": "Frank Robinson",
    "sport": "baseball"
  },
  {
    "id": 113,
    "text": "Who holds the NFL record for most career touchdown receptions?",
    "answer": "Jerry Rice (197)",
    "sport": "football"
  },
  {
    "id": 114,
    "text": "Which quarterback holds the record for most rushing touchdowns by a QB in a single season?",
    "answer": "Lamar Jackson (7, 2019)",
    "sport": "football"
  },
  {
    "id": 115,
    "text": "Who was the first defensive player to win NFL MVP?",
    "answer": "Lawrence Taylor (1986)",
    "sport": "football"
  },
  {
    "id": 116,
    "text": "Which coach holds the record for most Super Bowl wins?",
    "answer": "Bill Belichick (6)",
    "sport": "football"
  },
  {
    "id": 117,
    "text": "Who has the most career interceptions in NFL history?",
    "answer": "Paul Krause (81)",
    "sport": "football"
  },
  {
    "id": 118,
    "text": "Which NFL player has the record for most career all-purpose yards?",
    "answer": "Jerry Rice (23,546 yards)",
    "sport": "football"
  },
  {
    "id": 119,
    "text": "Who holds the record for most consecutive games with a touchdown reception?",
    "answer": "Jerry Rice (10 games)",
    "sport": "football"
  },
  {
    "id": 120,
    "text": "Which team was the first to win a Super Bowl by more than 35 points?",
    "answer": "San Francisco 49ers (Super Bowl XXIV, 55–10)",
    "sport": "football"
  },
  {
    "id": 121,
    "text": "Which player holds the record for most receiving yards in a single season (1,964)?",
    "answer": "Calvin Johnson (2012)",
    "sport": "football"
  },
  {
    "id": 122,
    "text": "Who has the most career sacks in NFL history?",
    "answer": "Bruce Smith (200)",
    "sport": "football"
  },
  {
    "id": 123,
    "text": "Which kicker holds the record for most field goals made in NFL playoff history?",
    "answer": "Adam Vinatieri",
    "sport": "football"
  },
  {
    "id": 124,
    "text": "Who is the youngest quarterback to win a Super Bowl?",
    "answer": "Ben Roethlisberger (23 years, 340 days)",
    "sport": "football"
  },
  {
    "id": 125,
    "text": "Which tight end holds the NFL record for most career touchdown receptions?",
    "answer": "Tony Gonzalez (111)",
    "sport": "football"
  },
  {
    "id": 126,
    "text": "Who was the first player to rush for over 2,000 yards in a single NFL season?",
    "answer": "O.J. Simpson (2,003 yards, 1973)",
    "sport": "football"
  },
  {
    "id": 127,
    "text": "Which player has the most return touchdowns (punt + kickoff) in NFL history?",
    "answer": "Devin Hester (20)",
    "sport": "football"
  },
  {
    "id": 128,
    "text": "Who holds the record for most career completions in NFL history?",
    "answer": "Drew Brees",
    "sport": "football"
  },
  {
    "id": 129,
    "text": "Which team holds the record for most points scored in a single NFL game (73)?",
    "answer": "Washington Redskins (1966, 72–41 vs. New York Giants)",
    "sport": "football"
  },
  {
    "id": 130,
    "text": "Who is the only player to win Super Bowl MVP playing for a losing team?",
    "answer": "Chuck Howley (Super Bowl V)",
    "sport": "football"
  },
  {
    "id": 131,
    "text": "Which wide receiver holds the record for most consecutive seasons with 1,000+ receiving yards?",
    "answer": "Jerry Rice (14 seasons)",
    "sport": "football"
  },
  {
    "id": 132,
    "text": "Who holds the NFL record for the most touchdowns in a single playoff game (6)?",
    "answer": "Eric Dickerson (1985 Divisional Round)",
    "sport": "football"
  },
  {
    "id": 133,
    "text": "Which tennis player holds the record for the most consecutive Grand Slam match wins?",
    "answer": "Don Budge (37 matches, 1937-38)",
    "sport": "tennis"
  },
  {
    "id": 134,
    "text": "Who is the only player to win all four Grand Slam tournaments and Olympic gold in singles?",
    "answer": "Serena Williams",
    "sport": "tennis"
  },
  {
    "id": 135,
    "text": "Which male player has the most consecutive weeks ranked No. 1 in ATP history?",
    "answer": "Novak Djokovic (373 weeks)",
    "sport": "tennis"
  },
  {
    "id": 136,
    "text": "Who was the first player to win the ATP Finals (year-end championship) undefeated?",
    "answer": "Ivan Lendl (1985)",
    "sport": "tennis"
  },
  {
    "id": 137,
    "text": "Which player holds the record for most mixed doubles Grand Slam titles?",
    "answer": "Margańeta Richey (42 titles total—combined men’s/women’s/doubles/mixed)?",
    "sport": "tennis"
  },
  {
    "id": 138,
    "text": "Who is the youngest player ever to win a Grand Slam doubles title?",
    "answer": "Martina Hingis (16 years, 0 months—1996 Australian Open)",
    "sport": "tennis"
  },
  {
    "id": 139,
    "text": "Which player holds the record for most aces in a single Grand Slam tournament?",
    "answer": "Ivo Karlović (102 aces, 2009 Wimbledon)",
    "sport": "tennis"
  },
  {
    "id": 140,
    "text": "Who holds the WTA record for the longest winning streak on clay (50 matches)?",
    "answer": "Serena Williams (2002–03)",
    "sport": "tennis"
  },
  {
    "id": 141,
    "text": "Which male player has the fastest recorded serve (157.2 mph)?",
    "answer": "Sam Groth",
    "sport": "tennis"
  },
  {
    "id": 142,
    "text": "Who is the only player to win the ‘Channel Slam’ (French Open and Wimbledon in same year) twice?",
    "answer": "Rod Laver (1969 and 1962)",
    "sport": "tennis"
  },
  {
    "id": 143,
    "text": "Which player holds the record for most career wins at the Australian Open (102)?",
    "answer": "Margaret Court",
    "sport": "tennis"
  },
  {
    "id": 144,
    "text": "Who was the first player to win a Grand Slam singles title as a wildcard entrant?",
    "answer": "Goran Ivanišević (2001 Wimbledon)",
    "sport": "tennis"
  },
  {
    "id": 145,
    "text": "Which female player holds the most consecutive Grand Slam singles titles in the Open Era?",
    "answer": "Martina Navratilova (6, spanning 1983 French Open–1984 US Open)",
    "sport": "tennis"
  },
  {
    "id": 146,
    "text": "Who holds the record for most consecutive wins at a single Grand Slam event (46 at French Open)?",
    "answer": "Rafael Nadal",
    "sport": "tennis"
  },
  {
    "id": 147,
    "text": "Which player holds the record for the most doubles Grand Slam titles (male)?",
    "answer": "John Newcombe (17 men’s doubles titles)",
    "sport": "tennis"
  },
  {
    "id": 148,
    "text": "Who was the first player to win a Grand Slam quarterfinal, semifinal, and final all in straight sets in a single tournament?",
    "answer": "Roger Federer (2007 Wimbledon)",
    "sport": "tennis"
  },
  {
    "id": 149,
    "text": "Which female player has the most WTA titles won in a single season (17)?",
    "answer": "Serena Williams (2013)",
    "sport": "tennis"
  },
  {
    "id": 150,
    "text": "Who holds the record for the longest women’s singles match in Grand Slam history (6 hours, 31 minutes)?",
    "answer": "Johanna Konta vs. Magda Linette (2021 Australian Open)",
    "sport": "tennis"
  },
  {
    "id": 151,
    "text": "Which player has the most career match wins on grass courts (531)?",
    "answer": "Roger Federer",
    "sport": "tennis"
  },
  {
    "id": 152,
    "text": "Who was the first player to use a two-handed backhand to win a Grand Slam singles title?",
    "answer": "Björn Borg (1976 French Open)",
    "sport": "tennis"
  }
]




      



GamePlayers = Game.players.get_through_model()
GameQuestions = Game.questions.get_through_model() #m2m models

def init_db():
    if db.is_closed():
        db.connect()
    # create tables
    #db.drop_tables([GameQuestions,GamePlayers,Score,Game,Question,Friends,User], safe=True, cascade=True)
    db.create_tables([User, Question, Game, Friends, Score, GamePlayers, GameQuestions], safe=True)

    # seed a default user if none exists
    for count in users:
        try:
            usr = User.create(
                id=count['id'],
                username=count['username'],
                defaults={
                    'created_at': count['created_at']
                }
            )
            usr.password = count['password']
            usr.save()
            friend_objects = [User.get_or_none(username=f) for f in count['friends']]
            for friend in filter(None, friend_objects):  # Skip None if user doesn't exist
                # Add one-way friendship
                Friends.get_or_create(user=usr, friend=friend)
                
                # Uncomment below if you want bidirectional friendships:
                # Friendship.get_or_create(user=friend, friend=usr)
        
        except IntegrityError:
            # A row with that PK already exists—skip it
            continue


    
    
    for count in questions:
        try:
            quest = Question.get_or_create(
                id=count['id'],
                text=count['text'],
                defaults={'answer':count['answer'], 'sport':count['sport']}
                
            )
        except IntegrityError:
            # A row with that PK already exists—skip it
            continue
        
    
    for count in games:
        try:
          gm = Game.create(
              id=count['id'],
              status=count['status'],
              defaults={
                  'type': count['type'],
                  'sport': count['sport'],
                  'date': count['date'],
                  'time': count['time']
              }
          )
          player_objs = [User.get_or_none(username=name) for name in count['players']]
          gm.players.add([p for p in player_objs if p is not None])

            # Add questions
          question_objs = [Question.get_or_none(id=qid) for qid in count['questions']]
          gm.questions.add([q for q in question_objs if q is not None])
        except IntegrityError:
            # A row with that PK already exists—skip it
            continue
            
    
    sports = ["basketball", "soccer", "baseball", "football", "tennis", "hockey"]
    for user_data in users:
        user_obj = User.get_or_none(username=user_data['username'])
        if user_obj:
            for sport, score_value in user_data['scores'].items():
                Score.get_or_create(userId=user_obj, sport=sport, defaults={'score': score_value})

    
class JSONResponse(Response):
    default_mimetype = 'application/json'


app = Flask(__name__)
init_db()
CORS(
    app,
    supports_credentials=True,
    resources={r"/*": {"origins": "http://localhost:5174"}}
)
app.config.update(
    SESSION_COOKIE_SAMESITE="None",  # allow cross-site
    SESSION_COOKIE_SECURE=False      # must be False on localhost (no HTTPS)
)
#app.response_class = JSONResponse
app.config["SECRET_KEY"] = "a-very-secret-string"
login_manager = LoginManager(app)
login_manager.login_view = "login"
login_manager.session_protection = "strong"

if __name__ == '__main__': 
    app.run(debug=True, use_reloader=False, port=5000)
    
    


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
    app.logger.debug("user_loader: looking up user_id = %r", user_id)
    try:
        user_obj = User.get_or_none(User.id == int(user_id))
        app.logger.debug("user_loader: found user = %r", user_obj)
        return user_obj
    except Exception as e:
        app.logger.error("user_loader exception: %s", e)
        return None

@app.route('/me/', methods=["GET"])
def who_am_i():
    if current_user.is_authenticated:
        return {"id": current_user.id, "username": current_user.username}, 200
    return {"error": "not authenticated"}


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
            user = User.create(username=username, password=password, created_at=datetime.now())
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
        type = payload.get('type').replace(" ", "_").lower()
        sport = payload.get('sport')
        if not type or not sport:
            return {'error': 'type and sport are required'}, 400

        try:
            game = Game.create(type=type, sport=sport, date=datetime.now(), time=0, status="in_progress") #should add currUser to list of players when that's sorted too
            sport_questions = [x for x in questions if x['sport']==sport]
            rqs = random.sample(sport_questions, random.randint(8, 12)) #default set to pyramid amount of questions, should figure fluid amounts for rapid fire and around the horn
            question_objs = [Question.get(id=qid['id']) for qid in rqs]
            game.questions = [q for q in question_objs]
        except Exception as e:
            return {'error': str(e)}, 400

        return {'id': game.id}, 201

@app.route('/games/<int:id>', methods=['POST', 'GET'])
def get_game(id): #implement a post method here for JoinCard in Home Screen for when other users join the game, returning the same information as GET
    
    game=Game.get(id=id)
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
        #else:
            #game.players.add([current_user])
            #gameInfo["players"] =  [get_user(x.username) for x in game.players]
            #return gameInfo
          
    else:
        return abort(404, description="Game " + id + " not found")
    
    
      
      
      

@app.route('/users/<name>', methods=['GET', 'PUT'])
def user_detail(name):
    if request.method == 'PUT':
        if db.is_closed():
          db.connect()

        # 2) Look up the user (404 if not found)
        user = User.get_or_none(User.username == name)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # 3) Get the fields the client wants to change
        data = request.get_json() or {}

        # 4) Mutate the instance

        if 'password' in data:
            user.password = data['password']
        if 'friends' in data:
            for friend_id in data['friends']:
                friend = User.get_or_none(User.id == friend_id)
                if friend:
                    Friends.create(user=user, friend=friend)      # for ArrayField
        if 'scores' in data:
            Score.delete().where(Score.userId == user).execute()
            for entry in data['scores']:
                sport = entry.get('sport')
                score = entry.get('score')
                if sport is not None and score is not None:
                    Score.create(
                        userId=user,
                        sport=sport,
                        score=score
                    )       # for HStoreField

        # 5) Save back to the database
        user.save()

        return {
            "id": user.id,
            "username": user.username,
            "password": user.password,
            "scores": {score.sport: score.score for score in user.scores},
            "friends": [get_friend(f.friend.username) for f in Friends.select().where(Friends.user == user)],
            "created_at": user.created_at
        }
    else:
        return get_user(name)
    
    
@login_manager.user_loader
def get_user(name=None):
    user=User.get(username=name)
    if user:
        return {
            "id": user.id,
            "username": user.username,
            "password": user.password_hash,
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
            "password": user.password_hash,
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
    question=Question.get(id=questionId)
    if question:
        return {
            "id": question.id,
            "text": question.text,
            "answer": question.answer,
            "sport": question.sport
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
    items = list(map(lambda q: f"{q.id}: {q.text}", q))
    text = '\n'.join(items)
    return text, 200, {"Content-Type": "text/plain"}