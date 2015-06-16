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
var displayArr = [];
var tab = [];
var displayTab = [];

var range = document.getElementById('myRange');
var rangeS = document.getElementById('myRangeS');
var wallX = range.value;
var wallY = rangeS.value;
var aliv = 0;

/*
 * basic math functions
 */

function round(value, x) {
    var x = (!x ? 2 : x);
    return Math.round(value * Math.pow(10, x)) / Math.pow(10, x);
}

function ob(value) {
	return Math.round(value);
}

/*
 * copy tables functions
 */

function set(x, y) {
	for (var i = 0; i < newSizeX; i++) {
		for (var j = 0; j < newSizeY; j++) {
			x[i][j] = y[i][j];
		}
	}
}

function setTab(x, y) {
	for (var i = 0; i < sizeX; i++) {
		for (var j = 0; j < sizeY; j++) {
            for (var k = 0; k < sizeZ; k++) {
                x[i][j][k] = y[i][j][k];
            }
		}
	}
}

/*
 * build array function
 */

function arrayBuild() {
	arr = new Array(newSizeX);
	displayArr = new Array(newSizeX);
	for (i = 0; i < newSizeX; i++) {
		arr[i] = new Array(newSizeY);
		displayArr[i] = new Array(newSizeY);
	}
}
arrayBuild();

function tableBuild() {
    tab = new Array(sizeX);
    displayTab = new Array(sizeX);
    for (i = 0; i < sizeX; i++) {
        tab[i] = new Array(sizeY);
        displayTab[i] = new Array(sizeY);
        for (j = 0; j < sizeY; j++) {
            tab[i][j] = new Array(sizeZ);
            displayTab[i][j] = new Array(sizeZ);
            for (k = 0; k < sizeZ; k++) {
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
	pause = true;
}

function startGame() {
	if (pause == true) {
		pro.disabled = true;
        range.disabled = true;
        rangeS.disabled = true;
		pause = false;
		step();
	}
}

function restartGame() {
	window.location.href = window.location.href;
}

/*
 * game parameters
 */

function setProb(value) {
	if (value >= 0 && value <= 100) {
		probability = round(value, 2);
	}
	else {
		pro.value = 10.00;
		probability = 10.00;
		alert("Wprowadź liczbę od 0 do 100");
	}
	randomFillGame();
	//showAlive(probability);
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

/*
 * basic game functions
 */

function randomFillGame() {
    triangles();
    frames();
    wall(wallX, wallY);
    manualFillGame();
    makeTab();
    makeArr();
}
randomFillGame();

function manualFillGame() {
    arr[15][18] = 6;
}

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
    set(displayArr, arr);
}

function frames() {
    for (var i = 0; i < newSizeX; i++) {
        for (var j = 0; j < newSizeY; j++) {
            if (i == 0 || j == 0 || i == newSizeX - 1 || j == newSizeY - 1) {
                arr[i][j] = 50;
            }
        }
    }
    set(displayArr, arr);
}

function wall(value, values) {
	for (var i = 1; i <= value; i++) {
		for (var j = 1; j < newSizeY - 1; j++) {
			if (i != Math.round(value)) {
//				if (Math.abs(100 * Math.random()) < probability && (arr[i][j] == -1 || arr[i][j] == 1)) {
//					arr[i][j] = Math.round(Math.random() * 5) + 1 ; // czerwony o kierunkach różnych 
//				}
//				else {
//					continue;
//				}
			}
			else if (j < newSizeX / 2 + Math.round(values) && j > newSizeX/ 2 - Math.round(values)) {
				continue;
			}
			else {
				arr[value][j] = 50; //zielona sciana
			}
		}
	}
    set(displayArr, arr);
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
    setTab(displayTab, tab);
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
                for (var k = 0; k < sizeZ; k++) {
                    current_value = tab[i/2][j/2][k];
                    if (current_value >= 1 && current_value <= 6) {
                        arr[i][j] = current_value;
                        break;
                    }
                }
            }
            else if (j % 4 == 2 && i % 2 == 1) {
                arr[i][j] = -1;
                for (var k = 0; k < sizeZ; k++) {
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
    set(displayArr, arr);
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
				context.fillStyle = 'gray';
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

function step() {

//	for (var i = 0; i < sizeX; i++) {
//		for (var j = 0; j < sizeY; j++) {
//			if (arr[i][j] == 1 && (countNeighbours(i, j) == 2 || countNeighbours(i, j) == 3) ) displayArr[i][j] = 1;
//			else if (arr[i][j] == 0 && countNeighbours(i, j) == 3) displayArr[i][j] = 1;
//			else displayArr[i][j] = 0;
//		}
//	}
    
    // glowna funkcjonalnosc kroku wraz z kolizjami
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            // obramowanie tabeli
            if (i == 0 || j == 0 || i == sizeX - 1 || j == sizeY - 1) {
                // lewa sciana
                if (i == 0) {
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
                        tab[i][j][1] == -1;
                        tab[i][j][5] == 5; 
                    }
                    if (tab[i][j][2] == 2) {
                        tab[i][j][2] == -1;
                        tab[i][j][4] == 4; 
                    }
                }
                // dolna sciana
                else if (j == sizeY - 1) {
                    if (tab[i][j][5] == 5) {
                        tab[i][j][5] == -1;
                        tab[i][j][1] == 1; 
                    }
                    if (tab[i][j][4] == 4) {
                        tab[i][j][4] == -1;
                        tab[i][j][2] == 2; 
                    }
                }
            }
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
                    displayTab[i][j][k] = -1;        
                }
                // wiersze nieparzyste 1, 3 itd.
                if (j % 2 == 1 && current_value >= 1 && current_value <= 6) {
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
                    displayTab[i][j][k] = -1;        
                }
            }
        }
    }
    
    setTab(tab, displayTab);
    
    // przepisanie do arr wyswietlonych
    makeArr();
    set(arr, displayArr);

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

