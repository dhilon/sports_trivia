# Sports Trivia Game

A full-stack sports trivia game built with a React frontend and a Flask backend. Users can play trivia in multiple modes, track their scores, view game history, join games, complete levels, and more.

---

## Table of Contents

1. [Tech Stack](#tech-stack)  
2. [User Interface / Screenshots](#user-interface--screenshots)  
3. [Setup & Running Locally](#setup--running-locally)  
4. [Backend API Endpoints](#backend-api-endpoints)  
5. [Frontend Components](#frontend-components)  
6. [Game Modes](#game-modes)  
7. [Future Plans](#future-plans)

---

## Tech Stack

- **Frontend**: React, SWR (for data fetching), Tailwind CSS (for styling), Vite or similar dev server
- **Backend**: Flask (Python), REST endpoints, possibly a simple database or storage
- **Authentication / Users**: basic username/password (or stubbed), tracking of users, friends, scores
- **Modes**: Pyramid, Rapid Fire, Around The Horn, etc., each with their own UI and timer logic

---

## User Interface / Screenshots

Here are some screenshots of the application and descriptions of what you see in each.

---

### Sport Cards / Home Page

![Sport Cards View](/path/to/Screenshot_2025-09-14_at_4.57.52_PM.png)  
> **Description**: This is the home/sports card view. Each card represents a sport (e.g. Basketball, Soccer, Football, Hockey, Tennis, Baseball). On the cards are images and teaser questions. One card is “Join Game” which allows entering a code to join an existing game.

---

### Game History Table / Completed / In-Progress Games

![Game History Table](/path/to/Screenshot_2025-09-14_at_4.58.26_PM.png)  
> **Description**: A table listing past games and live/in-progress ones. Columns include Status, Game Type, Sport, Date, and filtering/sorting capabilities. Shows total number of games at top right.

---

### Pyramid / Tower-of-Power Game Mode

![Pyramid Game Mode](/path/to/Screenshot_2025-09-14_at_4.58.44_PM.png)  
> **Description**: The “Tower of Power” or Pyramid game mode: multiple levels of questions stacking visually. Shows which levels are completed. A timer is shown for the current question, along with input field to answer. Displays points gained and wagered.

---

## Setup & Running Locally

### Backend

1. Navigate to the `api` folder:

    ```bash
    cd api
    ```

2. Create and activate Python virtual environment:

    ```bash
    python3 -m venv .venv
    source .venv/bin/activate        # On macOS / Linux
    # or
    .venv\Scripts\activate           # On Windows PowerShell or CMD
    ```

3. Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

4. Run the Flask app:

    ```bash
    python app.py
    ```

   By default it should start on **http://localhost:5000** (unless you configured otherwise).

---

### Frontend

1. Navigate to the `web` folder:

    ```bash
    cd web
    ```

2. Install dependencies with npm (or yarn if you use that):

    ```bash
    npm install
    ```

3. Start the frontend dev server:

    ```bash
    npm run dev
    ```

   This should launch the app at **http://localhost:5173** (or whatever port your Vite / dev server uses).

---

## Backend API Endpoints

Here are some example API endpoints you likely have in `app.py` (adjust names as your implementation uses):

| Endpoint                          | Method | Purpose                                                    |
|----------------------------------|--------|------------------------------------------------------------|
| `/api/users/<username>`          | GET    | Fetch user profile: scores, friends, etc.                 |
| `/api/games`                     | GET    | List all games (completed & in progress)                  |
| `/api/games/<gameId>`            | GET    | Fetch a single game’s details (type, questions, status)    |
| `/api/questions?sport=<sport>`   | GET    | Fetch questions filtered by sport, maybe by difficulty     |
| `/api/join_game`                 | POST   | Join existing game given a code                            |
| `/api/submit_answer`             | POST   | Submit an answer for a game / level                        |
| `/api/score`                     | POST   | Update or fetch scoring data                               |

You may have additional endpoints for authentication, friend management, updating user stats, etc.

---

## Frontend Components

Here are the main React components likely in your `web/src/components/`:

- **SportCard**: Displays sport selection cards on home screen  
- **GameHistoryTable**: A table component showing past & current games with filtering and sort (columns: status, type, sport, date, etc.)  
- **PyramidGame / TowerOfPower**: Renders the pyramid of levels, manages user progress, level completion, and shows input field + timer  
- **TimerButton / CountdownClock**: Component for countdown timer; handles pause, reset, expiration  
- **JoinGameForm**: Allows users to input a game code to join  
- **NavBar / Sidebar**: Navigation and layout wrapper around pages  
- **Dialogs / Modals**: For confirming actions, review game, view opponents, etc.

---

## Game Modes

- **Tower / Pyramid Mode**: Player completes sequential levels of increasing difficulty  
- **Rapid Fire**: Timed questions in quick succession  
- **Around The Horn**: Another format (maybe “point by point” or rotating questions)  
- **Single-player vs Multiplayer**: Some modes allow multiple players, others solo  

Each mode has its own UI rules (how many questions, timer length, scoring, level gating, etc.).

---

## Environment Variables & Configuration

You might have files like `.env` or settings in `app.py` such as:

- `FLASK_ENV=development`  
- `FLASK_APP=app.py`  
- CORS allowed origins (so your React app can fetch from Flask)  
- Possibly a proxy config in the frontend dev server so that `/api/*` routes go to `localhost:5000`

---

## Future Improvements

- Add proper authentication with sessions or JWT  
- Persist data in a database (if using in-memory, switch to SQLite or PostgreSQL)  
- Improve mobile responsiveness and accessibility  
- Add animations for level transitions or timer  
- Leaderboards and user rankings by sport  
- More game modes and difficulty settings  

---

If you include this file in your repo (e.g. `/README.md`), it will help other contributors or users understand how your project is built, how to run it, and what each view corresponds to.  

---

<img width="2048" height="1107" alt="image" src="https://github.com/user-attachments/assets/152a99fc-2a23-4093-b139-734bb65d45e8" />
<img width="2048" height="1106" alt="image" src="https://github.com/user-attachments/assets/9cbff0ba-11c0-49e5-bd7a-fa4c37556a2a" />
<img width="2048" height="1106" alt="image" src="https://github.com/user-attachments/assets/38d1d9ff-536a-4b2d-9d94-cd20ec76b594" />


