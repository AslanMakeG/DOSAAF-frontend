fetch('http://127.0.0.1:8000/api/get_services', {
headers: {
   'Accept': 'application/json'
}
})
.then(response => response.json())
.then(text => {
    for(let i = 0; i < text['services'].length; i++){
        let service = text['services'][i];
        document.getElementById('services').innerHTML += `<div class="service" data-id="${service['id']}">
                                                            <div class="service-left">
                                                                <div class="service-title">${service['name']}</div>
                                                                <div class="service-cost">Цена: ${service['cost']} руб.</div>
                                                                <div class="service-request" onclick="check_user(this)">Подать заявку</div>
                                                            </div>
                                                            <div class="service-right">
                                                                <div class="service-desc-title">Описание услуги</div>
                                                                <div class="service-desc">${service['description']}</div>
                                                            </div>
                                                        </div>`;
    }
});

let name = document.getElementById('service-modal-name');
let surname = document.getElementById('service-modal-surname');
let patronymic = document.getElementById('service-modal-patronymic');
let email = document.getElementById('service-modal-email');
let phone_number = document.getElementById('service-modal-phone');

let chosen_service = '';

function check_user(button){
    open_modal_window();
    chosen_service = button.parentNode.parentNode.dataset.id;
    if(localStorage.getItem("UID")){
        fetch('http://127.0.0.1:8000/api/get_user_info/' + localStorage.getItem("UID"), {
        headers: {
        'Accept': 'application/json'
        }
        })
        .then(response => response.json())
        .then(text => {
            name.value = text['name'];
            surname.value = text['surname'];
            patronymic.value = text['patronymic'];
            email.value = text['email'];
        });
    }
}

function raise_creation_error(error){
    document.getElementById('modal-error').textContent = error;
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validate_phone_nubmer(phone) {
    var re = /^[\d\+][\d\(\)\ -]{4,14}\d$/;
    return re.test(phone);
}

function create_service(){
    if(!name.value){
        raise_creation_error("Заполните имя")
        return
    }

    if(!surname.value){
        raise_creation_error("Заполните фамилию")
        return
    }

    if(!patronymic.value){
        raise_creation_error("Заполните отчество")
        return
    }

    if(!email.value){
        raise_creation_error("Заполните email")
        return
    }

    if(!validateEmail(email.value)){
        raise_creation_error('Email указан в неверном формате')
        return;
    }

    if(!phone_number.value){
        raise_creation_error("Заполните телефон")
        return
    }

    if(!validate_phone_nubmer(phone_number.value)){
        raise_creation_error('Телефон указан в неверном формате')
        return;
    }

    fetch("http://127.0.0.1:8000/api/create_request", {
        method: "POST",
        body: JSON.stringify({
            "id_user": localStorage.getItem("UID") ? localStorage.getItem("UID") : "",
            "id_service": chosen_service,
            "user_fullname": name.value + " " + surname.value + " " + patronymic.value,
            "phone_number": phone_number.value
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => {
        if(response['status'] == 200){
            close_modal_window();
        }
    });
}