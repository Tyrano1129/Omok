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
    [
      "SWWWWWS",
      "SWWWWWB",
      "SWWWWWX",
      "BWWWWWS",
      "BWWWWWB",
      "BWWWWWX",
      "XWWWWWS",
      "XWWWWWX",
    ],
  ];
  // 44 패턴
  // omokfirstPattern1 = ["SBBBBS", "SBBBBW", "WBBBBS"];
  // 33 패턴
  // omokfirstPattern2 = ["SBBBS", "SBBBW", "WBBBS"];
  // 오목 게임의 상태와 정보를 담는 변수들
  omokFlag = [];
  boardSize;
  playerType = this.HUMAN;
  firstPlayer = this.HUMAN;
  blockInterval;
  // 오목판과 착수 정보를 담는 배열
  // mainBoard = [];
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
    // 오목판 크기에 따라 블록 간격을 설정
    if (this.boardSize == 19) {
      this.blockInterval = 30;
    } else if (this.boardSize == 15) {
      this.blockInterval = 38;
    }
    // 오목판과 스코어 배열 초기화
    this.boardArray = Array.from(Array(this.boardSize + 1), () =>
      new Array(this.boardSize + 1).fill("")
    );
    this.scoreArray = Array.from(Array(this.boardSize + 1), () =>
      new Array(this.boardSize + 1).fill(1)
    );
    // 플레이어의 타입과 첫 수를 설정
    this.playerType = playerType;
    this.firstPlayer = firstPlayer;
    this.trun = null;
  }
  // 오목판 그리기
  drawBoard(ctx) {
    ctx.clearRect(0, 0, 700, 630);
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = "black";
    // 네모 그리기
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
  // 오목판 위치
  getOmokPostiton(LayerX, LayerY) {
    return {
      omokX: Math.round(LayerX / this.blockInterval),
      omokY: Math.round(LayerY / this.blockInterval),
    };
  }
  // 타겟 위치
  getBoardPosition(omokX, omokY) {
    return {
      boardX: omokX * this.blockInterval,
      boardY: omokY * this.blockInterval,
    };
  }
  // 흑과 백 바꾸기
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
  putStone(omokX, omokY) {
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
    //2번방향
    this.analyzePoint(
      this.trun,
      this.mainBoard[this.mainBoard.length - 1].color == "black" ? 0 : 1,
      0,
      1,
      2
    );
    //3번방향
    this.analyzePoint(
      this.trun,
      this.mainBoard[this.mainBoard.length - 1].color == "black" ? 0 : 1,
      1,
      1,
      3
    );
    //4번방향
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
    if (pointinfo.order) {
      pointinfo.color == "black"
        ? (ctx.fillStyle = "white")
        : (ctx.fillStyle = "black");
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.font = "14px verdana";
      ctx.fillText(pointinfo.order, boardX, boardY);
    }
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

    // 오른쪽
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
      if (array[pointY][pointX] == "black") {
        getStoneInfo += "B";
        spaceCount = 0;
        // 돌이 바뀌면 멈춤
        if (array[pointY][pointX] != item.color) break;
      } else if (array[pointY][pointX] == "white") {
        getStoneInfo += "W";
        spaceCount = 0;
        // 돌이 바뀌면 멈춤
        if (array[pointY][pointX] != item.color) break;
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
    // 왼쪽
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

      if (array[pointY][pointX] == "black") {
        getStoneInfo = "B" + getStoneInfo;
        spaceCount = 0;
        // 돌이 바뀌면 멈춤
        if (array[pointY][pointX] != item.color) break;
      } else if (array[pointY][pointX] == "white") {
        getStoneInfo = "W" + getStoneInfo;
        spaceCount = 0;
        // 돌이 바뀌면 멈춤
        if (array[pointY][pointX] != item.color) break;
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
    console.log(this.boardArray);
    const pattern = this.getStoneInfo(this.boardArray, pointInfo, dx, dy);
    console.log(this.check33(pointInfo));
    // 오목 체크
    if (this.findPattern(pattern, this.omokPattern[checkstone])) {
      this.omokFlag[direction] = true;
      return;
    }
  }
  check33(pointInfo) {
    for (let i = 0; i < this.boardArray.length; i += 1) {
      if (
        i + 2 >= this.boardArray.length ||
        i + 1 >= this.boardArray.length ||
        i - 2 < 0 ||
        i - 1 < 0
      ) {
        continue;
      }
      for (let k = 0; k < this.boardArray[i].length; k += 1) {
        if (
          k + 2 >= this.boardArray.length ||
          k + 1 >= this.boardArray.length ||
          k - 2 < 0 ||
          k - 1 < 0
        ) {
          continue;
        }
        if (
          this.boardArray[i - 2][k] == pointInfo.color &&
          this.boardArray[i - 1][k] == pointInfo.color &&
          this.boardArray[i - 1][k + 1] == pointInfo.color &&
          this.boardArray[i - 2][k + 2] == pointInfo.color
        ) {
          return true;
        } else if (
          this.boardArray[i - 1][k + 1] == pointInfo.color &&
          this.boardArray[i - 2][k + 2] == pointInfo.color &&
          this.boardArray[i][k + 1] == pointInfo.color &&
          this.boardArray[i][k + 2] == pointInfo.color
        ) {
          return true;
        } else if (
          this.boardArray[i][k + 1] == pointInfo.color &&
          this.boardArray[i][k + 2] == pointInfo.color &&
          this.boardArray[i + 1][k + 1] == pointInfo.color &&
          this.boardArray[i + 2][k + 2] == pointInfo.color
        ) {
          return true;
        } else if (
          this.boardArray[i][k + 1] == pointInfo.color &&
          this.boardArray[i][k + 2] == pointInfo.color &&
          this.boardArray[i + 1][k + 1] == pointInfo.color &&
          this.boardArray[i + 2][k + 2] == pointInfo.color
        ) {
          return true;
        } else if (
          this.boardArray[i + 1][k + 1] == pointInfo.color &&
          this.boardArray[i + 2][k + 2] == pointInfo.color &&
          this.boardArray[i + 1][k] == pointInfo.color &&
          this.boardArray[i + 2][k] == pointInfo.color
        ) {
          return true;
        } else if (
          this.boardArray[i + 1][k] == pointInfo.color &&
          this.boardArray[i + 2][k] == pointInfo.color &&
          this.boardArray[i + 1][k - 1] == pointInfo.color &&
          this.boardArray[i + 2][k - 2] == pointInfo.color
        ) {
          return true;
        } else if (
          this.boardArray[i + 1][k - 1] == pointInfo.color &&
          this.boardArray[i + 2][k - 2] == pointInfo.color &&
          this.boardArray[i][k - 1] == pointInfo.color &&
          this.boardArray[i][k - 2] == pointInfo.color
        ) {
          return true;
        } else if (
          this.boardArray[i][k - 1] == pointInfo.color &&
          this.boardArray[i][k - 2] == pointInfo.color &&
          this.boardArray[i - 1][k - 1] == pointInfo.color &&
          this.boardArray[i - 2][k - 2] == pointInfo.color
        ) {
          return true;
        } else if (
          this.boardArray[i][k - 1] == pointInfo.color &&
          this.boardArray[i][k - 2] == pointInfo.color &&
          this.boardArray[i - 1][k - 1] == pointInfo.color &&
          this.boardArray[i - 2][k - 2] == pointInfo.color
        ) {
          return true;
        }
        if (
          this.boardArray[i + 1][k] == pointInfo.color &&
          this.boardArray[i][k + 1] == pointInfo.color &&
          this.boardArray[i - 1][k] == pointInfo.color &&
          this.boardArray[i][k - 1] == pointInfo.color
        ) {
          return true;
        } else if (
          this.boardArray[i + 1][k + 1] == pointInfo.color &&
          this.boardArray[i - 1][k - 1] == pointInfo.color &&
          this.boardArray[i - 1][k + 1] == pointInfo.color &&
          this.boardArray[i + 1][k - 1] == pointInfo.color
        ) {
          return true;
        }
      }
    }
    return false;
  }
  // 오목 배열 만들기
  makeOmokArray() {
    this.boardArray = Array.from(Array(this.boardSize + 1), () =>
      new Array(this.boardSize + 1).fill("")
    );
    this.mainBoard.forEach((item) => {
      this.boardArray[item.y][item.x] = item.color;
    });
  }
  // 착수 순서 가져오기
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
