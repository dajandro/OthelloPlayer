var cts = require('./cts');
var cts = new cts();

var movements = require('./movements');
var movements = new movements();

var tools = require('./tools');
var tools = new tools();

var ia = function(){
    /*
        Object
        Attributes:
            -value: # of pieces in board (heuristic)
            -tiro: move to do based on IA
    */
    this.minimax = minimax;

    function minimax(board, color, actual_color, depth, max, min){
        var new_boards = [];

        // Caso base: tablero lleno
        if(!tools.has_empty_positions(board))
            return {value: (tools.n_pieces(board)[actual_color]), tiro: undefined};
        // Caso base: max depth alcanzado
        if(depth >= cts.max_depth)
            return {value: (tools.n_pieces(board)[actual_color]), tiro: undefined};
        
        var valid_moves = movements.valid_movements(board, actual_color);

        // No hay movimientos validos
        if(valid_moves.length === 0)
            return {value: (tools.n_pieces(board)[actual_color]), tiro: undefined};

        // Construir nuevos tableros por cada tiro valido
        for(var i=0; i<valid_moves.length; i++)
            new_boards.push({tiro: valid_moves[i], child_board: tools.new_board(board, actual_color, valid_moves[i])});

        var opponent_color = (actual_color === cts.black) ? cts.white : cts.black;

        // Maximizar o minimizar
        if(color === actual_color)
            return myMax(new_boards, color, opponent_color, depth, max, min);
        else
            return myMin(new_boards, color, opponent_color, depth, max, min);
    }

    function myMin(new_boards, color, actual_color, depth, max, min){
        var min_value = cts.inf;
        // Buscar minimo
        for(var i=0; i<new_boards.length; i++){
            var board = new_boards[i];
            min_value = Math.min(min_value, minimax(board.child_board, color, actual_color, depth+1, max, min).value);
            min = Math.min(min, min_value);
            // Poda Alpha-Beta (quitar opciones)
            if(min <= max)
                return {value: min_value, tiro: board.tiro};
        }
        // Buscar el minimo de los restantes
        var best = cts.inf;
        var best_pos = 0;
        for(var i=0; i<new_boards.length; i++){
            var board_value = tools.n_pieces(new_boards[i])[actual_color];
            if (board_value < best){
                best = board_value;
                best_pos = i;
            }
        }
        return {value: min_value, tiro: new_boards[best_pos].tiro};
    }

    function myMax(new_boards, color, actual_color, depth, max, min){
        var max_value = -cts.inf;
        // Buscar maximo
        for(var i=0; i<new_boards.length; i++){
            var board = new_boards[i];
            max_value = Math.max(max_value, minimax(board.child_board, color, actual_color, depth+1, max, min).value);
            max = Math.max(max, max_value);
            // Poda Alpha-Beta (quitar opciones)
            if(min <= max)
                return {value: max_value, tiro: board.tiro};
        }
        // Buscar el maximo de los restantes
        var best = -cts.inf;
        var best_pos = 0;
        for(var i=0; i<new_boards.length; i++){
            var board_value = tools.n_pieces(new_boards[i])[actual_color];
            if (board_value > best){
                best = board_value;
                best_pos = i;
            }
        }
        return {value: max_value, tiro: new_boards[best_pos].tiro};
    }
}

module.exports = ia;
