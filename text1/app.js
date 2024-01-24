// 캔버스
const canvas = document.querySelector(".canvas");
const context = canvas.getContext("2d");
// 버튼
const startbtn = document.querySelector(".start");
const undobtn = document.querySelector(".undo");
// 오목 사이즈 정하기
// const boardSizeBtn = document.querySelector(".boardsize");
const boardSizeBtn = [
  document.querySelector("#size15"),
  document.querySelector("#size19"),
];
// 플레이어 타입정하기 com : player
// const playerBtn = document.querySelector(".playertype");
const playerBtn = [
  document.querySelector("#human"),
  document.querySelector("#com"),
];
// 흑 선수가 누군지
// const firstBtn = document.querySelector(".firstplayer");
const firstBtn = [
  document.querySelector("#humanfirst"),
  document.querySelector("#comfirst"),
];
const playSound = new Audio("TAK.WAV");

let boardsize;
let playertype;
let firstplayer;
// 초기값 설정
init();
function init() {
  boardSizening();
  playertypes();
  firsttype();
  // board 사이즈 정하기
  boardSizeBtn.forEach((size) => {
    size.addEventListener("click", boardSizening);
  });
  // 상대 선수타입 정하기
  playerBtn.forEach((player) => {
    player.addEventListener("click", playertypes);
  });
  // 흑설정
  firstBtn.forEach((first) => {
    first.addEventListener("click", firsttype);
  });
}
// 흑백 정하기
function firsttype() {
  if (document.querySelector("#humanfirst").checked) firstplayer = "H";
  if (document.querySelector("#comfirst").checked) firstplayer = "C";
}
// 플레이어 타입 컴인지 사람인지
function playertypes() {
  if (document.querySelector("#human").checked) {
    playertype = "H";
    document.querySelector(".firstplayer").style.display = "none";
  }
  // 상대가 컴퓨터
  if (document.querySelector("#com").checked) {
    playertype = "C";
    document.querySelector(".firstplayer").style.display = "block";
  }
}

let omokGame = new Omok(boardsize, playertype, firstplayer);
omokGame.drawBoard(context);
// 사이즈 정하기
function boardSizening() {
  if (document.querySelector("#size15").checked) boardsize = 15;
  if (document.querySelector("#size19").checked) boardsize = 19;
}
startbtn.addEventListener("click", () => {
  // alert(
  //   `시작버튼 클릭=> 사이즈 : ${boardsize}, 상대선수 : ${playertype}, 흑 선수 : ${firstplayer}`
  // );
  let restartFlag = false;
  if (omokGame.getOrder() > 0) {
    if (confirm("게임 진행 중입니다. 다시 시작하겠습니까?")) {
      restartFlag = true;
    }
  } else {
    restartFlag = true;
  }
  if (restartFlag) {
    omokGame = new Omok(boardsize, playertype, firstplayer);

    omokGame.drawBoard(context);
    restartFlag = false;
  }
  canvas.addEventListener("click", (e) => {
    startOmok(e);
  });
  undobtn.addEventListener("click", undos);
});
// 착수
function startOmok(e) {
  let { omokX, omokY } = omokGame.getOmokPostiton(e.layerX, e.layerY);
  // alert(`클릭위치 => {${e.layerX}${e.layerY}} 오목 위치 : {${omokX}${omokY}}`);
  // 착수한거 저장
  if (omokX < 1 || omokX > boardsize || omokY < 1 || omokY > boardsize) {
    return;
  }
  omokGame.putStone(omokX, omokY);
  let pointinfo = omokGame.trun;
  // 오목판 그리기
  omokGame.drawStone(context, pointinfo);

  playSound.play();

  if (
    omokGame.omokFlag[1] ||
    omokGame.omokFlag[2] ||
    omokGame.omokFlag[3] ||
    omokGame.omokFlag[4]
  ) {
    setTimeout(() => {
      alert("오목!!! 다음 게임진행할려면 시작버튼을 눌러주세요!");
    });
    return;
  }
}

// 무르기
function undos() {
  // 현재 오목이면 return
  if (
    omokGame.omokFlag[1] ||
    omokGame.omokFlag[2] ||
    omokGame.omokFlag[3] ||
    omokGame.omokFlag[4]
  ) {
    return;
  }
  //무르기 처리
  omokGame.undoStone();
  // 오목판 그리기
  omokGame.drawBoard(context);
  // alert("무르기버튼 클릭!!");
}
