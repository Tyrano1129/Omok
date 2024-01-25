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
let interval;
let cnt = 0;
// 초기값 설정
init();
function init() {
  boardSizening();
  // playertypes();
  // firsttype();
  // board 사이즈 정하기
  boardSizeBtn.forEach((size) => {
    size.addEventListener("click", boardSizening);
  });
  // 상대 선수타입 정하기
  // playerBtn.forEach((player) => {
  //   player.addEventListener("click", playertypes);
  // });
  // 흑설정
  // firstBtn.forEach((first) => {
  //   first.addEventListener("click", firsttype);
  // });
}
// 흑백 정하기
// function firsttype() {
//   if (document.querySelector("#humanfirst").checked) firstplayer = "H";
//   if (document.querySelector("#comfirst").checked) firstplayer = "C";
// }
// 플레이어 타입 컴인지 사람인지
function playertypes() {
  // if (document.querySelector("#human").checked) {
  //   playertype = "H";
  //   document.querySelector(".firstplayer").style.display = "none";
  // }
  // 상대가 컴퓨터
  // if (document.querySelector("#com").checked) {
  //   playertype = "C";
  //   document.querySelector(".firstplayer").style.display = "block";
  // }
}
let omokGame = null;
// 사이즈 정하기
function boardSizening() {
  if (document.querySelector("#size15").checked) boardsize = 15;
  if (document.querySelector("#size19").checked) boardsize = 19;
}
startbtn.addEventListener("click", () => {
  startbtn.style.display = "none";
  omokGame = new Omok(boardsize, playertype, firstplayer);
  omokGame.drawBoard(context);
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
  canvas.addEventListener("click", canvasEvant);
  // undobtn.addEventListener("click", undos);
});
function canvasEvant() {
  startOmok(event);
  timeOut();
  document.querySelector(".timer").innerHTML = `착수 남은시간 : ${cnt--}`;
}
// 타임아웃 첫수가 진행해야 시작
function timeOut() {
  cnt = 30;
  clearInterval(interval);
  // 30초 지나면 다음플레이어에게 넘기기
  interval = setInterval(() => {
    if (cnt <= 0) {
      if (omokGame.getOrder() > 0) {
        omokGame.trun.color =
          omokGame.trun.color == "black" ? "white" : "black";
      }
      cnt = 30;
    }
    document.querySelector(".timer").innerHTML = `착수 남은시간 : ${cnt--}`;
  }, 1000);
}
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
      let color = pointinfo.color == "black" ? "흑" : "흰";
      clearInterval(interval);
      // undobtn.removeEventListener("click", undos);
      canvas.removeEventListener("click", canvasEvant);
      alert(`${color}승리! 다시하고싶으면 게임 재시작을 눌러주세요!`);
      startbtn.style.display = "block";
    }, 10);
    return;
  }
}

// 무르기
// function undos() {
//   // 현재 오목이면 return
//   if (
//     omokGame.omokFlag[1] ||
//     omokGame.omokFlag[2] ||
//     omokGame.omokFlag[3] ||
//     omokGame.omokFlag[4]
//   ) {
//     return;
//   }
//   //무르기 처리
//   omokGame.undoStone();
//   // 오목판 그리기
//   omokGame.drawBoard(context);
//   // alert("무르기버튼 클릭!!");
// }
