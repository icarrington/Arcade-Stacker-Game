let currentRowNumber = 1;
let currentRow = document.getElementById(`row${currentRowNumber}`);

let chainLength = 4;
let displacement = 0; //displacement is where the chain of glowing blocks starts. Even though it is 0, the chain starts in the middle at the 4th block from the left.
let direction = 'right';

let score = 0;
let scoreDisplay = document.getElementById('score');
let scoreSound = document.getElementById('scoreSound');
let overhangSound = document.getElementById('overhang');

//I initialize overhang here so I can access it later.
let overhang;


//This function adds the chain of glowing blocks on the current row.
function addGlowingBlocks(startingIndex) {
  let start = 4 + startingIndex;

  let spaces = currentRow.querySelectorAll('.space');

  for (let i = 0; i < 12; i++) {
    if (i >= start && i <= start + chainLength - 1) {
      spaces[i].classList.add('glow');
    }
  }
}


//This function moves the chain of blocks by one displacement to the right or left depending on if it reached the end.
function moveChain(begin) {
  let chain = currentRow.querySelectorAll('.glow');

  //If the chain has reached the right wall, change direction to left.
  if (displacement >= 8 - chainLength) direction = 'left';
  //If the chain has reached the left wall, change direction to right.
  if (displacement <= -4) direction = 'right';

  if (direction == 'right') displacement += 1;
  if (direction == 'left')  displacement -= 1;
  
  
  chain.forEach(block => block.style.transform = `translateX(${(displacement - (lowerRowIndex || 0)) * 100}%)`);

}

let timeBetweenTicks = 500;

let move = setInterval(moveChain, timeBetweenTicks);


//lowerRowIndex is the ending displacement of the row below.
let lowerRowIndex;

//trimChain trims the overhanging blocks in the current chain.
function trimChain() {
  //overhangSide specifies which side the chain of blocks hangs over.
  let overhangSide;

  if(displacement < lowerRowIndex) {
    overhangSide = 'left';
    chainLength = chainLength - (lowerRowIndex - displacement);
  }
  if (displacement > lowerRowIndex) {
    overhangSide = 'right';
    chainLength = chainLength - (displacement - lowerRowIndex);    
  }
  
  let spaces = currentRow.querySelectorAll('.space');
  
  let start = 4 + (displacement);
  let pos = 4 + (lowerRowIndex);
  overhang = start - pos || 0;
  
  if (overhangSide == 'left') {

    for (let i = 0; i < spaces.length; i++) {
      if (i < pos + 4 - chainLength) {
        spaces[i].classList.remove('glow');
      }
    }

    lowerRowIndex = displacement - overhang;

  } else if (overhangSide == 'right') {

    for (let i = 0; i < spaces.length; i++) {
      if (i >= pos + chainLength) {
        spaces[i].classList.remove('glow');
      }
    }

    lowerRowIndex = displacement;

  } else {
    lowerRowIndex = displacement;
  }
  
  
}

function incrementScore() {
  score++;
  scoreDisplay.innerHTML = `Score: ${score}`;

  if(overhang != 0) {
    overhangSound.play();
  } else {
    scoreSound.play();
  }
}

function checkGameOver() {
  if (chainLength <= 0) {
    let restart = confirm('Game over! Would you like to play again?');
  
    if (restart) location.reload();
  }
}

//collapseTop brings the chain down to the bottom when it reaches the top.
function collapseTop() {
  currentRowNumber = 1;
  currentRow = document.getElementById(`row${currentRowNumber}`);

  let highlighted = document.querySelectorAll('.glow');
  highlighted.forEach(block => block.classList.remove('glow'));
  addGlowingBlocks(lowerRowIndex);
}

//stack starts a new chain on the next row.
function stack() {

  if (currentRowNumber == 12) collapseTop();

  currentRowNumber++;
  currentRow = document.getElementById(`row${currentRowNumber}`);

  addGlowingBlocks(lowerRowIndex);

  timeBetweenTicks = timeBetweenTicks * 0.85;
  clearInterval(move);
  move = setInterval(moveChain, timeBetweenTicks);

}

document.addEventListener('click', (event) => {
  trimChain();
  checkGameOver();
  incrementScore();
  stack();
});

document.addEventListener('keyup', event => {
  if (event.key != ' ') return;
  trimChain();
  checkGameOver();
  incrementScore();
  stack();
} )

