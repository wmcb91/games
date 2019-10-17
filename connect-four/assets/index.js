
const app = {
  game: {
    player: 'yellow',
    moves: [],
    winPositions: [],
    board: [],
  }
}

const onColumnMouseover = () => {
  // Find column id and animate token hovering over column if it is not full
  let col = $(event.target).closest('.col');
  let colId = col.attr('id').split('-')[1];

  $('.token').removeClass('red yellow');
  if (!col.hasClass('full')) {
    $(`#token-${colId}`).addClass(app.game.player);
  }
}

const onColumnMouseout = () => {
  // Remove token icon
  $('.token').removeClass('red yellow');
}

const onColumnClick = (colId) => {
  let col;
  // If column is not full, add token
  if (!isNaN(colId)) {
    col = $(`#col-${colId}`);
  } else {
    col = $(event.target).closest('.col');
    colId = Number(col.attr('id').split('-')[1]);
  }
  let rowId = app.game.board[colId].indexOf(0);
  let position = {
    col: colId,
    row: rowId
  }

  if (rowId === -1) {
    // Shouldn't be allowed
    return;
  }
  app.game.board[colId][rowId] = app.game.player;
  $(`#${colId}-${rowId}`).addClass(app.game.player);

  if (rowId === 5) {
    // Column is now full
    col.addClass('full');
  }
  app.game.moves.push(position);
  checkWin(position);
  changePlayer(colId);
}

const changePlayer = (colId) => {
  app.game.player = app.game.player == 'yellow' ? 'red': 'yellow';
  $('.token').removeClass('red yellow');
  $(`#token-${colId}`).addClass(app.game.player);
}

const checkHorizontal = (player, row) => {
  let connect = 0;
  for (let i = 0; i < 7; i++) {
    if (app.game.board[i][row] === player) {
      connect++;
      app.game.winPositions.push([i, row]);
      if (connect === 4) {
        return true;
      }
    } else {
      connect = 0;
      app.game.winPositions = [];
    }
  }
  return false;
}

const checkVertical = (player, col) => {
  let connect = 0;
  for (let i = 0; i < 6; i++) {
    if (app.game.board[col][i] === player) {
      connect++;
      app.game.winPositions.push([col, i]);
      if (connect === 4) {
        return true;
      }
    } else {
      connect = 0;
      app.game.winPositions = [];
    }
  }
  return false;
}

const checkDiagonal = (player, position) => {
  // Have to check bottom left to top right
  // Have to check top left to bottom right
  let connect = 0;
  let loops = 0;
  let bltrStart = {
    col: Math.max(0, position.col - position.row),
    row: Math.max(0, position.row - position.col),
  }

  // console.log('Diag bltr start: ', bltrStart)

  let tlbrStart = {
    col: Math.max(0, position.col + position.row - 5),
    row: Math.min(5, position.row + position.col)
  }
  // console.log('Diag tlbr start: ', tlbrStart)
  
  if (6 - bltrStart.row >= 4  && 7 - bltrStart.col >= 4) {
    let bltrLoops = Math.min(6 - bltrStart.row, 7 - bltrStart.col);
    for (let i = 0; i < bltrLoops; i++) {
      let col = bltrStart.col + i;
      let row = bltrStart.row + i;
      if (app.game.board[col][row] === player) {
        connect++;
        app.game.winPositions.push([col, row]);
        if (connect === 4) {
          return true;
        }
      } else {
        app.game.winPositions = [];
        connect = 0;
      }
    }
  }

  if (tlbrStart.row >= 3 && tlbrStart.col < 4) {
    let tlbrLoops = Math.min(tlbrStart.row + 1, 7 - tlbrStart.col);
    for (let i = 0; i < tlbrLoops; i++) {
      let col = tlbrStart.col + i;
      let row = tlbrStart.row - i;
      if (app.game.board[col][row] === player) {
        connect++;
        app.game.winPositions.push([col, row]);
        if (connect === 4) {
          return true;
        }
      } else {
        app.game.winPositions = [];
        connect = 0;
      }
    }
  }
  return false;
}

const checkTie = () => {
  // Maps if any 0's left in columns returns if any columns have space left
  return !app.game.board.map((col) => {
    return col.some(cell => !isNaN(cell))
  }).some(col => col);;
}

const checkWin = (position) => {
  if (app.game.moves.length < 7) {
    // Not enough turns for possible win
    return;
  }
  let player = app.game.board[position.col][position.row];
  app.game.winPositions = [];
  if (checkHorizontal(player, position.row) ||
      checkVertical(player, position.col)   ||
      checkDiagonal(player, position)) {
    displayWin(player);
  } else if (checkTie()) {
    displayTie();
  }
}

const displayWin = (winner) => {
  // Highlight winning connect
  // Display winner text
  $('#board').addClass('unclickable');
  $('main').prepend(`<h1 class="winner-text">${winner} player wins!</h1>`);
  $('#play-again').prop('disabled', false);
  app.game.winPositions.forEach((coords) => {
    $(`#${coords[0]}-${coords[1]}`).addClass('winner');
  });
}

const displayTie = () => {
  $('#board').addClass('unclickable');
  $('main').prepend(`<h1 class="winner-text">Tie Game!</h1>`);
  $('#play-again').prop('disabled', false);
}

const undoMove = () => {
  if (!app.game.moves.length) {
    return;
  }
  let lp = app.game.moves.pop();

  app.game.board[lp.col][lp.row] = 0;
  $(`#${lp.col}-${lp.row}`).removeClass('red yellow');
  changePlayer();
}

const setGameLogic = () => {
  app.game.totalMoves = 0;
  app.game.moves = [];
  app.game.board = [];
  for (let i = 0; i < 7; i++) {
    app.game.board[i] = [];
    for (let j = 0; j < 6; j++) {
      app.game.board[i][j] = 0;
    }
  }
}

const buildGameArea = () => {
  // Board has 7 columns and 6 rows
  let board = $('#board');
  let tokenHover = $('#token-hover-area');
  $('.winner-text').remove();
  tokenHover.html('');
  board.html('').removeClass('unclickable');
  for (let i = 0; i < 7; i++) {
    let column = $(`<div id="col-${i}" class="col"></div>`);
    for (let j = 0; j < 6; j++) {
      column.append(`<div id="${i}-${j}" class="slot"></div>`);
    }
    board.append(column);
    tokenHover.append(`<div id="token-${i}" class="token"></div>`)
  }

  $('.col').on('mouseover', onColumnMouseover);
  $('.col').on('mouseout', onColumnMouseout);
  $('.col').on('click', onColumnClick);
}

const onPlayAgainClick = () => {
  setGameLogic();
  buildGameArea();
  $('#play-again').prop('disabled', true);
}

$('#play-again').on('click', onPlayAgainClick);
$('#undo').on('click', undoMove);
setGameLogic();
buildGameArea();