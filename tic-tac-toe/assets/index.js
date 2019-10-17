let app = {
  startingPlayer: 'x',
  board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  games: {
    ties: 0,
    wins: {
      x: 0,
      o: 0,
    }
  }
};

const startGame = () => {
  $('#gameboard').removeClass('hidden');
  $('.square').text('').removeClass('winner x o');
  $('.text-area').text(`Player ${app.startingPlayer} begins`);
  $('#start-game').text('Reset Game');
  app.gameOver = false;
  app.winningCells = [];
  app.currentPlayer = app.startingPlayer;
  app.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
};

const changePlayerTurn = () => {
  app.currentPlayer = app.currentPlayer === 'x' ? 'o' : 'x';
  $('.text-area').text(`Player ${app.currentPlayer}'s turn`);
};

const changeStartingPlayer = () => {
  app.startingPlayer = app.startingPlayer === 'x' ? 'o' : 'x';
};

const checkWinner = () => {
  let b = app.board;
  for (let i = 0; i < 3; i++) {
    // Horizontal win
    if (b[i * 3] && b[i * 3] == b[i * 3 + 1] && b[i * 3] == b[i * 3 + 2]) {
      if (b[i * 3] == app.currentPlayer) {
        app.winningCells = [i * 3, i * 3 + 1, i * 3 + 2];
        return app.currentPlayer;
      } else {
        // Someone is cheating or I am dumb
      }
    }
    // Vertical win
    if (b[i] && b[i] == b[i + 3] && b[i] == b[i + 6]) {
      if (b[i] == app.currentPlayer) {
        app.winningCells = [i, i + 3, i + 6];
        return app.currentPlayer;
      } else {
        // Someone is cheating or I am dumb
      }
    }
  }
  
  if (b[0] && b[0] == b[4] && b[0] == b[8] && b[0] == app.currentPlayer) {
    // Diagonal Right
    app.winningCells = [0, 4, 8];
    return app.currentPlayer;
  } else if (b[2] && b[2] == b[4] && b[2] == b[6] && b[2] == app.currentPlayer) {
    // Diagonal Left
    app.winningCells = [2, 4, 6];
    return app.currentPlayer;
  } else if (!b.some(el => el === 0)) {
    return 'tie';
  }
  return false;
};

const onSquareClick = function() {
  let cp = app.currentPlayer;
  let square = $(this);
  let id = Number(square.attr('id'));
  let winner;

  if (app.board[id] !== 0 || app.gameOver) {
    return;
  }
  app.board[id] = cp;
  square.text(cp).addClass(cp);
  winner = checkWinner();
  if (winner) {
    gameOver(winner);
  } else {
    changePlayerTurn();
  }
};

const updateScores = () => {
  let totalGames = app.games.wins.x + app.games.wins.o;
  let wpX = app.games.wins.x / totalGames * 50 || 0;
  let wpO = app.games.wins.o / totalGames * 50 || 0;

  $('#player-x').find('.wins').text(app.games.wins.x);
  $('#player-o').find('.wins').text(app.games.wins.o);

  if (app.games.wins.x === 1) {
    $('#player-x').find('.plur').addClass('hidden');
  } else {
    $('#player-x').find('.plur').removeClass('hidden');
  }

  if (app.games.wins.o === 1) {
    $('#player-o').find('.plur').addClass('hidden');
  } else {
    $('#player-o').find('.plur').removeClass('hidden');
  }

  $('#favor-bar').find('.x').css('width', wpX + '%');
  $('#favor-bar').find('.o').css('width', wpO + '%');
}

const gameOver = (winner) => {
  app.gameOver = true;
  $('#start-game').text('New Game');
  if (winner === 'tie') {
    app.games.ties++;
    $('.text-area').text('Game Tied!');
  } else {
    $('.square').each((i, sq) => {
      if (app.winningCells && app.winningCells.includes(i)) {
        $(sq).addClass('winner');
      }
    });
    app.games.wins[winner]++;
    $('.text-area').text(`Player ${winner} Wins!`);
  }
  changeStartingPlayer();
  updateScores();
};

const resetScores = () => {
  window.localStorage.clear();
  app.games = {
    ties: 0,
    wins: {
      x: 0,
      o: 0,
    }
  };
  updateScores();
}

const simGame = () => {
  app.possibleMoves = [];
  app.simming = true;
  app.board.forEach((el, i) => {
    if (!el) {
      app.possibleMoves.push(i);
    }
  });

  let idx = Math.floor(Math.random() * app.possibleMoves.length);
  $('#' + app.possibleMoves[idx]).click();

  if (!app.gameOver) {
    setTimeout(simGame, 50);
  }
}

window.addEventListener('beforeunload', () => {
  window.localStorage.setItem('app', JSON.stringify(app));
});

$('#start-game').on('click', startGame);
$('#sim-game').on('click', simGame);
$('.square').on('click', onSquareClick);
$('#reset-scores').on('click', resetScores);

if (window.localStorage.getItem('app')) {
  try {
    app = JSON.parse(window.localStorage.getItem('app'));
    updateScores();
  } catch {
    console.error('Issue loading game');
  }
}

startGame();
