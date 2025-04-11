let delay = 5000; // ms? | 5000 - ((diff-1)*1000)
let diff = 1; // 1 ~ 3
let count, _clicked = null;
let misses = 0, pairs = 0;

const slider = document.getElementById("slider");
const span = document.getElementById("szoveg");
const start = document.getElementById("start");
const container = document.querySelector(".container");
const timer = document.getElementById("timer");
const buttons = [document.getElementById("ability1"), document.getElementById("ability2")];

let t = Date.now();
let timerid = 0;

slider.addEventListener("mouseup", ttype);
start.addEventListener("click", diff_set);
document.body.onload = ttype;

let cards = [];

function handleClick(e)
{    
    if(e.target.tagName != "IMG") return;
    if(e.target.classList.contains("show")) return;

    show2(e.target);
    if(!_clicked) _clicked = e.target;
    else
    {
        if (_clicked.classList[0] === e.target.classList[0])
        {
            container.removeEventListener("click", handleClick);
            setTimeout(() => {
                _clicked.hidden = true;
                e.target.hidden = true;
                _clicked = null;

                if(pairs === count / 2)
                {
                    clearInterval(timerid);
                    container.innerText = "Nyertél!";
                    for(const b of buttons) b.disabled = true;
                }
                else container.addEventListener("click", handleClick);
            }, 1500);
            pairs++;
        }
        else
        {
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
    }
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
        for(const b of buttons) b.disabled = false;
    }, delay);
}

function startGame()
{
    misses = 0;
    pairs = 0;
    cards = [];
    const randseed = [];

    for (; randseed.length < count / 2;) {
        let j = Math.random() * 1000000
        if(!randseed.includes(j)) randseed.push(j);
    }
    
    for (let i = 0; i < count / 2; i++)
    {
        const div = document.createElement("div");
        const img = document.createElement("img");
        img.src = `https://picsum.photos/seed/${randseed[i]}/200/300`;
        img.classList.add(`img${i}`);
        div.classList.add("card");
        div.appendChild(img);
        cards.push(div, div);
    }
    shuffle(cards);
    show();
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
    for (let i = 0; i < cards.length; i++) {
        container.innerHTML += cards[i].outerHTML;
    }
}