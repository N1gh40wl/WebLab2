async function show() {
    let url = "http://127.0.0.1:8000/books";
    let response = await fetch(url);

    if (response.ok){
        let json = await response.text();

        var txt = JSON.parse(json);

        var  holder = document.getElementById("TableHolder");
        var table = document.createElement("table");
        var tr_main = document.createElement("tr");
        var th_number =document.createElement("th");
        th_number.innerHTML = "<a>Номер</a>";
        var th_id_main=document.createElement("th");
        th_id_main.innerHTML = "<a>ID</a>";
        var th_title_main =document.createElement("th");
        var temp =document.createElement("th");
        th_title_main.innerHTML = "<a>Название</a>";
        tr_main.appendChild(th_number);
        tr_main.appendChild(th_id_main);
        tr_main.appendChild(th_title_main);
        tr_main.appendChild(temp);
        table.appendChild(tr_main);
        holder.appendChild(table);
        for (var i = 0 ; i<txt.Books.length;i++){
            var name_id = document.createElement("a");
            name_id.text=i;
            var tr = document.createElement("tr");
            var a_id = document.createElement("a");
            a_id.text=txt.Books[i].id;
            a_id.id= "id:"+txt.Books[i].id;
            var a_title = document.createElement("a");
            a_title.text=txt.Books[i].title;
            a_title.id = "title" + txt.Books[i].id;
            var delete_button = document.createElement("div")
            let id = txt.Books[i].id;
            delete_button.innerHTML = "<button onclick=\"Delete_Book(id)\" id=\""+ i +" \" >Удалить</button><button onclick=\"Show_Element_Page(id)\" id=\""+ i +" \" >Посмотреть</button>";

            var  th_id = document.createElement("th");
            var  th_title = document.createElement("th");
            var  th_name_id = document.createElement("th");
            var  th_title_id = document.createElement("th");
            var  th_delete_button = document.createElement("th");
            th_delete_button.appendChild(delete_button);
            th_name_id.appendChild(name_id);

            th_id.appendChild(a_id);
            th_title.appendChild(a_title);
            tr.appendChild(th_name_id);
            tr.appendChild(th_id);
            tr.appendChild(th_title);
            tr.appendChild(th_delete_button);
            table.appendChild(tr);
        }
    } else {
        alert("Ошибка HTTP: " + response.status + " Введите корректные данные");
    }

}

let  id_t ;
let id_true;
function Show_Element_Page(id) {
    location.replace("./ShowBook.html");
    localStorage.setItem("Value",id);
}





async function Show_Element() {
    if(localStorage.getItem("Value")){
        id_t =localStorage.getItem("Value");
    }

    let url = "http://127.0.0.1:8000/books/"+id_t;

    let response = await fetch(url);
    if (response.ok) {
        let json = await response.text();

        var txt = JSON.parse(json);
        localStorage.setItem("Valueid",txt.id);
        document.getElementById("title_name").value = txt.title;
        document.getElementById("author_firstname").value = txt.author.firstname;
        document.getElementById("author_lastname").value = txt.author.lastname;
    }

}

function Change_But(){
    let title = document.getElementById("title_name").value.toString();
    let firstname = document.getElementById("author_firstname").value.toString();
    let lastname = document.getElementById("author_lastname").value.toString();
    function reqReadyStateChange() {
        if (request.readyState == 4 && request.status == 200)
            document.getElementById("output").innerHTML=request.responseText;
    }

    let book = {
        id : localStorage.getItem("Valueid"),
        title: title,
        author: {
            firstname: firstname ,
            lastname: lastname
        }
    };
    let json = JSON.stringify(book);


    var request = new XMLHttpRequest();
    function reqReadyStateChange() {
        if (request.readyState == 4 && request.status == 200)
            document.getElementById("output").innerHTML=request.responseText;
    }




    request.open("PUT", "http://127.0.0.1:8000/books/"+id_t,false);
    request.setRequestHeader( "Content-Type", "application/json");
    request.onreadystatechange = function() {//Вызывает функцию при смене состояния.
        if(request.readyState == XMLHttpRequest.DONE && request.status == 200) {

        }
    }

    request.send(json);

    location.replace("./home.html")
}

async function Delete_Book(id) {

    let url = "http://127.0.0.1:8000/books";
    let response = await fetch(url);


    if (response.ok) {
        let json = await response.text();

        var txt = JSON.parse(json);

    }
    let normal_id = Number(id) ;
    let title = txt.Books[normal_id].title;
    let firstname = txt.Books[normal_id].author.firstname;
    let lastname = txt.Books[normal_id].author.lastname;
    let r_id = txt.Books[normal_id].id;



    let book = {
        id: r_id,
        title: title,
        author: {
            firstname: firstname,
            lastname: lastname
        }
    };
    let json = JSON.stringify(book);



    var request = new XMLHttpRequest();

    function reqReadyStateChange() {
        if (request.readyState == 4 && request.status == 200)
            document.getElementById("output").innerHTML = request.responseText;
    }






    request.open("DELETE", "http://127.0.0.1:8000/books/"+id, false);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function () {//Вызывает функцию при смене состояния.
        if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {

        }
    }

    request.send(json);
    location.reload();
}

function GoTo_AddWeb (){
    location.replace("./AddBook.html");
}




function Add_But(){

    let title = document.getElementById("title_name").value.toString();
    let firstname = document.getElementById("author_firstname").value.toString();
    let lastname = document.getElementById("author_lastname").value.toString();
    function reqReadyStateChange() {
        if (request.readyState == 4 && request.status == 200)
            document.getElementById("output").innerHTML=request.responseText;
    }

    let book = {

        title: title,
        author: {
            firstname: firstname ,
            lastname: lastname
        }
    };
    let json = JSON.stringify(book);


    var request = new XMLHttpRequest();
    function reqReadyStateChange() {
        if (request.readyState == 4 && request.status == 200)
            document.getElementById("output").innerHTML=request.responseText;
    }


    request.open("POST", "http://127.0.0.1:8000/books",false);
    request.setRequestHeader( "Content-Type", "application/json");
    request.onreadystatechange = function() {//Вызывает функцию при смене состояния.
        if(request.readyState == XMLHttpRequest.DONE && request.status == 200) {

        }
    }

    request.send(json);

    location.replace("./home.html")
}