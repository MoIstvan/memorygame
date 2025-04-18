const tabla = document.getElementById("tabla");
document.body.onload = statChange;

function statChange()
{
    tabla.innerHTML = `<tr>
    <td>Email</td>
    <td>Age</td>
    <td>Difficulty</td>
    <td>Playtime</td>
    <td>Mistakes</td>
    <td>Created At</td></tr>`;

    const object = JSON.parse(localStorage.getItem("game"));
    console.log(object);
    
    if(!object) return;
    for(let o of object)
    {
        o = JSON.parse(o);
        tabla.innerHTML += `<tr>
        <td>${o.email}</td>
        <td>${o.age}</td>
        <td>${o.chosen_level}</td>
        <td>${o.playtime}</td>
        <td>${o.mistakes}</td>
        <td>${o.created_at}</td></tr>`;
    }
}