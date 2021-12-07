const apiUrlRandomLinecount = "https://poetrydb.org/linecount,random/";
const apiUrlRandom = "https://poetrydb.org/random/1";

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

let linecountMin = 2;
let linecountMax = 0;
let linecount = 0;

let randomLinecount = true;

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function getapi(url) {
    if (randomLinecount == false) {
        url = apiUrlRandom;
    } else {
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

        title = title.replaceAll("--", "—");
        titleEl.textContent = title;

        linesEl.textContent = "";

        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].replaceAll("--", "—");
            linesEl.innerHTML += lines[i] + '<br>';
        }

        footerEl.textContent = author;

        hideloader();
    }, 1500);
}

randomButtonEl.addEventListener('click', function () {
    setLineCount();
    showloader();
    getapi();
});

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
        // maxLinecountEl.setAttribute("disabled", false);
        maxLinecountEl.disabled = false;
        maxLinecountSettingEl.classList.remove('is-disabled');
    } else {
        randomLinecount = false;
        // maxLinecountEl.setAttribute("disabled", true);
        maxLinecountEl.disabled = true;
        maxLinecountSettingEl.classList.add('is-disabled');
    }
}

settingsForm.addEventListener('input', function () {
    checkRandomLinecountSetting();
    setLineCount();
});

document.addEventListener('DOMContentLoaded', function () {
    checkRandomLinecountSetting();
    toggleSettings();
    setLineCount();
    getapi();
});