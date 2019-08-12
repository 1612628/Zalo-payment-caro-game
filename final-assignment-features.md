# Thathu caro 

- [Thathu caro](#thathu-caro)
  - [Features](#features)
  - [Game constraints](#game-constraints)
  - [Registry](#registry)
  - [Create game board](#create-game-board)
  - [Join game board](#join-game-board)
  - [Playing game](#playing-game)
  - [Leaderboard](#leaderboard)
  - [Create betting golds](#create-betting-golds)
  - [Chat when playing](#chat-when-playing)

## Features

- Register
- Login
- Logout
- Forgot password
- View developer team
- Create game board
- Join created game board
- Play game between two users
- Leaderboard
- Betting golds
- Chat when playing

## Game constraints

## Registry

- username is unique
- email is unique
- each new user has 20.000 golds.

## Create game board

- Standard 15x15 grid.
- Current user must has logged in.
- Golds of current user must greater or equal than the betting golds of game board.
- An unique id will be auto created for current game board.

## Join game board

- Current user must has logged in.
- Current user golds must greater or equal than the betting golds of the game board.

## Playing game

- Game board will random who be the first, host (X) or opponent (O).
- Each time turn is limited with 20 seconds, if user do not play their turn, then that user lost.
- Winning state of user:
  - Not blocking in two heads
  - Exactly 5 patterns in 

## Leaderboard

- Top 100 users golds.

## Create betting golds



## Chat when playing

- Chat with characters and emojis.
