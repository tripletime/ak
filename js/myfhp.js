/*
 * fhp parameters
 */

var life = document.getElementById('fhpModel');
var cellSize = 6;
var sizeX = 48;
var sizeY = sizeX;
var sizeZ = 7;
var newSizeX = 2 * sizeX;
var newSizeY = 2 * sizeY - 1;
life.width = cellSize * newSizeX;
life.height = cellSize * newSizeY;
var context = life.getContext('2d');

var pro = document.getElementById('probability');
var probability = pro.value;
var pause = true;

var range = document.getElementById('myRange');
var wallX = range.value;
var rangeS = document.getElementById('myRangeS');
var wallY = rangeS.value;
var gapsButton = document.getElementById('gapsButton');
var aliv = 0;

var arr = [];
var tab = [];
var displayTab = [];
var i, j, k, current_value
var s = 50;
var randomFill = true;
var gaps = false;

/*
 * math functions
 */

function round(value, x) {
    x = (!x ? 2 : x);
    return Math.round(value * Math.pow(10, x)) / Math.pow(10, x);
}

function ob(value) {
	return Math.round(value);
}

/*
 * copy table
 */

function setTab(x, y) {
	for (i = 0; i < sizeX; i += 1) {
		for (j = 0; j < sizeY; j += 1) {
            for (k = 0; k < sizeZ; k += 1) {
                x[i][j][k] = y[i][j][k];
                y[i][j][k] = -1;
            }
		}
	}
}

/*
 * build array
 */

function arrayBuild() {
	arr = [newSizeX];
	for (i = 0; i < newSizeX; i += 1) {
		arr[i] = [newSizeY];
	}
}
arrayBuild();

function tableBuild() {
    tab = [sizeX];
    displayTab = [sizeX];
    for (i = 0; i < sizeX; i += 1) {
        tab[i] = [sizeY];
        displayTab[i] = [sizeY];
        for (j = 0; j < sizeY; j += 1) {
            tab[i][j] = [sizeZ];
            displayTab[i][j] = [sizeZ];
            for (k = 0; k < sizeZ; k += 1) {
                tab[i][j][k] = -1;
                displayTab[i][j][k] = -1;
            }
        }
    }
}
tableBuild();

/*
 * show parameters
 */

function setProb(value) {
	if (value >= 0.5 && value <= 100.0) {
		probability = round(value, 2);
	} else {
		pro.value = 10.00;
		probability = 10.00;
		alert("Enter a number between 0.5 and 100.0");
	}
	randomFillGame();
	firstStep();
}

function showAlive(value) {
	var ali = document.getElementById('alive');
    var aliM = document.getElementById('aliveM');
    var aliright = document.getElementById('aliveright');
    var alirightM = document.getElementById('aliverightM');
	ali.value = round(value, 2);
    aliM.value = ali.value;
    aliright.value = round(100 - value, 2);
    alirightM.value = aliright.value;
}

function showWall(value) {
    wallX = value;
    randomFillGame();
    firstStep();
}

function showWallS(value) {
    wallY = value;
    randomFillGame();
    firstStep();
}

function countAlive() {
    aliv = 0;
    var alive = 0;
	aliv = display(aliv);
    for (i = 0; i < wallX; i += 1) {
		for (j = 0; j < newSizeY; j += 1) {
			if (arr[i][j] >= 1 && arr[i][j] <= 6) {
                alive++;
            }
        }
    }
    showAlive(100 * alive / aliv);
}

function speed(value) {
    s = value;
}

function gap() {
    if (gaps === false) {
        gaps = true;
    }
    else if (gaps == true) {
        gaps = false;
    }
}

/*
 * basic drawing on array
 */

function triangles() {
    for (i = 0; i < newSizeX; i += 1) {
        for (j = 0; j < newSizeY; j += 1) {
            if (j % 4 == 0 && i % 2 == 0) {
                arr[i][j] = -1;
            }
            else if (j % 4 == 2 && i % 2 == 1) {
                arr[i][j] = -1;
            }
            else {
                arr[i][j] = 0;
            }
        }
    }
}

function frames() {
    for (i = 0; i < newSizeX; i += 1) {
        for (j = 0; j < newSizeY; j += 1) {
            if (i == 0 || j == 0 || i == newSizeX - 1 || j == newSizeY - 1) {
                arr[i][j] = 50;
            }
        }
    }
}

function wall(value, values) {
	for (i = 1; i <= value; i += 1) {
		for (j = 1; j < newSizeY - 1; j += 1) {
			if (i != Math.round(value)) {
                if (randomFill === true) {
                    if (Math.abs(100 * Math.random()) < probability && (arr[i][j] == -1 || arr[i][j] == 1)) {
                        // czerwony o kierunkach różnych
                        arr[i][j] = Math.round(Math.random() * 5) + 1; 
                    }
                    else {
                        continue;
                    }
                }
			}
			else if (j < newSizeX / 2 + Math.round(values) && j > newSizeX / 2 - Math.round(values)) {
                // tu odjac jakby mialy byc rowne przegrody od dolu i gory
				continue;
			}
			else {
                //zielona sciana
				arr[value][j] = 50;
			}
		}
	}
}

/*
 * swap xy to xyz
 */

function makeTab() {
    for (i = 0; i < sizeX; i += 1) {
        for (j = 0; j < sizeY; j += 1) {
            for (k = 0; k < sizeZ; k += 1) {
                tab[i][j][k] = -1;
            }
            if (j % 2 == 0) {
                current_value = arr[i*2][j*2];
                if (current_value >= 1 && current_value <= 6) {
                    tab[i][j][current_value] = current_value;
                }
                else if (current_value == 50) {
                    tab[i][j][0] = current_value;
                }
            }
            else if (j % 2 == 1) {
                current_value = arr[i*2+1][j*2];
                if (current_value >= 1 && current_value <= 6) {
                    tab[i][j][current_value] = current_value;
                }
                else if (current_value == 50) {
                    tab[i][j][0] = current_value;
                }
            }            
        }
    }
}

/*
 * swap xyz to xy
 */

function makeArr() {
    triangles();
    if (gaps === true) {
        frames();
        for (i = wallX; i <= wallX; i += 1) {
            for (j = 1; j < newSizeY - 1; j += 1) {
                if (j < newSizeX / 2 + Math.round(wallY) && j > newSizeX / 2 - Math.round(wallY)) {
                    // tu odjac jakby mialy byc rowne przegrody od dolu i gory
                    continue;
                }
                else {
                    //zielona sciana
                    arr[wallX][j] = 50;
                }
            }
        }
    }
    for (i = 0; i < newSizeX; i += 1) {
        for (j = 0; j < newSizeY; j += 1) {
            if (j % 4 == 0 && i % 2 == 0) {
                arr[i][j] = -1;
                for (k = 1; k < sizeZ; k += 1) {
                    current_value = tab[i/2][j/2][k];
                    if (current_value >= 1 && current_value <= 6) {
                        arr[i][j] = current_value;
                        break;
                    }
                }
            }
            else if (j % 4 == 2 && i % 2 == 1) {
                arr[i][j] = -1;
                for (k = 1; k < sizeZ; k += 1) {
                    current_value = tab[(i-1)/2][j/2][k];
                    if (current_value >= 1 && current_value <= 6) {
                        arr[i][j] = current_value;
                        break;
                    }
                }
            }
        }
    }
    if (gaps === false) {
        frames();
        for (i = wallX; i <= wallX; i += 1) {
            for (j = 1; j < newSizeY - 1; j += 1) {
                if (j < newSizeX / 2 + Math.round(wallY) && j > newSizeX / 2 - Math.round(wallY)) {
                    // tu odjac jakby mialy byc rowne przegrody od dolu i gory
                    continue;
                }
                else {
                    //zielona sciana
                    arr[wallX][j] = 50;
                }
            }
        }
    }
}

/*
 * fill array
 */

function randomFillGame() {
    triangles();
    frames();
    wall(wallX, wallY);
    if (randomFill === false) {
        manualFillGame();
    }
    makeTab();
    makeArr();
}
randomFillGame();

function manualFillGame() {  
    // narozniki OK
    arr[1][2] = 1;
    arr[93][2] = 2;
    arr[94][4] = 2;
    arr[2][92] = 5;
    arr[1][90] = 5;
    arr[94][92] = 4;
    // narozniki sciany OK
    arr[31][2] = 2;
    arr[35][2] = 1;
    arr[32][4] = 2;
    arr[34][4] = 1;
    // sciana OK
    arr[8][4] = 3;
    arr[9][6] = 3;
    arr[10][8] = 3;
    // szczelina OK
    arr[28][40] = 3;
    arr[29][42] = 3;
    arr[28][44] = 3;
    arr[29][46] = 3;
    arr[28][52] = 3;
    arr[29][54] = 3;
    // ukosy przy szczelinie OK
    arr[30][36] = 4;
    arr[30][40] = 4;
    arr[31][38] = 4;
    arr[31][42] = 4;
    // test zderzen czastek OK
    arr[8][4] = 3;
    arr[9][6] = 3;
    arr[10][8] = 3;
    arr[14][4] = 6;
    arr[13][6] = 6;
    arr[12][8] = 6;
    // test kolizje czasteczek OK
    arr[15][18] = 5;
    arr[14][16] = 5;
    arr[14][20] = 5;
    arr[17][18] = 5;
    arr[16][16] = 5;
    arr[16][20] = 5;
    arr[13][18] = 5;
    // test kolizje sciana OK
    arr[1][6] = 5;
    arr[1][10] = 5;
    arr[2][8] = 5;
}

/*
 * canvas
 */

function display(value) {
	for (i = 0; i < newSizeX; i += 1) {
		for (j = 0; j < newSizeY; j += 1) {
			if (arr[i][j] >= 1 && arr[i][j] <= 6) {
				context.fillStyle = 'red';
				context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
				value++;
			}
            else if (arr[i][j] == -1) {
				context.fillStyle = 'yellow';
				context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
			}
			else if (arr[i][j] == 0) {
				//context.fillStyle = '#73BBC6';
				context.fillStyle = 'white';
				context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
			}
			else if (arr[i][j] == 50) {
				context.fillStyle = '#33842A';
				context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
			}
		}
	}
	return value;
}

/*
 * logic
 */

function move() {
    for (i = 0; i < sizeX; i += 1) {
        for (j = 0; j < sizeY; j += 1) {
            for (k = 0; k < sizeZ; k += 1) {
                current_value = tab[i][j][k];
                // wiersze parzyste 0, 2 itd.
                if (j % 2 == 0 && current_value >= 1 && current_value <= 6) {
                    switch(k) {
                        case 1:
                            displayTab[i-1][j-1][k] = current_value;
                            break;
                        case 2:
                            displayTab[i][j-1][k] = current_value;
                            break;
                        case 3:
                            displayTab[i+1][j][k] = current_value;
                            break;
                        case 4:
                            displayTab[i][j+1][k] = current_value;
                            break;
                        case 5:
                            displayTab[i-1][j+1][k] = current_value;
                            break;
                        case 6:
                            displayTab[i-1][j][k] = current_value;
                            break;
                    }
                }
                // wiersze nieparzyste 1, 3 itd.
                else if (j % 2 == 1 && current_value >= 1 && current_value <= 6) {
                    switch(k) {
                        case 1:
                            displayTab[i][j-1][k] = current_value;
                            break;
                        case 2:
                            displayTab[i+1][j-1][k] = current_value;
                            break;
                        case 3:
                            displayTab[i+1][j][k] = current_value;
                            break;
                        case 4:
                            displayTab[i+1][j+1][k] = current_value;
                            break;
                        case 5:
                            displayTab[i][j+1][k] = current_value;
                            break;
                        case 6:
                            displayTab[i-1][j][k] = current_value;
                            break;
                    }
                }
            }
        }
    }
}

function collisionParticles() {
    for (i = 0; i < sizeX; i += 1) {
        for (j = 0; j < sizeY; j += 1) {
            if (tab[i][j][1] == 1 && tab[i][j][4] == 4) {
                tab[i][j][1] = -1;
                tab[i][j][4] = -1;
                if (Math.abs(100 * Math.random()) < 50) {
                    tab[i][j][2] = 2;
                    tab[i][j][5] = 5;
                }
                else {
                    tab[i][j][3] = 3;
                    tab[i][j][6] = 6;
                }
            }
            else if (tab[i][j][2] == 2 && tab[i][j][5] == 5) {
                tab[i][j][2] = -1;
                tab[i][j][5] = -1;
                if (Math.abs(100 * Math.random()) < 50) {
                    tab[i][j][1] = 1;
                    tab[i][j][4] = 4;
                }
                else {
                    tab[i][j][3] = 3;
                    tab[i][j][6] = 6;
                }
            }
            else if (tab[i][j][3] == 3 && tab[i][j][6] == 6) {
                tab[i][j][3] = -1;
                tab[i][j][6] = -1;
                if (Math.abs(100 * Math.random()) < 50) {
                    tab[i][j][2] = 2;
                    tab[i][j][5] = 5;
                }
                else {
                    tab[i][j][1] = 1;
                    tab[i][j][4] = 4;
                }
            }
    
        }
    }
}

function collision() {
    for (i = 0; i < sizeX; i += 1) {
        for (j = 0; j < sizeY; j += 1) {
            // obramowanie tabeli
            if (i == 0 || j == 0 || i == sizeX - 1 || j == sizeY - 1) {
                // narozniki
                // *\
                if (i == 0 && j == 0 && tab[i][j][1] == 1) {
                    tab[i][j][1] = -1;
                    tab[i][j][4] = 4;
                }
                // */
                else if (i == 0 && j == sizeY - 1) {
                    if (tab[i][j][5] == 5) {
                        tab[i][j][5] = -1;
                        tab[i][j][4] = 4;
                    }
                    if (tab[i][j][4] == 4) {
                        tab[i][j][4] = -1;
                        tab[i][j][2] = 2;
                    }
                }
                // /*
                else if (i == sizeX - 1 && j == 0) {
                    if (tab[i][j][2] == 2) {
                        tab[i][j][2] = -1;
                        tab[i][j][4] = 4;
                    }
                    if (tab[i][j][1] == 1) {
                        tab[i][j][1] = -1;
                        tab[i][j][5] = 5;
                    }
                }
                // \*
                else if (i == sizeX - 1 && j == sizeY - 1 && tab[i][j][4] == 4) {
                    tab[i][j][4] = -1;
                    tab[i][j][1] = 1;
                }
                // rogi tworzone przez przegrode
                // dol
                else if (i == ((wallX - 1) / 2) && j == sizeY - 1) {
                    if (tab[i][j][5] == 5) {
                        tab[i][j][5] = -1;
                        tab[i][j][2] = 2;
                    }
                    if (tab[i][j][4] == 4) {
                        tab[i][j][4] = -1;
                        tab[i][j][1] = 1;
                    }
                }
                // sciany
                // lewa sciana
                else if (i == 0) {
                    if (tab[i][j][6] == 6) {
                        tab[i][j][6] = -1;
                        tab[i][j][3] = 3;
                    }
                    // wiersze parzyste 0, 2 itd.
                    if (j % 2 == 0) {
                        if (tab[i][j][1] == 1) {
                            tab[i][j][1] = -1;
                            tab[i][j][2] = 2;
                        }
                        if (tab[i][j][5] == 5) {
                            tab[i][j][5] = -1;
                            tab[i][j][4] = 4;
                        }
                    }
                }
                // prawa sciana
                else if (i == sizeX - 1) {
                    if (tab[i][j][3] == 3) {
                        tab[i][j][3] = -1;
                        tab[i][j][6] = 6;
                    }
                    // wiersze nieparzyste 1, 3 itd.
                    if (j % 2 == 1) {
                        if (tab[i][j][2] == 2) {
                            tab[i][j][2] = -1;
                            tab[i][j][1] = 1;
                        }
                        if (tab[i][j][4] == 4) {
                            tab[i][j][4] = -1;
                            tab[i][j][5] = 5;
                        }
                    }
                }
                // gorna sciana
                else if (j == 0) {
                    if (tab[i][j][1] == 1) {
                        tab[i][j][1] = -1;
                        tab[i][j][5] = 5; 
                    }
                    if (tab[i][j][2] == 2) {
                        tab[i][j][2] = -1;
                        tab[i][j][4] = 4; 
                    }
                }
                // dolna sciana
                else if (j == sizeY - 1) {
                    if (tab[i][j][5] == 5) {
                        tab[i][j][5] = -1;
                        tab[i][j][1] = 1; 
                    }
                    if (tab[i][j][4] == 4) {
                        tab[i][j][4] = -1;
                        tab[i][j][2] = 2; 
                    }
                }
            }
            // przegroda
            else if (j > (sizeX / 2 + Math.round(wallY / 2 - 1)) || j < (sizeX / 2 - Math.round(wallY / 2 - 1))) {
                if (i == (wallX - 1) / 2) {
                    if (j % 2 == 0) {
                        if (tab[i][j][3] == 3) {
                            tab[i][j][3] = -1;
                            tab[i][j][6] = 6;
                        }
                    }
                    else if (j % 2 == 1) {
                        if (tab[i][j][5] == 5 && tab[i][j][4] == 4) {
                            
                        }
                        else if (tab[i][j][5] == 5) {
                            tab[i][j][5] = -1;
                            tab[i][j][4] = 4;
                        }
                        else if (tab[i][j][4] == 4) {
                            tab[i][j][4] = -1;
                            tab[i][j][5] = 5;
                        }
                        if (tab[i][j][1] == 1 && tab[i][j][2] == 2) {
                            
                        }
                        else if (tab[i][j][1] == 1) {
                            tab[i][j][1] = -1;
                            tab[i][j][2] = 2;
                        }
                        else if (tab[i][j][2] == 2) {
                            tab[i][j][2] = -1;
                            tab[i][j][1] = 1;
                        }
                        if (tab[i][j][3] == 3 && tab[i][j][6] == 6) {
                            
                        }
                        else if (tab[i][j][3] == 3) {
                            tab[i][j][3] = -1;
                            tab[i][j][6] = 6;
                        }
                        else if (tab[i][j][6] == 6) {
                            tab[i][j][6] = -1;
                            tab[i][j][3] = 3;
                        }
                    }
                }
                // przegroda od lewej żeby nie przechodziło za zielone
                else if (i == ((wallX - 1) / 2) + 1) {
                    if (j % 2 == 0) {
                        if (tab[i][j][6] == 6) {
                            tab[i][j][6] = -1;
                            tab[i][j][3] = 3;
                        }
                    }
                }
            }
        }
    }
}

/*
 * steps
 */

function firstStep() {
	display();
}
firstStep();

function step() {
    collisionParticles();
    collision();
    move();
    setTab(tab, displayTab);
    makeArr();
    countAlive();

	if (!pause) {
        setTimeout(function() { step(); }, s);
	}
}

/*
 * buttons
 */

function pauseGame() {
	pause = true;
    gapsButton.disabled = true;
}

function startGame() {
	if (pause === true) {
		pro.disabled = true;
        range.disabled = true;
        rangeS.disabled = true;
        gapsButton.disabled = false;
		pause = false;
		step();
	}
}

function restartGame() {
    var lock = window.location.href;
	window.location.href = lock;
}
