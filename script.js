
const MAX_DFS_DEPTH = 20

function createGrid(name){

let g = document.getElementById(name + "-grid")

for(let i=0;i<9;i++){

let input = document.createElement("input")

input.maxLength = 1

input.oninput = updateViz

g.appendChild(input)

}

}

function getState(name){

let nums = [...document.querySelectorAll("#"+name+"-grid input")]
.map(x=>Number(x.value)||0)

return[

nums.slice(0,3),
nums.slice(3,6),
nums.slice(6,9)

]

}

function setState(name,state){

let flat = state.flat()

document.querySelectorAll("#"+name+"-grid input")
.forEach((el,i)=>el.value=flat[i])

updateViz()

}

function clearGrid(name){

document.querySelectorAll("#"+name+"-grid input")
.forEach(x=>x.value="")

updateViz()

}

function clearAll(){

clearGrid("initial")
clearGrid("goal")

document.getElementById("results").innerHTML = `

Time:-<br>
Nodes Expanded:-<br>
Path Cost:-

`

}

function randomInitial(){

setState("initial", randomSolvable())

}

function randomGoal(){

setState("goal", randomSolvable())

}

function updateViz(){

draw(getState("initial"))

}

function draw(state){

let viz = document.getElementById("viz-grid")

viz.innerHTML=""

state.flat().forEach(v=>{

let d = document.createElement("div")

d.className="tile"

d.innerText = v||""

viz.appendChild(d)

})

}

function stringify(s){

return JSON.stringify(s)

}

function neighbors(s){

let x,y

for(let i=0;i<3;i++)
for(let j=0;j<3;j++)
if(s[i][j]==0){

x=i
y=j

}

let dirs=[[1,0],[-1,0],[0,1],[0,-1]]

let res=[]

for(let d of dirs){

let nx=x+d[0]
let ny=y+d[1]

if(nx>=0&&ny>=0&&nx<3&&ny<3){

let c=JSON.parse(JSON.stringify(s))

[c[x][y],c[nx][ny]]=[c[nx][ny],c[x][y]]

res.push(c)

}

}

return res

}

function manhattan(a,b){

let dist=0

for(let i=0;i<3;i++)
for(let j=0;j<3;j++){

let v=a[i][j]

if(v){

for(let x=0;x<3;x++)
for(let y=0;y<3;y++)
if(b[x][y]==v)
dist+=Math.abs(i-x)+Math.abs(j-y)

}

}

return dist

}

function bfs(start,goal){

let q=[[start,[]]]

let visited=new Set()

let nodes=0

while(q.length){

let [s,path]=q.shift()

let k=stringify(s)

if(visited.has(k)) continue

visited.add(k)

nodes++

if(k==stringify(goal))

return{path:[...path,s],nodes}

for(let n of neighbors(s))

q.push([n,[...path,s]])

}

}

function dfs(start,goal){

let stack=[[start,[],0]]

let visited=new Set()

let nodes=0

while(stack.length){

let [s,path,d]=stack.pop()

let k=stringify(s)

if(visited.has(k)) continue

visited.add(k)

nodes++

if(k==stringify(goal))

return{path:[...path,s],nodes}

if(d<MAX_DFS_DEPTH)

for(let n of neighbors(s))

stack.push([n,[...path,s],d+1])

}

}

function astar(start,goal){

let open=[[start,[],0]]

let visited=new Set()

let nodes=0

while(open.length){

open.sort((a,b)=>a[2]-b[2])

let [s,path,c]=open.shift()

let k=stringify(s)

if(visited.has(k)) continue

visited.add(k)

nodes++

if(k==stringify(goal))

return{path:[...path,s],nodes}

for(let n of neighbors(s)){

let g=path.length+1

open.push([n,[...path,s],g+manhattan(n,goal)])

}

}

}

function solve(){

let start=getState("initial")
let goal=getState("goal")

if(!isSolvable(start) || !isSolvable(goal)){

alert("Puzzle not solvable")

return

}

let algo=document.querySelector("input[name='algo']:checked").value

let t0=performance.now()

let result=

algo=="bfs"?bfs(start,goal):
algo=="dfs"?dfs(start,goal):
astar(start,goal)

let time=(performance.now()-t0)/1000

animate(result.path)

document.getElementById("results").innerHTML=`

Time: ${time.toFixed(3)} s<br>
Nodes Expanded: ${result.nodes}<br>
Path Cost: ${result.path.length-1}

`

}

function animate(path){

let i=0

let t=setInterval(()=>{

draw(path[i])

i++

if(i>=path.length)clearInterval(t)

},300)

}

function randomSolvable(){

let arr=[0,1,2,3,4,5,6,7,8]

do{

arr.sort(()=>Math.random()-0.5)

}while(!isSolvable(arr))

return[

arr.slice(0,3),
arr.slice(3,6),
arr.slice(6,9)

]

}

function isSolvable(state){

let arr=Array.isArray(state[0])?state.flat():state

let inv=0

for(let i=0;i<9;i++)
for(let j=i+1;j<9;j++)
if(arr[i]&&arr[j]&&arr[i]>arr[j])
inv++

return inv%2==0

}

createGrid("initial")
createGrid("goal")
createGrid("viz")

randomInitial()
randomGoal()
