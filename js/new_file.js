window.onload=function(){
    var chess=document.getElementById('chess');
    var context=chess.getContext('2d');
    context.strokeStyle='#333';
    //创建二维数组由于判断棋子是否重复
    var chessBoard=[];
    for(var i=0;i<15;i++){
        chessBoard[i]=[];
        for(var j=0;j<15;j++){
            chessBoard[i][j]=0;
        }
    }
    //创建三维赢法数组
    var wins=[];
    for(var i=0;i<15;i++){
        wins[i]=[];
        for(var j=0;j<15;j++){
            wins[i][j]=[];
        }
    }
    //赢法(排列组合572中赢法)
    //横向
    var count=0;
    for(var i=0;i<15;i++){
        for(var j=0;j<11;j++){
            for(var k=0;k<5;k++){
                wins[i][j+k][count]=true;
            }
            count++;
        }
    }
    //纵向
    for(var i=0;i<15;i++){
        for(var j=0;j<11;j++){
            for(var k=0;k<5;k++){
                wins[j+k][i][count]=true;
            }
            count++;
        }
    }
    //斜向
    for(var i=0;i<11;i++){
        for(var j=0;j<11;j++){
            for(var k=0;k<5;k++){
                wins[i+k][j+k][count]=true;
            }
            count++;
        }
    }
    //反斜向
    for(var i=0;i<11;i++){
        for(var j=14;j>3;j--){
            for(var k=0;k<5;k++){
                wins[i+k][j-k][count]=true;
            }
            count++;
        }
    }
    //赢法统计数组
    var myWin=[];
    var computerWin=[];
    //定义一个状态值，判断棋是否结束(开始为未结束状态false,赢棋之后改为true，阻止落棋)
    var over=false;
    for(var i=0;i<count;i++){
        myWin[i]=0;
        computerWin[i]=0;
    }
    //创建棋盘
    for(var i=0;i<15;i++){
        context.moveTo(15+i*30,15);
        context.lineTo(15+i*30,435);
        context.stroke();
        context.moveTo(15,15+i*30);
        context.lineTo(435,15+i*30);
        context.stroke();   //描边
    }
    var me=true;
    var oneStep=function(i,j,me){
        //画圆
        context.beginPath();
        context.arc(15+i*30,15+j*30,13,0,2*Math.PI);
        context.closePath();
        //填充色(径向)
        var gradient=context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
        if(me){
            gradient.addColorStop(0,'#0a0a0a');    //圆心
            gradient.addColorStop(1,'#636766');    //边框
        }
        else{
            gradient.addColorStop(0,'#aaa');
            gradient.addColorStop(1,'#f9f9f9');
        }
        //调用填充色
        context.fillStyle=gradient;   //填充样式
        context.fill();    //填充
    }
    //点击下棋
    chess.onclick=function(e){
        if(over){
            return;    //判断棋是否结束，结束就返回
        }
        var x=e.offsetX;
        var y=e.offsetY;
        var i=Math.floor(x/30);
        var j=Math.floor(y/30);
        //判断是否棋子重复(如果为0则可以下棋并做上记号，下次不能再下这个位子)
        if (chessBoard[i][j]==0) {
        	oneStep(i,j,me);
    		chessBoard[i][j]=1;   //标记已经有棋子
        	//遍历赢法数组
        	for(var k=0;k<count;k++){
        	    if(wins[i][j][k]){
        	        myWin[k]++;
        	        computerWin[k]=6;   //我方在此落棋之后对方将不可能在此处赢我方(给一个异常值即可)
        	        if(myWin[k]==5){
        	            alert('你赢了');
        	            over=true;
        	        }
        	    }
        	}
        	if(!over){
        	    me=!me;    //状态取反，实现黑白交换（不可用赋值方法，否则需要做判断）
        	    computerAI();
        	}
        }   
    }
    var computerAI=function(){
        var myScore=[];
        var computerScore=[];
        var max=0;   //定义最高分
        var u=0,v=0;    //最高分坐标
        for(var i=0;i<15;i++){
            myScore[i]=[];
            computerScore[i]=[];
            for(var j=0;j<15;j++){
                myScore[i][j]=0;
                computerScore[i][j]=0;
            }
        }
        //遍历棋盘
        for(var i=0;i<15;i++){
            for(var j=0;j<15;j++){
                if(chessBoard[i][j]==0){
                    for(var k=0;k<count;k++){
                        if(wins[i][j][k]){
                            if(myWin[k]==1){
                                myScore[i][j]+=200; 
                            }
                            else if(myWin[k]==2){
                                myScore[i][j]+=400;
                            }
                            else if(myWin[k]==3){
                                myScore[i][j]+=6000;
                            }
                            else if(myWin[k]==4){
                                myScore[i][j]+=10000;
                            }
                            
                            if(computerWin[k]==1){
                                computerScore[i][j]+=220;
                            }
                            else if(computerWin[k]==2){
                                computerScore[i][j]+=420;
                            }
                            else if(computerWin[k]==3){
                                computerScore[i][j]+=8020;
                            }
                            else if(computerWin[k]==4){
                                computerScore[i][j]+=15000;
                            }
                        }
                    }
                    if(myScore[i][j]>max){
                        max=myScore[i][j];
                        u=i;
                        v=j;
                    }
                    else if(myScore[i][j]==max){
                        if(computerScore[i][j]>computerScore[u][v]){
                            u=i;
                            v=j;
                        }
                    }
                    
                    if(computerScore[i][j]>max){
                        max=computerScore[i][j];
                        u=i;
                        v=j;
                    }
                    else if(computerScore[i][j]==max){
                        if(myScore[i][j]>myScore[u][v]){
                            u=i;
                            v=j;
                        }
                    }
                }
            }
        }
        oneStep(u,v,false);
        chessBoard[u][v]=2;
        //遍历赢法数组
        for(var k=0;k<count;k++){
            if(wins[u][v][k]){
                computerWin[k]++;
                myWin[k]=6;   //对方在此落棋之后我方将不可能在此处赢对方(给一个异常值即可)
                if(computerWin[k]==5){
                    alert('计算机赢了');
                    over=true;
                }
            }
        }
        if(!over){
            me=!me;    //状态取反，实现黑白交换（不可用赋值方法，否则需要做判断）
        }
    }
}