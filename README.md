# Whooze

A real-time party game to play with friends, each on their own phone or computer. Two teams, 10 names per player,
three rounds: every player writes down well-known characters or celebrities, then teammates take turns making their
team guess as many names as they can in 30 seconds.

It is for groups who want a guessing game without pen, paper or a box. One person hosts it, everybody else only needs a
browser and an account. The interface is in English.

## How a game goes

1. Create an account and start a game: you get a six-character code to share.
2. Friends join with the code and pick a team. A game needs at least two players per team.
3. Each player enters 10 names, then says they are ready.
4. The creator starts the game. The same names come back in each of the three rounds, with a 30-second turn per player.
5. The team with the most names found wins.

## Stack

- **Backend:** Python 3.14, Django 5.2, Django REST framework, Channels and Daphne for WebSockets, SimpleJWT, SQLite
- **Frontend:** Angular 22, Bootstrap 5, RxJS
- **Runtime:** Docker Compose with Redis (Channels layer) and nginx (serves the app, proxies the API and WebSockets)

## Run it

You need Docker with Compose.

```sh
cp .env.example .env
# Set DJANGO_SECRET_KEY in .env, for example to the output of: openssl rand -hex 32
docker compose up -d --build
```

Open <http://localhost:8080>. Four accounts in four browser profiles are enough to play a whole game.

The port is bound to loopback. To open it to other people, put an HTTPS reverse proxy in front and add your host name to
`DJANGO_ALLOWED_HOSTS`: access tokens travel in the WebSocket URL, so plain HTTP would expose them.

## Develop

Backend, from `backend/` with Redis running on `127.0.0.1:6379` (only needed by the live server, not by the tests):

```sh
python -m venv .venv
.venv/bin/pip install -r requirements.txt
DJANGO_DEBUG=1 .venv/bin/python manage.py migrate
DJANGO_DEBUG=1 .venv/bin/python manage.py test
DJANGO_DEBUG=1 .venv/bin/python manage.py runserver   # or: daphne times.asgi:application
```

Frontend, from `frontend/`:

```sh
npm ci
npm start   # http://localhost:4200, talks to the backend on 127.0.0.1:8000
```

## Known limits

- Any signed-in player can read and change game data, as long as they use the API directly. See [ROADMAP.md](ROADMAP.md).
- Python modules (`times`, `timesapp`) and the Angular project (`timesfront`) keep their historical names.
- Started in 2020 and modernized in 2026. Commits before 2026 were rewritten to remove generated files, a local database
  and secrets before publication.

## License

[MIT](LICENSE)
