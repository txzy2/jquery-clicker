import { switchTheme, createTapAnimation } from './subfunc/func.js';
import './subfunc/type.js';

let coinz = 0;
let stateTap = 1;
let stateAutoTap = false;
let upgradeAutoTap = 0;
let upgradeState = 0;
let taps = 0;
let autoTapInterval;

const colors = ['#7DA58D', '#60718C', '#BF748E', '#F7C9B5', '#C49766'];

const rewards = {
  50: 25,
  100: 50,
  200: 100,
  500: 250,
  1000: 1000,
  2000: 1000,
  3000: 1500,
  4000: 2000,
  5000: 5000,
  6000: 3000,
  7000: 3500,
  8000: 4000,
  9000: 4500,
  10000: 10000,
};

//NOTE: Save and Load user game stats
const saveGameState = () => {
  const gameState = {
    coinz: coinz,
    stateTap: stateTap,
    stateAutoTap: stateAutoTap,
    upgradeAutoTap: upgradeAutoTap,
    upgradeState: upgradeState,
    taps: taps,
  };
  localStorage.setItem('gameState', JSON.stringify(gameState));
};

const loadGameState = () => {
  const savedGameState = localStorage.getItem('gameState');
  if (savedGameState) {
    const gameState = JSON.parse(savedGameState);
    coinz = gameState.coinz;
    stateTap = gameState.stateTap;
    stateAutoTap = gameState.stateAutoTap;
    upgradeAutoTap = gameState.upgradeAutoTap;
    upgradeState = gameState.upgradeState;
    taps = gameState.taps;

    $('#count').text(coinz);
    $('#allTaps').text(taps);
    $('#byTap').text(stateTap);
    $('#autoTap').text(stateAutoTap ? '✅' : '❌');
    $('#perAutoTap').text(upgradeAutoTap);
    $('#nextUpgrade').text(stateTap * 10);
    $('#nextUpgradeAuto').text((upgradeAutoTap + 1) * 1000);

    if (stateAutoTap) {
      window.autoTap();
    }
  }
};

// NOTE: Back animation
window.changeBg = () => {
  switchTheme();
};

//NOTE: Reward notification
function reward(taps) {
  return rewards[taps] || 0;
}

function showNotification(message) {
  $('#notificationText').text(message);

  $('.notification').addClass('show');

  setTimeout(function() {
    $('.notification').removeClass('show');
  }, 2000);
}

window.clickBtn = () => {
  $('.cliker__btn').toggleClass('active');

  coinz += stateTap;

  taps++;
  $('#count').text(coinz);
  $('#count').css('color', colors[Math.floor(Math.random() * colors.length)]);
  $('#allTaps').text(taps);

  $('.error').text('').removeClass('show');

  if (taps === 1) {
    coinz += 100;
    showNotification(`Hi! Let's farm! Some gift for you :)`);
  }

  let rewardAmount = reward(taps);
  if (rewardAmount) {
    coinz += rewardAmount;

    showNotification(`Gratz! You received ${rewardAmount} Coinz as a reward.`);
  }

  createTapAnimation(colors);
  saveGameState();
};

// NOTE: AutoTap logic
window.autoTap = () => {
  if (stateAutoTap && !autoTapInterval) {
    autoTapInterval = setInterval(() => {
      coinz += upgradeAutoTap;
      taps++;
      $('#count').text(coinz);
      $('#count').css(
        'color',
        colors[Math.floor(Math.random() * colors.length)],
      );
      $('#allTaps').text(taps);

      createTapAnimation(colors);
      saveGameState();
    }, 3000);
  } else if (!stateAutoTap && autoTapInterval) {
    clearInterval(autoTapInterval);
    autoTapInterval = null;
  }
};

window.upgradeAutoTap = () => {
  upgradeAutoTap++;
  let check = upgradeAutoTap * 1000;

  if (coinz >= check) {
    stateAutoTap = true;
    coinz -= check;

    $('#count').text(coinz);
    $('#autoTap').text('✅');
    $('#perAutoTap').text(upgradeAutoTap);
    $('#nextUpgradeAuto').text((upgradeAutoTap + 1) * 1000);

    window.autoTap();
    saveGameState();
  } else {
    upgradeAutoTap--;
    $('.error').text(`No Coinz for upgrade. Tap harder! ;)`).addClass('show');
  }
};

window.upgradeTap = () => {
  upgradeState++;
  let check = upgradeState * 10;

  if (coinz >= check) {
    stateTap++;
    coinz -= check;

    $('#count').text(coinz);
    $('#byTap').text(stateTap);
    $('#nextUpgrade').text(stateTap * 10);

    saveGameState();
  } else {
    upgradeState--;
    $('.error').text(`No Coinz for upgrade. Tap harder! ;)`).addClass('show');
  }
};

$('#nextUpgrade').text(stateTap * 10);
$('#nextUpgradeAuto').text(1000);
$('#byTap').text(stateTap);
$('#autoTap').text(stateAutoTap ? '✅' : '❌');

$(document).ready(() => {
  console.log(
    'This is my jQuery clicker project' + '\n' + 'Created by Anton Kamaev',
  );

  loadGameState();

  lucide.createIcons();

  $('#modal').on('click', function(event) {
    if ($(event.target).is('#modal')) {
      $(this).removeClass('modal__open');
    }
  });
});
