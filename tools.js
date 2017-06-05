var cts = require('./cts');
var cts = new cts();

var tools = function(){
    this.new_board = newBoard;
    this.n_pieces = countPieces;
    this.has_empty_positions = hasEmptyPositions;

    function countPieces(board){
        var pieces = [];
        pieces[cts.empty] = 0;
        pieces[cts.black] = 0;
        pieces[cts.white] = 0;

        for(var i=0; i<board.length; i++)
            pieces[board[i]]++;

        return pieces;
    }

    function hasEmptyPositions(board){
        return countPieces(board)[cts.empty] > 0;
    }

    function newBoard(board, color, move){
        var board_bk = board.slice();
        var flip_positions = flipPositions(board_bk, color, move);

        for(var i=0; i<flip_positions.length; i++)
            board_bk[flip_positions[i]] = color;

        board_bk[move] = color;
        return board_bk;
    }

    function flipPositions(board, color, pos){
        var new_color = (color === cts.black) ? cts.white : cts.black;
        
        var dirs = {
            left: (-1) * cts.board_size,
            right: cts.board_size,
            down: 1,
            up: -1,
            down_left: (-1) * cts.board_size + 1,
            down_right: cts.board_size + 1,
            up_left: (-1) * cts.board_size - 1,
            up_right: cts.board_size - 1
        };
        
        var lefts = [dirs.left, dirs.down_left, dirs.up_left];
        var rights = [dirs.right, dirs.down_right, dirs.up_right];

        var marks = [];

        for(var dir in dirs){
            var move = dirs[dir];
            var actual_pos = pos;
            var flip_positions = [];
            var found_flag = false;
            var change_flag = false;
            
            while(actual_pos >= 0 && actual_pos < (cts.board_size*cts.board_size)){
                if(actual_pos !== pos){
                    if(board[actual_pos] == new_color){
                        flip_positions.push(actual_pos);
                        change_flag = true;
                    } else if (change_flag){
                        found_flag = board[actual_pos] !== cts.empty;
                        break;
                    }
                }

                if((actual_pos % cts.board_size === 0 && lefts.indexOf(move) > -1) || ((actual_pos % cts.board_size === cts.board_size-1) && rights.indexOf(move) > -1))
                    break;
                
                actual_pos += move;
            }

            if(found_flag)
                for(var i=0; i<flip_positions.length; i++)
                    marks.push(flip_positions[i]);
        }

        return marks;
    }
};

module.exports = tools;
