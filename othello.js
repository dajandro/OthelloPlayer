/*var ip = 'localhost';
var port = '3000';*/
var ip = '192.168.1.112';
var port = '3000';
var socket = require('socket.io-client')('http://'.concat(ip, ':', port));

var setup = require('./setup');
var setup = new setup('hOROZCOpo (Orozco)');

var ia = require('./ia');
var ia = new ia();

var tools = require('./tools');
var tools = new tools();

var game = {
    id: 0,
    player: 0,
    board: [],
};

var tiro = 0;

var invalid_moves = 0;
var moves = 0;

// Connect to coordinator server
socket.on('connect', function(){
    console.log('Trying to join server...');
    socket.emit('signin', {
        user_name: setup.player_id,
        tournament_id: setup.tournament_id,
        user_role: setup.user_role
    });
});

// Login sucessfull on coordinator server
socket.on('ok_signin', function(){
    console.log('Player ' + setup.player_id + " successfully joined server");
});


// Ready signal
socket.on('ready', function(data){
    game.id = data.game_id;
    game.player = data.player_turn_id;
    var board = data.board;

    game.board = board;

    // Call to IA function
    tiro = ia.minimax(game.board, game.player, game.player, 0, -Infinity, Infinity);
    console.log("Move: ", tiro);
   
    if(tiro.movement === undefined)
        invalid_moves++;
    else
        moves++;

    // Play signal
    socket.emit('play', {
        tournament_id: setup.tournament_id,
        player_turn_id: game.player,
        game_id: game.id,
        movement: Number((tiro.movement !== undefined) ? tiro.movement : Math.floor(Math.random() * 63))
    });
});

// Finish signal
socket.on('finish', function(data){
    var game_id = data.game_id;
    var player_turn_id = data.player_turn_id;
    var winner_turn_id = data.winner_turn_id;
    var board = data.board;
    var win = player_turn_id == winner_turn_id;
    
    // Print summary of match
    if(win)
        console.log("Victory!");
    else
        console.log("Lose :(");
    
    console.log("Total moves: ", moves);
    console.log("Invalid moves: ", invalid_moves);
    
    // Restart values
    game = {
        id: 0,
        player: 0,
        board: [],
    };

    move = 0;
    invalid_moves = 0;
    moves = 0;

    // Ready signal
    socket.emit('player_ready' , {
        tournament_id: setup.tournament_id,
        player_turn_id: player_turn_id,
        game_id: game_id
    });
});
