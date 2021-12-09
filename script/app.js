const apiUrlRandomLinecount = "https://poetrydb.org/linecount,random/",
    apiUrlRandom = "https://poetrydb.org/random/1",
    apiUrl = "https://poetrydb.org/title/";

const appEl = document.querySelector('#app'),
    titleEl = document.querySelector('#poem-title'),
    linesEl = document.querySelector('#poem-lines'),
    footerEl = document.querySelector('#poem-footer'),
    randomButtonEl = document.querySelector('#random-button'),
    toggleSettingsButtonEl = document.querySelectorAll(".js-toggle-settings"),
    loaderEl = document.querySelector('#loader'),
    poemEl = document.querySelector('#poem'),
    settingsForm = document.querySelector('#appSettingsForm'),
    randomLinecountSettingEl = document.querySelector("#controlRandomLinecount"),
    maxLinecountSettingEl = document.querySelector('#maxLinecountSetting'),
    maxLinecountEl = document.querySelector('#maxLinecount'),
    maxLinecountOutputEl = document.querySelector('#maxLinecountOutput');

let storedTitle = "";
let linecountMin = 2;
let linecountMax = 0;
let linecount = 0;

let randomLinecount = true;

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function getStoredPoem(url) {
    url = apiUrl + storedTitle;

    // Storing response
    const response = await fetch(
        url
    );

    // Storing data in form of JSON
    var data = await response.json();

    if (response) {
        show(data);
    } else {
        console.log('something bad happened')
    }
}

async function getRandomPoem(url) {
    if (randomLinecount == false) {
        url = apiUrlRandom;
    }
    else {
        url = apiUrlRandomLinecount + linecount + ";1";
    }

    // Storing response
    const response = await fetch(
        url
    );

    // Storing data in form of JSON
    var data = await response.json();

    if (response) {
        show(data);
    } else {
        console.log('something bad happened')
    }
}

function hideloader() {
    appEl.classList.remove('is-starting', 'is-loading');
    // appEl.scrollTop = 0;
    window.scrollTo(0, 0);
}

function showloader() {
    appEl.classList.add('is-loading');
}

function show(data) {
    setTimeout(function () {
        let { title, lines, author } = data[0];

        originalTitle = title;
        title = title.replaceAll("--", "—");
        titleEl.textContent = title;

        linesEl.textContent = "";

        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].replaceAll("--", "—");
            linesEl.innerHTML += lines[i] + '<br>';
        }

        footerEl.textContent = author;

        hideloader();

        localStorage.setItem("storedTitle", JSON.stringify(originalTitle));
    }, 1500);
}

function getStoredTitle() {
    if (localStorage.getItem("storedTitle")) {
        storedTitle = JSON.parse(localStorage.getItem("storedTitle"));
    } else {
        return storedTitle;
    }
}

function toggleSettings() {
    for (let i = 0; i < toggleSettingsButtonEl.length; i++) {
        toggleSettingsButtonEl[i].addEventListener("click", function () {
            appEl.classList.toggle("show-settings");
        })
    }
}

function setLineCount() {
    maxLinecountOutputEl.value = maxLinecountEl.value;
    linecountMax = parseInt(maxLinecountEl.value);
    linecount = randomIntFromInterval(linecountMin, linecountMax);
}

function checkRandomLinecountSetting() {
    if (randomLinecountSettingEl.checked) {
        randomLinecount = true;
        maxLinecountEl.disabled = false;
        maxLinecountSettingEl.classList.remove('is-disabled');
    } else {
        randomLinecount = false;
        maxLinecountEl.disabled = true;
        maxLinecountSettingEl.classList.add('is-disabled');
    }
}


document.addEventListener('DOMContentLoaded', function () {
    checkRandomLinecountSetting();
    toggleSettings();
    setLineCount();
    getStoredTitle();
    if (storedTitle === "") {
        getRandomPoem();
    } else {
        getStoredPoem();
    }
});

randomButtonEl.addEventListener('click', function () {
    setLineCount();
    showloader();
    getRandomPoem();
});

settingsForm.addEventListener('input', function () {
    checkRandomLinecountSetting();
    setLineCount();
});

/* install pwa stuff here */

const divInstall = document.getElementById('installContainer');
const butInstall = document.getElementById('butInstall');

/* Put code here */

/* Only register a service worker if it's supported */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/script/service-worker.js');
}

/**
 * Warn the page must be served over HTTPS
 * The `beforeinstallprompt` event won't fire if the page is served over HTTP.
 * Installability requires a service worker with a fetch event handler, and
 * if the page isn't served over HTTPS, the service worker won't load.
 */
if (window.location.protocol === 'http:') {
    const requireHTTPS = document.getElementById('requireHTTPS');
    const link = requireHTTPS.querySelector('a');
    link.href = window.location.href.replace('http://', 'https://');
    requireHTTPS.classList.remove('hidden');
}