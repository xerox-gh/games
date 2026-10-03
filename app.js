const games = [
  {id:'snake',title:'Neon Serpent',genre:'arcade',icon:'〰',playable:true},
  {id:'memory',title:'Flip Side',genre:'puzzle',icon:'◈',playable:true},
  {id:'reaction',title:'Quickdraw',genre:'quick',icon:'◎',playable:true},
  {id:'target',title:'Pixel Pop',genre:'quick',icon:'✦',playable:true},
  {id:'guess',title:'Higher / Lower',genre:'puzzle',icon:'↟',playable:true},
  {id:'orbit',title:'Orbit Shift',genre:'arcade',icon:'◉'},
  {id:'stack',title:'Tiny Tower',genre:'arcade',icon:'▤'},
  {id:'maze',title:'Afterdark Maze',genre:'puzzle',icon:'⌗'},
  {id:'drift',title:'Soft Drift',genre:'arcade',icon:'≈'},
  {id:'words',title:'Four Letters',genre:'puzzle',icon:'A'},
  {id:'dash',title:'One More Dash',genre:'quick',icon:'➜'},
  {id:'void',title:'Into The Void',genre:'arcade',icon:'●'}
];

const grid = document.querySelector('.game-grid');
grid.innerHTML = games.map((g,i)=>`<article class="game-card ${g.playable?'available':''}" data-genre="${g.genre}">
  <div class="card-art"><span>${g.icon}</span>${g.playable?'<b class="tag">PLAYABLE</b>':'<b class="tag">COMING SOON</b>'}</div>
  <h3>${String(i+1).padStart(2,'0')} — ${g.title}</h3>
  <div class="card-meta"><p>${g.genre.replace('quick','quick play')}</p><button class="play-circle" data-play="${g.id}" aria-label="Play ${g.title}">${g.playable?'▶':'↗'}</button></div>
</article>`).join('');

document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  document.querySelectorAll('.game-card').forEach(card=>card.classList.toggle('hidden',btn.dataset.filter!=='all'&&card.dataset.genre!==btn.dataset.filter));
}));

const modal=document.querySelector('#gameModal'), stage=document.querySelector('#gameStage'), title=document.querySelector('#modalTitle'), help=document.querySelector('#gameHelp');
let cleanup=()=>{},current='snake';
document.addEventListener('click',e=>{const button=e.target.closest('[data-play]');if(!button)return;const game=games.find(g=>g.id===button.dataset.play);if(!game?.playable){showToast('That cabinet is getting its final polish.');return}openGame(game)});
document.querySelector('#closeModal').onclick=()=>modal.close(); modal.addEventListener('close',()=>cleanup());
document.querySelector('#restartGame').onclick=()=>openGame(games.find(g=>g.id===current),true);
function openGame(game,restart=false){cleanup();current=game.id;title.textContent=game.title;if(!restart&&!modal.open)modal.showModal();({snake:snakeGame,memory:memoryGame,reaction:reactionGame,target:targetGame,guess:guessGame}[game.id])()}
function showToast(msg){const t=document.querySelector('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400)}
document.querySelector('#soundToggle').onclick=e=>{e.currentTarget.classList.toggle('muted');showToast(e.currentTarget.classList.contains('muted')?'Sound muted':'Sound on')};

function snakeGame(){help.textContent='Arrow keys or WASD to move · Eat the green sparks';stage.innerHTML='<canvas width="520" height="380"></canvas>';const c=stage.querySelector('canvas'),x=c.getContext('2d'),size=20;let snake=[{x:12,y:9},{x:11,y:9},{x:10,y:9}],dir={x:1,y:0},food={x:19,y:9},score=0,dead=false;
  const key=e=>{const m={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]}[e.key];if(m&&!(m[0]===-dir.x&&m[1]===-dir.y)){dir={x:m[0],y:m[1]};e.preventDefault()}};window.addEventListener('keydown',key);
  const timer=setInterval(()=>{if(dead)return;let h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(h.x<0||h.x>=26||h.y<0||h.y>=19||snake.some(p=>p.x===h.x&&p.y===h.y)){dead=true}else{snake.unshift(h);if(h.x===food.x&&h.y===food.y){score++;food={x:Math.floor(Math.random()*26),y:Math.floor(Math.random()*19)}}else snake.pop()}draw()},105);
  function draw(){x.fillStyle='#111';x.fillRect(0,0,520,380);x.strokeStyle='#24211e';for(let i=0;i<520;i+=20){x.beginPath();x.moveTo(i,0);x.lineTo(i,380);x.stroke()}for(let i=0;i<380;i+=20){x.beginPath();x.moveTo(0,i);x.lineTo(520,i);x.stroke()}x.fillStyle='#c9ff43';x.fillRect(food.x*size+4,food.y*size+4,12,12);snake.forEach((p,i)=>{x.fillStyle=i?'#ff5429':'#fff';x.fillRect(p.x*size+1,p.y*size+1,18,18)});x.fillStyle='#fff';x.font='bold 14px sans-serif';x.fillText(`SCORE  ${score}`,15,24);if(dead){x.fillStyle='#000b';x.fillRect(0,0,520,380);x.font='bold 34px Space Grotesk';x.textAlign='center';x.fillText('GAME OVER',260,180);x.font='14px sans-serif';x.fillText(`Score: ${score} · Press restart`,260,212);x.textAlign='left'}}draw();cleanup=()=>{clearInterval(timer);window.removeEventListener('keydown',key)}}

function memoryGame(){help.textContent='Match every pair · Fewer moves wins';const icons=['✦','●','▲','■','✦','●','▲','■'].sort(()=>Math.random()-.5);let first=null,lock=false,moves=0;stage.innerHTML=`<div class="memory-grid">${icons.map((v,i)=>`<button class="memory-card" data-i="${i}">${v}</button>`).join('')}</div>`;stage.onclick=e=>{const b=e.target.closest('.memory-card');if(!b||lock||b.classList.contains('matched')||b===first)return;b.classList.add('flipped');if(!first){first=b;return}moves++;if(first.textContent===b.textContent){first.classList.add('matched');b.classList.add('matched');first=null;if(stage.querySelectorAll('.matched').length===8)help.textContent=`Cleared in ${moves} moves — beautiful.`}else{lock=true;setTimeout(()=>{first.classList.remove('flipped');b.classList.remove('flipped');first=null;lock=false},650)}};cleanup=()=>stage.onclick=null}
function reactionGame(){help.textContent='Wait for green, then tap as fast as you can';stage.innerHTML='<button class="reaction-button">WAIT…</button>';const b=stage.querySelector('button');let ready=false,start=0;const timeout=setTimeout(()=>{ready=true;start=performance.now();b.style.background='#c9ff43';b.style.color='#111';b.textContent='TAP!'},1200+Math.random()*2200);b.onclick=()=>{if(!ready){clearTimeout(timeout);b.textContent='TOO SOON';b.style.background='#8e50ff';help.textContent='Patience! Restart and try again.'}else{const ms=Math.round(performance.now()-start);b.textContent=`${ms} ms`;help.textContent=ms<250?'Lightning fast. Nice.':'Not bad — can you beat it?';ready=false}};cleanup=()=>clearTimeout(timeout)}
function targetGame(){help.textContent='Hit as many targets as you can in 15 seconds';let score=0,time=15,timer;stage.innerHTML='<div class="tap-score"><strong>0</strong><span>READY?</span></div>';const start=setTimeout(()=>{stage.innerHTML='';spawn();timer=setInterval(()=>{time--;help.textContent=`${time} seconds left · Score ${score}`;if(time<=0){clearInterval(timer);stage.innerHTML=`<div class="tap-score"><strong>${score}</strong><span>FINAL SCORE</span></div>`}},1000)},800);function spawn(){const b=document.createElement('button');b.className='target';b.ariaLabel='Target';b.style.left=`${8+Math.random()*82}%`;b.style.top=`${8+Math.random()*75}%`;b.onclick=()=>{score++;b.remove();spawn()};stage.append(b)}cleanup=()=>{clearTimeout(start);clearInterval(timer)}}
function guessGame(){help.textContent='Guess the secret number from 1 to 100';let secret=Math.ceil(Math.random()*100),tries=0;stage.innerHTML='<div class="tap-score"><strong>?</strong><p>I’m thinking of a number</p><form><input aria-label="Your guess" type="number" min="1" max="100" required style="padding:14px;width:130px;font-size:18px"><button class="primary-button" style="display:inline-block;box-shadow:none;padding:16px">GUESS</button></form></div>';const form=stage.querySelector('form'),label=stage.querySelector('.tap-score p');form.onsubmit=e=>{e.preventDefault();const n=+form.querySelector('input').value;tries++;if(n===secret){stage.querySelector('strong').textContent=secret;label.textContent=`You got it in ${tries} ${tries===1?'try':'tries'}!`;form.remove()}else label.textContent=n<secret?'Higher ↑':'Lower ↓';form.querySelector('input').select()};cleanup=()=>form.onsubmit=null}
