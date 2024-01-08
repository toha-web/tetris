document.addEventListener("contextmenu",(e=>{e.preventDefault()})),document.addEventListener("keydown",(e=>{" "===e.key&&e.preventDefault()})),document.querySelector(".copyright a").addEventListener("click",(e=>{!0===gameStatus&&!1===pauseStatus&&e.preventDefault()}));const foneMusicAudio=new Audio("./sounds/PopcornFoneMusic.mp3");foneMusicAudio.loop=!0,foneMusicAudio.volume=.5;const upDown=new Audio("./sounds/downup.mp3");upDown.volume=.1;const explosion=new Audio("./sounds/explosion.mp3");explosion.volume=.6;const lose=new Audio("./sounds/lose.mp3");lose.volume=.4;const deleteAudio=new Audio("./sounds/delRow.mp3");deleteAudio.volume=.6;const gameOverAudio=new Audio("./sounds/gameOver.mp3");gameOverAudio.volume=.6;const rotateAudio=new Audio("./sounds/rotate.mp3");rotateAudio.volume=.2;const moveAudio=new Audio("./sounds/move.mp3");moveAudio.volume=.3;const putAudio=new Audio("./sounds/put.mp3");putAudio.volume=.5;const fieldWrapper=document.querySelector(".tetris-field"),nextWrapper=document.querySelector(".next-field"),highScoreField=document.querySelector(".high-score span"),linesField=document.querySelector(".lines span"),scoreField=document.querySelector(".score span"),speedField=document.querySelector(".speed span"),levelField=document.querySelector(".level span"),pauseButton=document.querySelector(".pause button"),startButton=document.querySelector(".start button"),pauseImg=document.querySelector(".pause img"),controlBtnLeft=document.querySelector("#left"),controlBtnRight=document.querySelector("#right"),controlBtnDown=document.querySelector("#down"),controlBtnRotate=document.querySelector("#rotate"),musicMute=document.querySelector("#music-mute"),musicMuteImage=document.querySelector("#music-mute div > img"),soundMute=document.querySelector("#sound-mute"),soundMuteImage=document.querySelector("#sound-mute div > img");function addControlListeners(){document.addEventListener("keydown",keyHandler),controlBtnLeft.addEventListener("click",moveLeft),controlBtnRight.addEventListener("click",moveRight),controlBtnRotate.addEventListener("click",rotate),controlBtnDown.addEventListener("click",moveDown),controlBtnDown.addEventListener("dblclick",fallDown)}function removeControlListeners(){document.removeEventListener("keydown",keyHandler),controlBtnLeft.removeEventListener("click",moveLeft),controlBtnRight.removeEventListener("click",moveRight),controlBtnRotate.removeEventListener("click",rotate),controlBtnDown.removeEventListener("click",moveDown),controlBtnDown.removeEventListener("dblclick",fallDown)}startButton.disabled=!0,startButton.innerText="Start",startButton.addEventListener("click",(()=>{gameStatus?restartGame():startAnimation()})),pauseButton.innerText="Pause",pauseButton.disabled=!0,pauseButton.addEventListener("click",(()=>{pauseStatus?(addControlListeners(),timerId=setInterval(moveDown,timerSpeed),pauseStatus=!1,pauseButton.innerText="Pause",pauseImg.style.display="none",foneMusic&&foneMusicAudio.play()):(clearInterval(timerId),removeControlListeners(),pauseStatus=!0,pauseButton.innerText="Resume",pauseImg.style.display="block",foneMusic&&foneMusicAudio.pause())})),controlBtnLeft.addEventListener("click",(()=>{!0===sounds&&moveAudio.play()})),controlBtnRight.addEventListener("click",(()=>{!0===sounds&&moveAudio.play()})),controlBtnRotate.addEventListener("click",(()=>{!0===sounds&&rotateAudio.play()})),controlBtnDown.addEventListener("click",(()=>{!0===sounds&&moveAudio.play()})),musicMute.addEventListener("click",(()=>{foneMusic?(foneMusic=!1,musicMuteImage.src="./img/music-off.svg",gameStatus&&foneMusicAudio.pause()):foneMusic||(foneMusic=!0,musicMuteImage.src="./img/music-on.svg",gameStatus&&!pauseStatus&&(foneMusicAudio.currentTime=0,foneMusicAudio.play()))})),soundMute.addEventListener("click",(()=>{sounds?(sounds=!1,soundMuteImage.src="./img/sound-off.svg"):sounds||(sounds=!0,soundMuteImage.src="./img/sound-on.svg")}));const fieldRows=20,fieldCols=10,figureNames=["o","l","j","s","z","i","t"],figures={o:[[[1,1],[1,1]]],l:[[[0,0,1],[1,1,1]],[[1,0],[1,0],[1,1]],[[1,1,1],[1,0,0]],[[1,1],[0,1],[0,1]]],j:[[[1,0,0],[1,1,1]],[[1,1],[1,0],[1,0]],[[1,1,1],[0,0,1]],[[0,1],[0,1],[1,1]]],s:[[[0,1,1],[1,1,0]],[[1,0],[1,1],[0,1]]],z:[[[1,1,0],[0,1,1]],[[0,1],[1,1],[1,0]]],i:[[[1,1,1,1]],[[1],[1],[1],[1]]],t:[[[0,1,0],[1,1,1]],[[1,0],[1,1],[1,0]],[[1,1,1],[0,1,0]],[[0,1],[1,1],[0,1]]]};let lines,score,speed,level,highScore,timerId,gameField,prevGameField,nextField,currentFigure,nextFigure,timerSpeed,prevSpeed,pauseStatus=!1,gameStatus=!1,blockMove=!1,foneMusic=!0,sounds=!0;function randomColor(){return Math.floor(20+230*Math.random())}function randomFigure(){return figureNames[Math.floor(7*Math.random())]}function speedUpdate(){speed=Math.floor(score/1e4),speed===prevSpeed||speed>9||(clearInterval(timerId),0===speed?timerSpeed=600:speed<=9&&(timerSpeed=timerSpeed-102+parseInt(`${speed}0`)),speedField.innerText=speed.toString(),prevSpeed=speed,timerId=setInterval(moveDown,timerSpeed))}function startGame(){gameField=[],nextField=[],prevGameField=[],highScore=localStorage.tetrisHighScore?JSON.parse(localStorage.getItem("tetrisHighScore")):0,highScoreField.innerText=highScore.toString().padStart(9,"0"),lines=0,score=0,level=0,pauseButton.disabled=!1,currentFigure=createFigure(),nextFigure=createFigure(),createField(),createNextField(),drawFigure(currentFigure),drawNextFigure(nextFigure),linesField.innerText=lines.toString().padStart(6,"0"),scoreField.innerText=score.toString().padStart(9,"0"),speedField.innerText=speed,levelField.innerText=level,addControlListeners(),speedUpdate(),gameStatus=!0,startButton.innerText="Restart"}function restartGame(){prevSpeed=null,clearInterval(timerId),removeControlListeners(),pauseStatus=!1,pauseButton.innerText="Pause",pauseImg.style.display="none",foneMusicAudio.currentTime=0,foneMusicAudio.play(),startGame()}function gameOver(){foneMusicAudio.pause(),!0===sounds&&lose.play(),clearInterval(timerId),removeControlListeners(),pauseButton.disabled=!0,console.log("GAME OVER"),parseInt(score)>parseInt(highScore)&&localStorage.setItem("tetrisHighScore",JSON.stringify(score)),gameOverAnimation()}function createNextField(){nextWrapper.replaceChildren();for(let e=0;e<3;e++){nextField[e]=[];for(let t=0;t<7;t++){const r=document.createElement("div");r.className="cell",nextField[e][t]=r,nextWrapper.append(r)}}}function drawNextFigure(e){for(let t=0;t<e.type[0].length;t++)for(let r=0;r<e.type[0][0].length;r++)1===e.type[0][t][r]&&(nextField[t][r+2].style.backgroundColor=`rgb(${e.color})`,nextField[t][r+2].classList.add("figure"))}function createField(){if(fieldWrapper.replaceChildren(),0===prevGameField.length)for(let e=0;e<fieldRows;e++){gameField[e]=[];for(let t=0;t<fieldCols;t++){const r=document.createElement("div");r.className="cell",r.data=0,gameField[e][t]=r,fieldWrapper.append(r)}}else if(prevGameField.length>0)for(let e=0;e<fieldRows;e++){gameField[e]=[];for(let t=0;t<fieldCols;t++){const r=document.createElement("div");r.className="cell",r.data=0,!0===prevGameField[e][t].stop&&(r.data=1,r.stop=!0,r.style.backgroundColor=`${prevGameField[e][t].color}`,r.classList.add("figure")),gameField[e][t]=r,fieldWrapper.append(r)}}}function createFigure(){return{x:4,y:0,type:figures[randomFigure()],rotate:0,color:[randomColor(),randomColor(),randomColor()]}}function drawFigure(e){console.log(`draw figure ${e.color}`);const t=e.type[e.rotate],r=t.length,o=t[0].length;for(let n=0;n<r;n++)for(let r=0;r<o;r++){const o=gameField[n+e.y][r+e.x];if(gameField[n+e.y]&&gameField[r+e.x]&&1===t[n][r]){if(o.stop)return void gameOver();o.data=t[n][r],o.style.backgroundColor=`rgb(${e.color})`,o.classList.add("figure")}}}function stepFieldUpdate(){blockMove||(console.log("step update"),createField(),drawFigure(currentFigure))}function fullFieldUpdate(){blockMove||(console.log("full update"),prevGameField=Array.from(gameField),createField(),currentFigure=nextFigure,drawFigure(currentFigure),nextFigure=createFigure(),createNextField(),drawNextFigure(nextFigure))}function keyHandler(e){switch(console.log(e),e.key){case"ArrowLeft":!0===sounds&&moveAudio.play(),moveLeft();break;case"ArrowRight":!0===sounds&&moveAudio.play(),moveRight();break;case"ArrowDown":!0===sounds&&moveAudio.play(),moveDown();break;case"ArrowUp":!0===sounds&&rotateAudio.play(),rotate();break;case" ":fallDown()}}function moveLeft(){0!==currentFigure.x&&checkNextStep("left")&&(currentFigure.x-=1,stepFieldUpdate())}function moveRight(){currentFigure.x<fieldCols-currentFigure.type[currentFigure.rotate][0].length&&checkNextStep("right")&&(currentFigure.x+=1,stepFieldUpdate())}function moveDown(){currentFigure.y<fieldRows-currentFigure.type[currentFigure.rotate].length&&checkNextStep("down")?(currentFigure.y+=1,stepFieldUpdate()):blockMove||(!0===sounds&&putAudio.play(),stopPosition(),checkFullRows())}function rotate(){const e=currentFigure.rotate;if(currentFigure.type[currentFigure.rotate+1]?currentFigure.rotate+=1:currentFigure.rotate=0,currentFigure.x>fieldCols-currentFigure.type[currentFigure.rotate][0].length)do{currentFigure.x-=1}while(currentFigure.x>fieldCols-currentFigure.type[currentFigure.rotate][0].length);if(currentFigure.y>fieldRows-currentFigure.type[currentFigure.rotate].length)do{currentFigure.y-=1}while(currentFigure.y>fieldRows-currentFigure.type[currentFigure.rotate].length);checkNextStep("rotate")?stepFieldUpdate():currentFigure.rotate=e}function fallDown(){for(console.log("fall down");currentFigure.y<fieldRows-currentFigure.type[currentFigure.rotate].length&&checkNextStep("down");)currentFigure.y+=1,console.log("---"),stepFieldUpdate();blockMove||(!0===sounds&&putAudio.play(),stopPosition(),checkFullRows())}function stopPosition(){console.log("stop position");for(let e=0;e<fieldRows;e++)for(let t=0;t<fieldCols;t++)if(1===gameField[e][t].data){gameField[e][t].stop=!0;const r=getComputedStyle(gameField[e][t]);gameField[e][t].color=r.backgroundColor}}function checkNextStep(e="down"){let t=[];switch(e){case"down":for(let e=0;e<currentFigure.type[currentFigure.rotate].length;e++)for(let r=0;r<currentFigure.type[currentFigure.rotate][0].length;r++)0!==currentFigure.type[currentFigure.rotate][e][r]&&(1===currentFigure.type[currentFigure.rotate][e][r]&&!0!==gameField[e+currentFigure.y+1][r+currentFigure.x].stop?t.push(1):t.push(0));return!!t.every((e=>1===e));case"right":for(let e=0;e<currentFigure.type[currentFigure.rotate].length;e++)for(let r=0;r<currentFigure.type[currentFigure.rotate][0].length;r++)0!==currentFigure.type[currentFigure.rotate][e][r]&&(1===currentFigure.type[currentFigure.rotate][e][r]&&!0!==gameField[e+currentFigure.y][r+currentFigure.x+1].stop?t.push(1):t.push(0));return!!t.every((e=>1===e));case"left":for(let e=0;e<currentFigure.type[currentFigure.rotate].length;e++)for(let r=0;r<currentFigure.type[currentFigure.rotate][0].length;r++)0!==currentFigure.type[currentFigure.rotate][e][r]&&(1===currentFigure.type[currentFigure.rotate][e][r]&&!0!==gameField[e+currentFigure.y][r+currentFigure.x-1].stop?t.push(1):t.push(0));return!!t.every((e=>1===e));case"rotate":for(let e=0;e<currentFigure.type[currentFigure.rotate].length;e++)for(let r=0;r<currentFigure.type[currentFigure.rotate][0].length;r++)0!==currentFigure.type[currentFigure.rotate][e][r]&&(1===currentFigure.type[currentFigure.rotate][e][r]&&!0!==gameField[e+currentFigure.y][r+currentFigure.x].stop?t.push(1):t.push(0));return!!t.every((e=>1===e));default:return!1}}function checkFullRows(){console.log("check rows");let e=0,t=[];for(let r=0;r<fieldRows;r++)gameField[r].every((e=>1===e.data))&&(blockMove=!0,e+=1,t.push(r),deleteRow(gameField[r]));0===e?fullFieldUpdate():(scoreCount(e),replaceRows(t))}function scoreCount(e){switch(e){case 1:lines+=1,score+=100,linesField.innerText=lines.toString().padStart(6,"0"),scoreField.innerText=score.toString().padStart(9,"0"),speedUpdate();break;case 2:lines+=2,score+=300,linesField.innerText=lines.toString().padStart(6,"0"),scoreField.innerText=score.toString().padStart(9,"0"),speedUpdate();break;case 3:lines+=3,score+=600,linesField.innerText=lines.toString().padStart(6,"0"),scoreField.innerText=score.toString().padStart(9,"0"),speedUpdate();break;case 4:lines+=4,score+=1e3,linesField.innerText=lines.toString().padStart(6,"0"),scoreField.innerText=score.toString().padStart(9,"0"),speedUpdate();break;default:return}}function deleteRow(e){!0===sounds&&deleteAudio.play(),e.forEach((e=>{e.stop=!1,e.classList.add("deleted")}))}function replaceRows(e){setTimeout((()=>{for(let t=0;t<e.length;t++)for(let r=0;r<fieldRows;r++)if(r===e[t]){gameField.splice(r,1),gameField.unshift(createNewLine());break}console.log("replace rows"),blockMove=!1,fullFieldUpdate()}),220)}function createNewLine(){let e=[];for(let t=0;t<fieldCols;t++){const t=document.createElement("div");t.className="cell",t.data=0,e.push(t)}return e}function preStartAnimation(){const e=document.createElement("div");e.className="prestart-field",fieldWrapper.append(e);let t=0;function r(){e.removeChild(e.lastChild),e.lastChild?setTimeout(r,40):function(){const t="tetris",r=document.createElement("div");r.className="prestart-text",e.append(r);for(let e=0;e<t.length;e++){const o=document.createElement("span");o.className=`${t[e]}${e}`;const n=document.createElement("span");n.className="letter-wrapper",n.style.color=`rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`,n.innerText=`${t[e]}`,o.append(n),r.append(o)}setTimeout((()=>{captureText()}),1500)}()}!function o(){!0===sounds&&upDown.play();const n=document.createElement("div");n.className="prestart-row";for(let e=0;e<10;e++){const e=document.createElement("div");e.className="cell figure",e.style.backgroundColor=`rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`,n.append(e)}e.append(n),t++,t<20?setTimeout(o,40):setTimeout(r,100)}()}function captureText(){startButton.disabled=!1;const e=document.querySelector(".prestart-field"),[...t]=document.querySelectorAll(".letter-wrapper"),r=t.map((e=>getComputedStyle(e).color)),o=getComputedStyle(t[0]).fontFamily,n=getComputedStyle(t[0]).fontSize,i=[],l=t.reduce(((e,t)=>(i.push(parseFloat(getComputedStyle(t).width).toFixed(2)),e+parseFloat(getComputedStyle(t).width))),0),u=parseFloat(((e.clientWidth-l)/7).toFixed(2)),s=t.map((e=>e.innerText.toUpperCase())),a=document.createElement("canvas");a.width=e.clientWidth,a.height=e.clientHeight;const c=a.getContext("2d");c.textBaseline="middle",c.letterSpacing=u+"px",c.font=`${n} ${o}`,function(){let e=u;s.forEach(((t,o)=>{c.fillStyle=`${r[o]}`,c.strokeStyle="rgba(0, 0, 0, 0.6)",0===o?(c.fillText(t,e,a.height/2+10),c.strokeText(t,e,a.height/2+10)):(e+=u+parseFloat(i[o-1]),c.fillText(t,e,a.height/2+10),c.strokeText(t,e,a.height/2+10))}))}(),e.replaceChildren(a)}function startAnimation(){const e=document.querySelector("canvas"),t=e.getContext("2d");let r,o=[];class n{constructor(e,t,r,o){this.context=e,this.x=t,this.y=r,this.rgb=o.slice(0,3),this.alpha=o.at(-1),this.color=`rgba(${this.rgb}, ${this.alpha})`,this.destX=Math.random()*this.context.canvas.width,this.destY=Math.random()*this.context.canvas.height,this.speed=.05*Math.random()+.005}update(){this.x+=(this.destX-this.x)*this.speed,this.y+=(this.destY-this.y)*this.speed,this.alpha-=.013,this.color=`rgba(${this.rgb}, ${this.alpha})`,t.fillStyle=this.color,t.fillRect(this.x,this.y,1,1)}}const i=t.getImageData(0,0,e.width,e.height).data;t.clearRect(0,0,e.width,e.height);for(let r=0;r<e.height;r++)for(let l=0;l<e.width;l++){const u=4*(r*e.width+l);if(i[u+3]>0){const e=[i[u],i[u+1],i[u+2],(i[u+3]/255).toFixed(2)];o.push(new n(t,l,r,e))}}!0===sounds&&explosion.play(),function n(){t.clearRect(0,0,e.width,e.height),o.forEach((e=>{e.update()})),r=requestAnimationFrame(n)}(),setTimeout((()=>{cancelAnimationFrame(r),!0===foneMusic&&foneMusicAudio.play(),startGame()}),1e3)}function gameOverAnimation(){let e=gameField.length;function t(){for(let t=0;t<gameField[0].length;t++){const r=document.createElement("div"),o=parseInt(`${e}${t}`);fieldWrapper.replaceChild(r,fieldWrapper.children[o])}e++,e<gameField.length?setTimeout(t,60):(fieldWrapper.replaceChildren(),function(){const e=document.createElement("div");e.className="game-over-title",fieldWrapper.append(e);const t=document.createElement("div");t.className="game";const r=document.createElement("div");r.className="over";const o=document.createElement("div");o.className="game-over-score",o.innerText=`Your score: ${score}`;const n="game",i="over";let l=.5;for(let e=0;e<n.length;e++){const r=document.createElement("span");r.innerText=`${n[e]}`,r.style.animationDelay=l+"s",l+=.5,t.append(r)}for(let e=0;e<i.length;e++){const t=document.createElement("span");t.innerText=`${i[e]}`,r.append(t)}!0===sounds&&gameOverAudio.play();e.append(t,r),setTimeout((()=>{e.append(o)}),4e3)}())}!function r(){for(let t=0;t<gameField[0].length;t++)0===gameField[e-1][t].data&&(gameField[e-1][t].classList.add("figure"),gameField[e-1][t].style.backgroundColor=`rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`);e--,e>0?setTimeout(r,60):setTimeout(t,100)}()}preStartAnimation();