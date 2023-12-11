let user_id = localStorage.getItem("UID");

let user_FIO = document.getElementById("user-info-FIO");
let user_email = document.getElementById("user-info-email");

let user_type = 'user'

fetch("http://127.0.0.1:8000/api/get_user_info/" + user_id, {
    headers: {
        'Accept': 'application/json'
    }
})
.then((response) =>  response.json())
.then(text => 
    {
        user_FIO.textContent = `ФИО: ${text['name']} ${text['surname']} ${text['patronymic']}`
        user_email.textContent = `Email: ${text['email']}`

        if(text['type'] === 'admin'){
            document.body.innerHTML += `<div class="admin-panel">
                                            <h2>Панель администратора</h2>
                                            <div class="admin-panel-body">
                                            <a class="admin-panel-link" href="services_admin.html"><div class="admin-panel-item">Услуги</div></a>
                                                <div class="admin-panel-item">Новости</div>
                                                <a class="admin-panel-link" href="list_of_tests.html"><div class="admin-panel-item">Тесты</div></a>
                                                <div class="admin-panel-item">Заявки</div>
                                            </div>
                                        </div>`
        }
        else if(text['type'] === 'user'){
            document.body.innerHTML += `Желаете пройти тест? Пройдите`
        }
    }
);