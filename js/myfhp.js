/*
 * basic parameters
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
var arr = [];
var tab = [];
var displayTab = [];
var i, j, k;

var range = document.getElementById('myRange');
var rangeS = document.getElementById('myRangeS');
var wallX = range.value;
var wallY = rangeS.value;
var aliv = 0;

var randomFill = true;

/*
 * basic math functions
 */

function round(value, x) {
    "use strict";
    x = (!x ? 2 : x);
    return Math.round(value * Math.pow(10, x)) / Math.pow(10, x);
}

function ob(value) {
    "use strict";
	return Math.round(value);
}

/*
 * copy tables functions
 */

function setTab(x, y) {
    "use strict";
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
 * build array function
 */

function arrayBuild() {
    "use strict";
	arr = [newSizeX];
	for (i = 0; i < newSizeX; i += 1) {
		arr[i] = [newSizeY];
	}
}
arrayBuild();

function tableBuild() {
    "use strict";
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
 * game buttons
 */

function pauseGame() {
    "use strict";
	pause = true;
}

function startGame() {
    "use strict";
	if (pause === true) {
		pro.disabled = true;
        range.disabled = true;
        rangeS.disabled = true;
		pause = false;
		step();
	}
}

function restartGame() {
    "use strict";
    var lock = window.location.href;
	window.location.href = lock;
}

/*
 * game parameters
 */

function setProb(value) {
    "use strict";
	if (value >= 0 && value <= 100) {
		probability = round(value, 2);
	} else {
		pro.value = 10.00;
		probability = 10.00;
		alert("Wprowadź liczbę od 0 do 100");
	}
	randomFillGame();
	firstStep();
}

function showAlive(value) {
    "use strict";
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
    "use strict";
    wallX = value;
    randomFillGame();
    firstStep();
}

function showWallS(value) {
    "use strict";
    wallY = value;
    randomFillGame();
    firstStep();
}

/*
 * basic game functions
 */

function randomFillGame() {
    "use strict";
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

/*
 * basic drawing
 */

function triangles() {
    for (var i = 0; i < newSizeX; i++) {
        for (var j = 0; j < newSizeY; j++) {
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
    for (var i = 0; i < newSizeX; i++) {
        for (var j = 0; j < newSizeY; j++) {
            if (i == 0 || j == 0 || i == newSizeX - 1 || j == newSizeY - 1) {
                arr[i][j] = 50;
            }
        }
    }
}

function wall(value, values) {
	for (var i = 1; i <= value; i++) {
		for (var j = 1; j < newSizeY - 1; j++) {
			if (i != Math.round(value)) {
                if (randomFill === true) {
                    if (Math.abs(100 * Math.random()) < probability && (arr[i][j] == -1 || arr[i][j] == 1)) {
                        arr[i][j] = Math.round(Math.random() * 5) + 1 ; // czerwony o kierunkach różnych 
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
				arr[value][j] = 50; //zielona sciana
			}
		}
	}
}

/*
 * swap xy to xyz
 */

function makeTab() {
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            for (var k = 0; k < sizeZ; k++) {
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
    frames();
    wall(wallX, wallY);
    for (var i = 0; i < newSizeX; i++) {
        for (var j = 0; j < newSizeY; j++) {
            if (j % 4 == 0 && i % 2 == 0) {
                arr[i][j] = -1;
                for (var k = 1; k < sizeZ; k++) {
                    current_value = tab[i/2][j/2][k];
                    if (current_value >= 1 && current_value <= 6) {
                        arr[i][j] = current_value;
                        break;
                    }
                }
            }
            else if (j % 4 == 2 && i % 2 == 1) {
                arr[i][j] = -1;
                for (var k = 1; k < sizeZ; k++) {
                    current_value = tab[(i-1)/2][j/2][k];
                    if (current_value >= 1 && current_value <= 6) {
                        arr[i][j] = current_value;
                        break;
                    }
                }
            }
        }
    }
    //frames();
    //wall(wallX, wallY);
}

/*
 * canvas
 */

function display(value) {
	for (var i = 0; i < newSizeX; i++) {
		for (var j = 0; j < newSizeY; j++) {
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
 * game steps
 */

function firstStep() {
	display();
}
firstStep();

function manualFillGame() {
    
//    // narozniki OK
//    arr[1][2] = 1;
//    arr[93][2] = 2;
//    arr[94][4] = 2;
//    arr[2][92] = 5;
//    arr[1][90] = 5;
//    arr[94][92] = 4;
//
//    // narozniki sciany OK
//    arr[31][2] = 2;
//    arr[35][2] = 1;
//    arr[32][4] = 2;
//    arr[34][4] = 1;
//    
//    // random lewa komora OK
//    arr[15][18] = 5;
//    
//    // sciana OK
//    arr[8][4] = 3;
//    arr[9][6] = 3;
//    arr[10][8] = 3;
//    
//    // szczelina OK
//    arr[28][40] = 3;
//    arr[29][42] = 3;
//    arr[28][44] = 3;
//    arr[29][46] = 3;
//    arr[28][52] = 3;
//    arr[29][54] = 3;
//    
//    // ukosy przy szczelinie OK
//    arr[30][36] = 4;
//    arr[30][40] = 4;
//    arr[31][38] = 4;
//    arr[31][42] = 4;
    
    // test zderzen czastek ZLE NIE DZIALAJA KOLIZJE DWOCH CZASTECZEK
    arr[8][4] = 3;
    arr[9][6] = 3;
    arr[10][8] = 3;
    arr[14][4] = 6;
    arr[13][6] = 6;
    arr[12][8] = 6;
}


function step() {
    
    // glowna funkcjonalnosc kolizji dwoch czasteczek
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
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
    
    // glowna funkcjonalnosc zmiany kierunków
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
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
    
    // glowna funkcjonalnosc przepisywania tablicy
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            for (var k = 0; k < sizeZ; k++) {
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
    
    // zamiana i czyszczenie tablicy
    setTab(tab, displayTab);
    
    // przepisanie do arr wyswietlonych
    makeArr();

    // funkcja liczaca slupki procentowe po arr wyswietlonych
    aliv = 0;
    var alive = 0;
	aliv = display(aliv);
    for (var i = 0; i < wallX; i++) {
		for (var j = 0; j < newSizeY; j++) {
			if (arr[i][j] >= 1 && arr[i][j] <= 6) {
                alive++;
            }
        }
    }
    showAlive(100 * alive / aliv);
    //

	if (!pause) {
        setTimeout(function() { step(); }, 50);
	}
}

