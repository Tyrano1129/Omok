class Omok {
  //상수 정의
  VACANT = "";
  BALCK = "black";
  WHITE = "white";
  HUMAN = "H";
  COM = "C";

  Alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
  ];
  // 5목 패턴
  omokPattern = [
    [
      "SBBBBBS",
      "SBBBBBW",
      "SBBBBBX",
      "WBBBBBS",
      "WBBBBBW",
      "WBBBBBX",
      "XBBBBBS",
      "XBBBBBX",
    ],
    ["WWWWW"],
  ];
  omokfirstPattern = [["SBBBBS", "SBBBBS"], ["SBBBBW", "SBBBBS"], []];
  omokFlag = [];
  boardSize;
  playerType = this.HUMAN;
  firstPlayer = this.HUMAN;
  blockInterval;

  mainBoard = [];
  mainBoard = new ObservableArray(
    () => {
      this.makeOmokArray();
    },
    () => {
      this.makeOmokArray();
    }
  );
  boardArray;
  constructor(boardSize, playerType, firstPlayer) {
    this.boardSize = boardSize;
    if (this.boardSize == 19) {
      this.blockInterval = 30;
    } else if (this.boardSize == 15) {
      this.blockInterval = 38;
    }
    this.boardArray = Array.from(Array(this.boardSize + 1), () =>
      new Array(this.boardSize + 1).fill("")
    );
    this.scoreArray = Array.from(Array(this.boardSize + 1), () =>
      new Array(this.boardSize + 1).fill(1)
    );
    // 상대 선수
    this.playerType = playerType;
    // 흑선수
    this.firstPlayer = firstPlayer;
    this.trun = null;
  }

  drawBoard(ctx) {
    ctx.clearRect(0, 0, 700, 630);
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = "black";

    for (let i = 1; i < this.boardSize; i += 1) {
      for (let k = 1; k < this.boardSize; k += 1) {
        ctx.strokeRect(
          i * this.blockInterval,
          k * this.blockInterval,
          this.blockInterval,
          this.blockInterval
        );
      }
    }
    // 점 찍기
    if (this.boardSize == 19) {
      this.drawDot(4, 4, ctx);
      this.drawDot(4, 10, ctx);
      this.drawDot(4, 16, ctx);
      this.drawDot(10, 4, ctx);
      this.drawDot(10, 10, ctx);
      this.drawDot(10, 16, ctx);
      this.drawDot(16, 4, ctx);
      this.drawDot(16, 10, ctx);
      this.drawDot(16, 16, ctx);
    } else if (this.boardSize == 15) {
      this.drawDot(4, 4, ctx);
      this.drawDot(4, 12, ctx);
      this.drawDot(12, 4, ctx);
      this.drawDot(12, 12, ctx);
    }

    // 세로 숫자
    for (let i = 1; i <= this.boardSize; i += 1) {
      ctx.fillStyle = "red";
      ctx.textBaseline = "top";
      ctx.textAlign = "center";
      ctx.font = "12px verdana";
      ctx.fillText(i, this.blockInterval / 2 + 5, i * this.blockInterval - 5);
    }
    // 가로 알바벳
    for (let i = 1; i <= this.boardSize; i += 1) {
      ctx.fillStyle = "blue";
      ctx.textBaseline = "top";
      ctx.textAlign = "center";
      ctx.font = "12px verdana";
      ctx.fillText(
        this.Alphabet[i - 1],
        i * this.blockInterval,
        this.boardSize * this.blockInterval + 9
      );
    }
  }

  drawDot(x, y, ctx) {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(x * this.blockInterval, y * this.blockInterval, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  getOmokPostiton(LayerX, LayerY) {
    return {
      omokX: Math.round(LayerX / this.blockInterval),
      omokY: Math.round(LayerY / this.blockInterval),
    };
  }
  getBoardPosition(omokX, omokY) {
    return {
      boardX: omokX * this.blockInterval,
      boardY: omokY * this.blockInterval,
    };
  }
  getNextColor() {
    if (this.mainBoard.length == 0) {
      return this.BALCK;
    } else {
      return this.mainBoard[this.mainBoard.length - 1].color == this.BALCK
        ? this.WHITE
        : this.BALCK;
    }
  }
  // 착수 정보 저장(추가)
  putStone(omokX, omokY, cnt) {
    // 예외체크
    let check = this.mainBoard.findIndex(
      (idx) => idx.x == omokX && idx.y == omokY
    );
    if (check != -1) return;
    this.trun = {
      x: omokX,
      y: omokY,
      color: this.getNextColor(),
      order: this.mainBoard.length + 1,
    };
    this.mainBoard.push(this.trun);
    //1번방향
    this.analyzePoint(
      this.trun,
      this.mainBoard[this.mainBoard.length - 1].color == "black" ? 0 : 1,
      1,
      0,
      1
    );
    this.analyzePoint(
      this.trun,
      this.mainBoard[this.mainBoard.length - 1].color == "black" ? 0 : 1,
      0,
      1,
      2
    );
    this.analyzePoint(
      this.trun,
      this.mainBoard[this.mainBoard.length - 1].color == "black" ? 0 : 1,
      1,
      1,
      3
    );
    this.analyzePoint(
      this.trun,
      this.mainBoard[this.mainBoard.length - 1].color == "black" ? 0 : 1,
      -1,
      1,
      4
    );
  }

  // 돌 그리기
  drawStone(ctx, pointinfo) {
    let { boardX, boardY } = this.getBoardPosition(pointinfo.x, pointinfo.y);

    // 오목돌 그리기
    ctx.beginPath();
    ctx.strokeStyle - "darkgrey";
    ctx.arc(
      boardX,
      boardY,
      (this.blockInterval - 2) / 2,
      0,
      Math.PI * 2,
      false
    );
    ctx.stroke();
    ctx.fillStyle = pointinfo.color;
    ctx.arc(
      boardX,
      boardY,
      (this.blockInterval - 2) / 2,
      0,
      Math.PI * 2,
      false
    );
    ctx.fill();

    // 착수순서 표시
    // if (pointinfo.order) {
    //   pointinfo.color == "black"
    //     ? (ctx.fillStyle = "white")
    //     : (ctx.fillStyle = "black");
    //   ctx.textBaseline = "middle";
    //   ctx.textAlign = "center";
    //   ctx.font = "14px verdana";
    //   ctx.fillText(pointinfo.order, boardX, boardY);
    // }
    // 마지막 수 표시
    // if (pointinfo.order == this.mainBoard.length) {
    //   ctx.save();
    //   ctx.strokeStyle = "red";
    //   ctx.strokeRect(
    //     boardX - this.blockInterval / 2,
    //     boardY - this.blockInterval / 2,
    //     this.blockInterval,
    //     this.blockInterval
    //   );
    //   ctx.restore();
    // }
  }
  checkOccupied(omokX, omokY) {
    let filtered = this.mainBoard.filter((point) => {
      return point.x == omokX && point.y == omokY;
    });
    return filtered.length > 0;
  }
  undoStone() {
    this.mainBoard.pop();
  }

  getStoneInfo(array, item, dx, dy) {
    let pointX;
    let pointY;
    let pos = 0;
    let getStoneInfo = "";
    let spaceCount = 0; // 연속된 공백개수

    // 멈춤 조건
    // 1. 다른 돌이있는경우
    // 2. 오목판을 벗어난 경우
    // 3. 공백인 경우는 연속3개 공백이면 멈춤

    do {
      pointX = item.x + pos * dx;
      pointY = item.y + pos * dy;
      if (
        pointX < 1 ||
        pointX > this.boardSize ||
        pointY < 1 ||
        pointY > this.boardSize
      ) {
        getStoneInfo += "X";
        break;
      }
      if (array[pointX][pointY] == "black") {
        getStoneInfo += "B";
        spaceCount = 0;
        // 돌이 바뀌면 멈춤
        if (array[pointX][pointY] != item.color) break;
      } else if (array[pointX][pointY] == "white") {
        getStoneInfo += "W";
        spaceCount = 0;
        // 돌이 바뀌면 멈춤
        if (array[pointX][pointY] != item.color) break;
      } else {
        getStoneInfo += "S";
        spaceCount += 1;
        // 연속된 공백수 3개이면 멈춤
        if (spaceCount == 3) break;
      }
      pos += 1;
    } while (
      pointX >= 1 &&
      pointX <= this.boardSize &&
      pointY >= 1 &&
      pointY <= this.boardSize
    );

    spaceCount = 0;
    pos = 1;

    do {
      pointX = item.x + pos * dx * -1;
      pointY = item.y + pos * dy * -1;
      if (
        pointX < 1 ||
        pointX > this.boardSize ||
        pointY < 1 ||
        pointY > this.boardSize
      ) {
        getStoneInfo = "X" + getStoneInfo;
        break;
      }

      if (array[pointX][pointY] == "black") {
        getStoneInfo = "B" + getStoneInfo;
        spaceCount = 0;
        // 돌이 바뀌면 멈춤
        if (array[pointX][pointY] != item.color) break;
      } else if (array[pointX][pointY] == "white") {
        getStoneInfo = "W" + getStoneInfo;
        spaceCount = 0;
        // 돌이 바뀌면 멈춤
        if (array[pointX][pointY] != item.color) break;
      } else {
        getStoneInfo = "S" + getStoneInfo;
        spaceCount += 1;
        // 연속된 공백수 3개이면 멈춤
        if (spaceCount == 3) break;
      }
      pos += 1;
    } while (
      pointX >= 1 &&
      pointX <= this.boardSize &&
      pointY >= 1 &&
      pointY <= this.boardSize
    );
    return getStoneInfo;
  }
  // 승리조건 찾기
  findPattern(stoneInfo, pattern) {
    let result = false;
    pattern.forEach((i) => {
      if (stoneInfo.includes(i)) {
        result = true;
      }
    });
    return result;
  }
  analyzePoint(pointInfo, checkstone, dx, dy, direction) {
    //패턴 flag 초기화
    this.omokFlag[direction] = false;
    // 패턴검사
    const pattern = this.getStoneInfo(this.boardArray, pointInfo, dx, dy);
    // 오목 체크
    if (this.findPattern(pattern, this.omokPattern[checkstone])) {
      this.omokFlag[direction] = true;
      this.omokPattern[direction] = pattern;
      return;
    }
  }
  makeOmokArray() {
    this.boardArray = Array.from(Array(this.boardSize + 1), () =>
      new Array(this.boardSize + 1).fill("")
    );
    this.mainBoard.forEach((item) => {
      this.boardArray[item.x][item.y] = item.color;
    });
  }
  getOrder() {
    return this.mainBoard.length;
  }
}

class ObservableArray extends Array {
  constructor(onPush, onPop, ...elements) {
    super(...elements);
    this.onPush = onPush;
    this.onPop = onPop;
  }
  push(...elements) {
    super.push(...elements);
    this.onPush?.(this);
  }
  pop() {
    super.pop();
    this.onPop?.(this);
  }
}
