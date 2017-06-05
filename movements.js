var cts = require('./cts');
var cts = new cts();

var movements = function(){
    this.valid_movements = validMovements;

    function validMovements(board, color){
        var valids = [];
        var new_board = arrayToMatrixBoard(board);
        var not_vals = 0;
        for(var i=0; i<new_board.length; i++)
            for(var j=0; j<new_board[i].length; j++){
                var is_valid = isValid(i,j,color,new_board);
                if(is_valid)
                    valids.push(i*cts.board_size+j);
            }
        return valids;
    }

    function arrayToMatrixBoard(board){
        var new_board = [];
        var row = [];
        for(var i=1; i<=board.length; i++){
            row.push(board[i-1]);
            if(i !== 0 && i%cts.board_size === 0){
                new_board.push(row);
                row = [];
            }
        }
        return new_board;
    }

    function isValid(row, col, color, board){
        if(board[row][col] !== 0)
            return false;
        var oponent = (color === cts.black) ? cts.white : cts.black;
        // Left
        var direction = (col > 0) ? board[row][col-1] : -1;
        if(direction === oponent){
            if(left(row, col, board, color, oponent))            
                return true;
        }
        // Right
        direction = (col < 7) ? board[row][col+1] : -1;
        if(direction === oponent){
            if(right(row, col, board, color, oponent))            
                return true;
        }
        // Up
        direction = (row > 0) ? board[row-1][col] : -1;
        if(direction === oponent){
            if(up(row, col, board, color, oponent))            
                return true;
        }
        // Down
        direction = (row < 7) ? board[row+1][col] : -1;
        if(direction === oponent){
            if(down(row, col, board, color, oponent))            
                return true;
        }
        // Up - Left
        direction = (col > 0 && row > 0) ? board[row-1][col-1] : -1;
        if(direction === oponent){
            if(up_left(row, col, board, color, oponent))            
                return true;
        }
        // Up - Right
        direction = (col < 7 && row > 0) ? board[row-1][col+1] : -1;
        if(direction === oponent){
            if(up_right(row, col, board, color, oponent))            
                return true;
        }
        // Down - Left
        direction = (col > 0 && row > 7) ? board[row+1][col-1] : -1;
        if(direction === oponent){
            if(down_left(row, col, board, color, oponent))            
                return true;
        }
        // Down - Right
        direction = (col < 7 && row < 7) ? board[row+1][col+1] : -1;
        if(direction === oponent){
            if(down_right(row, col, board, color, oponent))            
                return true;
        }
        return false;
    }

    function left(row, col, board, color, oponent){
        var change = false;
        for(var i=col-1; i>=0; i--){
            if(board[row][i] === 0)
                return false;
            if(change && board[row][i] === color)
                return true;
            if(!change && board[row][i] === oponent)
                change = true;
        }
        return false;
    }

    function right(row, col, board, color, oponent){
        var change = false;
        for(var i=col+1; i<8; i++){
            if(board[row][i] === 0)
                return false;
            if(change && board[row][i] === color)
                return true;
            if(!change && board[row][i] === oponent)
                change = true;
        }
        return false;
    }

    function down(row, col, board, color, oponent){
        var change = false;
        for(var i=row+1; i<8; i++){
            if(board[i][col] === 0)
                return false;
            if(change && board[i][col] === color)
                return true;
            if(!change && board[i][col] === oponent)
                change = true;
        }
        return false;
    }

    function up(row, col, board, color, oponent){
        var change = false;
        for(var i=row-1; i>=0; i--){
            if(board[i][col] === 0)
                return false;
            if(change && board[i][col] === color)
                return true;
            if(!change && board[i][col] === oponent)
                change = true;
        }
        return false;
    }

    function down_left(row, col, board, color, oponent){
        var change = false;
        var j = col - 1;
        for(var i=row+1; i<8 && j>=0; i++){
            if(board[i][j] === 0)
                return false;
            if(change && board[i][j] === color)
                return true;
            if(!change && board[i][j] === oponent)
                change = true;
            j--;
        }
        return false;
    }

    function down_right(row, col, board, color, oponent){
        var change = false;
        var j = col + 1;
        for(var i=row+1; i<8 && j<8; i++){
            if(board[i][j] === 0)
                return false;
            if(change && board[i][j] === color)
                return true;
            if(!change && board[i][j] === oponent)
                change = true;
            j++;
        }
        return false;
    }

    function up_left(row, col, board, color, oponent){
        var change = false;
        var j = col - 1;
        for(var i=row-1; i>=0 && j>=0; i--){
            if(board[i][j] === 0)
                return false;
            if(change && board[i][j] === color)
                return true;
            if(!change && board[i][j] === oponent)
                change = true;
            j--;
        }
        return false;
    }

    function up_right(row, col, board, color, oponent){
        var change = false;
        var j = col + 1;
        for(var i=row-1; i>=0 && j<0; i--){
            if(board[i][j] === 0)
                return false;
            if(change && board[i][j] === color)
                return true;
            if(!change && board[i][j] === oponent)
                change = true;
            j++;
        }
        return false;
    }
}

module.exports = movements;
