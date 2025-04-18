const tabla = document.getElementById("tabla");
const options = document.querySelectorAll("#szamok > option");

document.body.onload = statChange;

function statChange()
{
    let x = [];
    GetFromServer().then(data => {for(let o of data) x.push(o);});

    const object = JSON.parse(localStorage.getItem("game"));
    if(!object) return;

    newFunction(object, true);
}

document.getElementById("szamok").addEventListener("change", FunctionThatGetsTheNameOfTheOptionAndSendsAGetRequestToTheServerBasedOnIt);

function newFunction(object, parse = false)
{
    tabla.innerHTML = `<tr>
    <td>Email</td>
    <td>Age</td>
    <td>Difficulty</td>
    <td>Playtime</td>
    <td>Mistakes</td>
    <td>Created At</td></tr>`;

    let l = [];
    let x = [object[0]];
    for(let i = 1; i < object.length; i++)
    {
        let o = object[i];

        if(o.playtime == x[x.length - 1].playtime) x.push(o);
        else
        {
            l.push([...x]);
            x = [o];
        }
    }
    l.push([...x]);

    l.sort((a, b) => a[0].playtime - b[0].playtime);
    for(let i = 0; i < l.length; i++) l[i].sort((a, b) => a.mistakes - b.mistakes);

    l = l.flat();

    for (let o of l)
    {
        if(parse) o = JSON.parse(o);
        tabla.innerHTML += `<tr>
        <td>${o.email}</td>
        <td>${o.age}</td>
        <td>${o.chosen_level}</td>
        <td>${o.playtime}</td>
        <td>${o.mistakes}</td>
        <td>${o.created_at}</td></tr>`;
    }
}

async function FunctionThatGetsTheNameOfTheOptionAndSendsAGetRequestToTheServerBasedOnIt() // beszédes név, nem?
{
    let o = null;

    options.forEach((element) => {
        if(element.selected) o = element;
    });

    await fetch(`http://localhost/memory/index.php?level=${o.innerText}`)
    .then(response => response.json())
    .then(data => newFunction(data))
    .catch(error => console.error('Error:', error));
}

async function GetFromServer()
{
    const xhr = new XMLHttpRequest();
    let data = null, o = null;

    options.forEach((element) => {
        if(element.selected) o = element;
    });

    xhr.open("GET", `http://localhost/memory/index.php?level=${o.innerText}`, true);

    xhr.onerror = (e) => console.log(e);
    xhr.onloadend = (_) => data = JSON.parse(xhr.response);
    xhr.send();

    while(data === null) await new Promise(resolve => setTimeout(resolve, 100));

    return data;
}