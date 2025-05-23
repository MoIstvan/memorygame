let delay = 5000; // ms? | 5000 - ((diff-1)*1000)
let diff = 1; // 1 ~ 3
let count, _clicked = null;
let misses = 0, pairs = 0;

const slider = document.getElementById("slider");
const span = document.getElementById("szoveg");
const start = document.getElementById("start");
const container = document.querySelector(".container");
const timer = document.getElementById("timer");
const buttons = [document.getElementById("ability2"), document.getElementById("ability1")];

let t = Date.now();
let timerid = 0;

slider.addEventListener("mouseup", ttype);
start.addEventListener("click", diff_set);
buttons[0].addEventListener("click", showAll);
buttons[1].addEventListener("click", joker);
document.body.onload = () => {ttype(0); buttons[0].disabled = true; buttons[1].disabled = true;};

let cards = [];

function handleClick(e)
{    
    if(e.target.tagName != "IMG") return;
    if(e.target.classList.contains("show")) return;

    show2(e.target);
    if(!_clicked) _clicked = e.target;
    else
    {
        if (_clicked.classList[0] === e.target.classList[0]) pairFound(e);
        else mistake(e);
    }
}

function mistake(e) {
    container.removeEventListener("click", handleClick);
    setTimeout(() => {
        _clicked.classList.remove("show");
        _clicked.classList.add("hide");
        e.target.classList.remove("show");
        e.target.classList.add("hide");
        _clicked = null;
        container.addEventListener("click", handleClick);
    }, 1500);
    misses++;
}

function pairFound(e) {
    container.removeEventListener("click", handleClick);
    setTimeout(() => {
        _clicked.hidden = true;
        e.target.hidden = true;
        _clicked = null;

        if (pairs === count / 2) {
            clearInterval(timerid);
            container.innerText = "Nyertél!";
            for (let i = 0; i < 2; i++) buttons[i].disabled = true;
        }
        else container.addEventListener("click", handleClick);
    }, 1500);
    pairs++;
}

function show2(element)
{
    element.classList.remove("hide");
    element.classList.add("show");
}

function ttype(_)
{
    if(slider.value == 1) span.innerText = "Könnyű";
    if(slider.value == 2) span.innerText = "Közepes";
    if(slider.value == 3) span.innerText = "Nehéz";
    diff = slider.value;
}

function diff_set(_)
{
    count = 6 + (slider.value * 6);
    startGame();
    delay = 5000 - (diff-1)*1000;
    setTimeout(() => {
        for(const i of container.children) i.children[0].classList.add("hide");

        container.addEventListener("click", handleClick);
        t = Date.now();
        timerid = setInterval(() => timer.innerText = `Hiba: ${misses} / Pár: ${pairs} / Idő: ${(Date.now() - t) / 1000} s`, 1);
        
        for (let i = 0; i < 2; i++) buttons[i].disabled = false;
    }, delay);
}

function startGame()
{
    misses = 0;
    pairs = 0;
    cards = [];
    const randseed = [];

    for (; randseed.length < count / 2;)
    {
        let j = Math.random() * 1000000
        if(!randseed.includes(j)) randseed.push(j);
    }

    createImages(randseed);
    shuffle(cards);
    show();
}

function createImages(randseed) {
    for (let i = 0; i < count / 2; i++) {
        const div = document.createElement("div");
        const img = document.createElement("img");
        img.src = `https://picsum.photos/seed/${randseed[i]}/200/300`;
        img.classList.add(`img${i}`);
        div.classList.add("card");
        div.appendChild(img);
        cards.push(div, div);
    }
}

function shuffle(a)
{
    for (let i = a.length - 1; i > 0; i--)
    {
        let j = Math.floor(Math.random() * (i+1));
        [a[i], a[j]] = [a[j], a[i]];
    }
}

function show()
{
    container.innerHTML = "";

    for (let i = 0; i < cards.length; i++)
        container.innerHTML += cards[i].outerHTML;
}

function showAll(_) {
    for (const e of container.children)
    {
        e.children[0].classList.remove("hide");
        e.children[0].classList.add("show");
    }

    setTimeout(() => {
        for (const e of container.children)
        {
            e.children[0].classList.remove("show");
            e.children[0].classList.add("hide");
        }
    }, delay);
    buttons[0].disabled = true;
}

function joker(_)
{
    let l = [];

    for (const element of container.children)
    {
        const c = element.children[0];
        if(!c.hidden && !l.includes(c.classList[0])) l.push(c.classList[0]);
    }

    let r = Math.floor(Math.random() * l.length);

    elems = document.getElementsByClassName(`img${r}`);

    for(let i = 0; i < 2; i++) show2(elems[i]);
    pairs++;

    buttons[1].disabled = true;

    setTimeout(() => {
        for(let i = 0; i < 2; i++) elems[i].hidden = true;
    }, 1500);
}