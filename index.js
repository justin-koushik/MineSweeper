const can=document.querySelector("canvas")
const p=document.querySelector("p")
const w=500
const h=500
can.width=w
can.height=h
can.style.border="1px solid"
const ctx=can.getContext("2d")
let mousemove=[0,0]
class minesweeper{
    constructor(dx=50){
        this.dx=dx
        this.nrows=h/dx>>0
        this.ncols=w/dx>>0
        this.total=this.nrows*this.ncols
        this.reset()
    }
    reset(){
        this.nbombs=0.2*this.total
        this.board=new Array(this.nrows)
        for(let i=0;i<this.nrows;i++){
            let temp=new Array(this.ncols)
            for(let j=0;j<this.ncols;j++){
                temp[j]=[0,false,false]
            }
            this.board[i]=temp
        }
        this.fillBombs()
        this.setupboard()
        this.revealed=this.total-this.nbombs
        this.draw()
    }
    fillBombs(){
        let total=this.nrows*this.ncols
        let n=0
        for(;n<this.nbombs;n++){
            let idx=Math.random()*total>>0
            let i=idx/this.nrows>>0
            let j=idx%this.ncols
            if(this.board[i][j][0]===0){
                this.board[i][j][0]=-1
                --total;
            }
        }
        this.nbombs=this.nrows*this.ncols-total
    }
    setupboard(){
        for(let i=0;i<this.nrows;i++){
            for(let j=0;j<this.ncols;j++){
                if(this.board[i][j][0]===0){
                    this.board[i][j][0]=this.countBombs(i,j)
                }
            }
        }
    }
    countBombs(i,j){
        let bool1=i+1<this.nrows
        let bool2=i-1>=0
        let bool3=j+1<this.ncols
        let bool4=j-1>=0
        let count=0
        if(bool1){
            count+=(this.board[i+1][j][0]===-1)
            if(bool3){
                count+=(this.board[i+1][j+1][0]===-1)
            }
            if(bool4){
                count+=(this.board[i+1][j-1][0]===-1)
            }
        }
        if(bool2){
            count+=(this.board[i-1][j][0]===-1)
            if(bool3){
                count+=(this.board[i-1][j+1][0]===-1)
            }
            if(bool4){
                count+=(this.board[i-1][j-1][0]===-1)
            }
        }
        if(bool3){
            count+=(this.board[i][j+1][0]===-1)
        }
        if(bool4){
            count+=(this.board[i][j-1][0]===-1)
        }
        return count

    }
    draw(){
        p.innerText=`no of bombs:${this.nbombs}`
        ctx.clearRect(0,0,w,h)
        for(let i=0;i<this.ncols;i++){
            ctx.beginPath()
            ctx.moveTo(this.dx*i,0)
            ctx.lineTo(this.dx*i,h)
            ctx.stroke()
            ctx.closePath()
        }
        for(let i=0;i<this.nrows;i++){
            ctx.beginPath()
            ctx.moveTo(0,this.dx*i)
            ctx.lineTo(w,this.dx*i)
            ctx.stroke()
            ctx.closePath()
        }
        for(let i=0;i<this.nrows;i++){
            for(let j=0;j<this.ncols;j++){
                let x=j*this.dx+this.dx/2
                let y=i*this.dx+this.dx/2
                if(this.board[i][j][1]){
                    if(this.board[i][j][0]===-1){
                        ctx.beginPath()
                        ctx.arc(x,y,this.dx/2-10,0,Math.PI*2)
                        ctx.fillStyle="black"
                        ctx.fill()
                        ctx.stroke()
                        ctx.closePath()
                    }else{
                        ctx.fillStyle="black"
                        if(this.board[i][j][0]>0){
                        ctx.font=`${this.dx-10}px Arial`
                        ctx.textAlign="center"
                        ctx.textBaseline="middle"
                        ctx.fillText(`${this.board[i][j][0]}`,x,y,this.dx)
                        }else{
                            ctx.fillStyle="rgba(0,0,0,0.2)"
                            ctx.fillRect(j*this.dx,i*this.dx,this.dx,this.dx)
                        }
                    }
                }else{
                    if(this.board[i][j][2]){
                        ctx.beginPath()
                        ctx.arc(x,y,this.dx/2-10,0,Math.PI*2)
                        ctx.fillStyle="red"
                        ctx.fill()
                        ctx.stroke()
                        ctx.closePath()
                    }
                }
            }
        }
    }
    collapse(i,j){
        if(this.board[i][j][0]!==-1){
            this.board[i][j][1]=true
            this.revealed-=1
            for(let dy=-1;dy<2;dy++){
                for(let dx=-1;dx<2;dx++){
                    if(dy===0 && dx===0){
                        continue
                    }
                    if(i+dy>=0 && i+dy<this.nrows){
                        if(j+dx>=0 && j+dx<this.ncols){
                        if(this.board[i+dy][j+dx][1]===false){
                            if(this.board[i+dy][j+dx][0]===0){
                                this.collapse(i+dy,j+dx)
                            }else{
                                if(this.board[i+dy][j+dx][0]!==-1 && this.board[i][j][0]===0){
                                    this.board[i+dy][j+dx][1]=true
                                    this.revealed-=1
                                }
                            }
                        }
                    }
                    }
                }
            }
        }
    }
}

const game=new minesweeper()    

let step=0
can.onclick=(e)=>{
    let i=(e.y)/game.dx>>0
    let j=(e.x)/game.dx>>0
    if(step===0){
        if(game.board[i][j][0]===-1){
            game.board[i][j]=[0,false,false]
            game.board[i][j][0]=game.countBombs(i,j)
            for(let y=-1;y<2;y++){
                for(let x=-1;x<2;x++){
                    if(y===0 && x===0){
                        continue
                    }
                    if(game.board[i+y][j+x][0]!==-1){
                        game.board[i+y][j+x][0]-=1
                    }
                }
            }
            game.collapse(i,j)
            game.draw()
        }
        step=1
    }
    if(game.board[i][j][0]===-1){
        game.board[i][j][1]=true
        game.draw()
        ctx.fillStyle="#112233"
        ctx.clearRect(0,0,w,h)
        ctx.fillText("stepped on bomb!!",w/2,h/2)
        setTimeout(()=>{
            game.reset()
            step=0
        },2000)
    }else{
        // if(game.board[i][j][1]){
        //     for(let dy=-1;dy<2;dy++){
        //         for(let dx=-1;dx<2;dx++){
        //             if(dx===0 && dy===0){
        //                 continue
        //             }
        //             if(i+dy>=0 && i+dy<game.nrows){
        //                 if(j+dy>=0 && j+dy<game.ncols){
        //                     if(game.board[i+dy][j+dx][0]!==-1){
        //                         game.board[i+dy][j+dx][1]=true
        //                         game.collapse(i+dy,j+dx)
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
        game.collapse(i,j)
        game.draw()
        step=1
        if(game.revealed===0){
            ctx.clearRect(0,0,w,h)
            ctx.fillStyle="#112233"
            ctx.fillText('hurray!!',w/2,h/2)
            setTimeout(()=>{
                game.reset()
                step=0
            },2000)
        }
    }
}
can.onmousemove=(e)=>{
    let i=(e.y)/game.dx>>0
    let j=(e.x)/game.dx>>0
    mousemove[0]=i
    mousemove[1]=j
}
window.onkeydown=(e)=>{
    if(e.code==='Space'){
        game.board[mousemove[0]][mousemove[1]][2]=!game.board[mousemove[0]][mousemove[1]][2]
        game.nbombs+=(game.board[mousemove[0]][mousemove[1]][2]?-1:1)
        game.draw()
    }
}