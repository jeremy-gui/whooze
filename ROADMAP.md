# Roadmap

## Next

- Authorize game actions on the server: only players of a game can read or change it, only a player can edit their own
  names, and the WebSocket checks membership of the room.
- Move the game state to the server. Turn order, remaining names and scores are currently computed in the browser of the
  active player and relayed, so a closed tab can stall a game.
- Stop sending the access token in the WebSocket URL: use a short-lived single-use ticket.
- Add automated end-to-end tests of a full four-player game, including team 2 scoring.

## Then

- Spectator-friendly scoreboard and a recap of the names at the end of a game.
- Configurable turn length, number of names and number of rounds.
- Play without an account: a nickname and a game code should be enough.
- French interface.

## Maintenance

- Replace Sass `@import` before Dart Sass 3 removes it.
- Move Angular components to standalone, signals and zoneless change detection.
- Rename the historical `times`, `timesapp` and `timesfront` modules.
- Move from SQLite to PostgreSQL if a deployment needs more than one app container.
