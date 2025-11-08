eval_questions = [
    {
        "question": "Who was the first player to win the NBA Slam Dunk Contest three times?",
        "answer": "Nate Robinson",
        "good_answers": [
            "Nate Robinson",
            "nate robinson",
            "NATE ROBINSON",
            "Robinson",
            "N. Robinson",
            "Nate",
        ],
        "bad_answers": [
            "Michael Jordan",
            "Kobe Bryant",
            "LeBron James",
            "Mac McClung",
            "Vince Carter",
            "Dominique Wilkins",
            "Spud Webb",
            "Harold Miner",
            "Nate Archibald",
            "Dennis Scott",
        ],
    },
    {
        "question": "Which NBA team was the first to win a championship after relocating to a different city?",
        "answer": "Minneapolis Lakers",
        "good_answers": [
            "Minneapolis Lakers",
            "minneapolis lakers",
            "Lakers",
            "The Lakers",
            "LA Lakers",
            "Los Angeles Lakers",
        ],
        "bad_answers": [
            "Golden State Warriors",
            "Philadelphia 76ers",
            "Atlanta Hawks",
            "Sacramento Kings",
            "Oklahoma City Thunder",
            "Brooklyn Nets",
            "Los Angeles Clippers",
            "Washington Wizards",
            "Charlotte Hornets",
            "Memphis Grizzlies",
        ],
    },
    {
        "question": "Which NBA player was the first to record a triple-double in a Finals game?",
        "answer": "Bob Cousy",
        "good_answers": [
            "Bob Cousy",
            "bob cousy",
            "BOB COUSY",
            "Cousy",
            "B. Cousy",
            "Robert Cousy",
        ],
        "bad_answers": [
            "Jerry West",
            "Oscar Robertson",
            "Magic Johnson",
            "Wilt Chamberlain",
            "Bill Russell",
            "LeBron James",
            "Larry Bird",
            "Elgin Baylor",
            "Jason Kidd",
            "Russell Westbrook",
        ],
    },
    {
        "question": "Who was the first international player to win the NBA MVP award?",
        "answer": "Hakeem Olajuwon",
        "good_answers": [
            "Hakeem Olajuwon",
            "hakeem olajuwon",
            "HAKEEM OLAJUWON",
            "Olajuwon",
            "Hakeem",
            "H. Olajuwon",
            "Akeem Olajuwon",
        ],
        "bad_answers": [
            "Dirk Nowitzki",
            "Giannis Antetokounmpo",
            "Steve Nash",
            "Nikola Jokic",
            "Tim Duncan",
            "Tony Parker",
            "Pau Gasol",
            "Yao Ming",
            "Patrick Ewing",
            "Luka Doncic",
        ],
    },
    {
        "question": "Which NBA team holds the record for the longest winning streak in a single season?",
        "answer": "1972 Los Angeles Lakers",
        "good_answers": [
            "1972 Los Angeles Lakers",
            "Los Angeles Lakers",
            "LA Lakers",
            "Lakers",
            "1972 Lakers",
            "72 Lakers",
            "the Lakers",
        ],
        "bad_answers": [
            "Golden State Warriors",
            "2016 Warriors",
            "Miami Heat",
            "Chicago Bulls",
            "1996 Bulls",
            "Boston Celtics",
            "Milwaukee Bucks",
            "Philadelphia 76ers",
            "Houston Rockets",
            "San Antonio Spurs",
        ],
    },
    {
        "question": "How many teams are currently in the NBA?",
        "answer": "30",
        "good_answers": [
            "30",
            "thirty",
            "Thirty",
            "THIRTY",
            "30 teams",
            "thirty teams",
        ],
        "bad_answers": ["32", "28", "29", "31", "24", "26", "16", "20", "25", "27"],
    },
    {
        "question": "Who is the current commissioner of the NBA?",
        "answer": "Adam Silver",
        "good_answers": [
            "Adam Silver",
            "adam silver",
            "ADAM SILVER",
            "Silver",
            "A. Silver",
            "Adam",
        ],
        "bad_answers": [
            "David Stern",
            "Rob Manfred",
            "Roger Goodell",
            "Gary Bettman",
            "Manfred",
            "Goodell",
            "Don Garber",
            "Larry O'Brien",
            "Paul Tagliabue",
            "Pete Rozelle",
        ],
    },
    {
        "question": "Which team holds the record for the most NBA championships?",
        "answer": "Boston Celtics",
        "good_answers": [
            "Boston Celtics",
            "boston celtics",
            "BOSTON CELTICS",
            "Celtics",
            "The Celtics",
            "Boston",
            "the Boston Celtics",
        ],
        "bad_answers": [
            "Los Angeles Lakers",
            "LA Lakers",
            "Lakers",
            "Golden State Warriors",
            "Chicago Bulls",
            "San Antonio Spurs",
            "Miami Heat",
            "Detroit Pistons",
            "Philadelphia 76ers",
            "New York Knicks",
        ],
    },
    {
        "question": "Who holds the record for the most career points in the NBA?",
        "answer": "LeBron James",
        "good_answers": [
            "LeBron James",
            "lebron james",
            "LEBRON JAMES",
            "LeBron",
            "Lebron",
            "James",
            "L. James",
            "King James",
        ],
        "bad_answers": [
            "Kareem Abdul-Jabbar",
            "Karl Malone",
            "Kobe Bryant",
            "Michael Jordan",
            "Dirk Nowitzki",
            "Wilt Chamberlain",
            "Shaquille O'Neal",
            "Carmelo Anthony",
            "Kevin Durant",
            "Stephen Curry",
        ],
    },
    {
        "question": 'Which player was known as "The Big Fundamental"?',
        "answer": "Tim Duncan",
        "good_answers": [
            "Tim Duncan",
            "tim duncan",
            "TIM DUNCAN",
            "Duncan",
            "T. Duncan",
            "Tim",
            "Timothy Duncan",
        ],
        "bad_answers": [
            "Shaquille O'Neal",
            "Karl Malone",
            "Kevin Garnett",
            "David Robinson",
            "Hakeem Olajuwon",
            "Patrick Ewing",
            "Moses Malone",
            "Bill Russell",
            "Wilt Chamberlain",
            "Kareem Abdul-Jabbar",
        ],
    },
]

from app import check_answer

correct = 0
incorrect = 0
for question in eval_questions:
    for good_answer in question["good_answers"]:
        if check_answer(question["question"], good_answer) == "True":
            correct += 1
        else:
            incorrect += 1
            print(good_answer)
    for bad_answer in question["bad_answers"]:
        if check_answer(question["question"], bad_answer) == "False":
            correct += 1
        else:
            incorrect += 1
            print(bad_answer)
print(
    f"Correct: {correct}, Incorrect: {incorrect}, Accuracy: {correct / (correct + incorrect) * 100}%"
)
