import os
import google.genai as genai
from google.genai import types
from models import Question, Game, db
import ast


def delete_questions_not_in_games():
    """
    Delete all questions that are not currently associated with any game.
    This helps clean up unused questions before seeding new ones.
    """
    # Ensure database connection
    if db.is_closed():
        db.connect()

    # Get all question IDs that are in at least one game
    # We'll iterate through all games and collect their question IDs
    question_ids_in_games = set()
    for game in Game.select():
        for question in game.questions:
            question_ids_in_games.add(question.id)

    # Get all question IDs
    all_question_ids = {q.id for q in Question.select(Question.id)}

    # Find questions not in any game
    questions_to_delete_ids = all_question_ids - question_ids_in_games

    if questions_to_delete_ids:
        # Delete questions not in any game
        deleted_count = (
            Question.delete().where(Question.id.in_(questions_to_delete_ids)).execute()
        )
        print(f"Deleted {deleted_count} questions not in any game")
    else:
        print("No questions to delete - all questions are in at least one game")
        deleted_count = 0

    return deleted_count


def seed_questions(sport):

    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    old_questions = Question.select().where(Question.sport == sport)

    if len(old_questions) >= 1000:
        print(f"Already have {len(old_questions)} questions for {sport}, skipping...")
        return

    nums = 1000 - len(old_questions)

    contents = f"""
Generate {nums} high-quality trivia questions about the professional {sport} league.

Your questions MUST match the style, tone, difficulty distribution, and topical patterns of the existing trivia questions in the database (listed below). 
Study these existing questions and generate NEW questions that feel like natural extensions of them.

CRITICAL RULES (STRICT):
- DO NOT invent hyper-specific statistical combinations (e.g., “most games with 0 points, 0 rebounds, 0 assists…”).
- DO NOT generate contrived “minimum X minutes” / “minimum Y attempts” type questions.
- DO NOT create fictional awards, rules, organizations, or events.
- DO NOT generate absurd or unnatural advanced-stat questions.
- DO NOT produce template-like or repetitive structures.

ALLOWED QUESTION TYPES (FOLLOW THESE):
- Championships, Finals/Playoff performances
- MVP/DPOY/ROY or similar award histories
- Trade histories, draft picks, major transactions
- Coaching/ownership histories
- Team relocations, rebrandings, franchise milestones
- Player career achievements, scoring records, accolades
- Famous games, iconic moments, rivalries
- League-wide records that are well-known and not artificially constructed
- Recent-season events (verified via web search)
- Historical events before 2015 (well-known, widely referenced)

IMPORTANT:
Your goal is to generate questions that are *similar to the existing dataset*, not random niche facts.

DIFFICULTY RULES:
- Difficulty 1–25: Very easy / casual fan level
- Difficulty 26–75: Intermediate trivia fan
- Difficulty 76–100: Hard but REAL — deep history, obscure award winners, older playoff moments, rare but meaningful records (NOT synthetic stat combos)

FORMAT:
Output ONLY objects like:
{{"question": str, "answer": str, "difficulty": int}}

SEPARATE each question object with **one blank line**.
No numbering, greetings, or extra text.
Max answer length: 50 characters.

DATA REQUIREMENTS:
- Use real web-search evidence for current seasons (2024–25, 2025).
- Half the questions must reference seasons or events before 2015.
- Half must reference seasons or events from 2015–present.
- Answers must be factually correct and verifiable.
- Questions must be UNIQUE and NOT overlap with existing ones.

DO NOT reuse or paraphrase any of these existing database questions:
{chr(10).join(q.text for q in old_questions)}

Now, generate the requested questions following all rules.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents,
        config=types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(
                thinking_budget=0
            ),  # Disables thinking
            temperature=0,
            top_p=0.9,
            tools=[types.Tool(google_search=types.GoogleSearch())],
        ),
    )

    for question in response.text.split("\n"):
        if question != "":
            try:
                question = ast.literal_eval(question)
                question_text = question["question"]
            except:
                continue

            question_answer = question["answer"].split(",")[0]
            question_difficulty = question["difficulty"]
            Question.create(
                id=Question.select().order_by(Question.id.desc()).limit(1).get().id + 1,
                sport=sport,
                text=question_text,
                answer=question_answer,
                difficulty=question_difficulty,
            )
