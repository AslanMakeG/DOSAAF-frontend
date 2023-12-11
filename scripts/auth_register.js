if(localStorage.getItem("UID")){
    window.location.replace('index.html');
}

let auth_button = document.getElementById('auth-button');
let register_button = document.getElementById('register-button');

let auth_form = document.getElementById('auth-form');
let register_form = document.getElementById('register-form');

function change_form_to_auth(){
    auth_button.classList.add('active-button');
    register_button.classList.remove('active-button');
    auth_form.classList.remove('closed-form');
    register_form.classList.add('closed-form');
}

function change_form_to_register(){
    auth_button.classList.remove('active-button');
    register_button.classList.add('active-button');
    auth_form.classList.add('closed-form');
    register_form.classList.remove('closed-form');
}

function raise_register_error(error){
    document.getElementById('register-error').textContent = error;
}

function raise_auth_error(error){
    document.getElementById('auth-error').textContent = error;
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function register_user(){
    let name = document.getElementById('register-name');
    let surname = document.getElementById('register-surname');
    let patronymic = document.getElementById('register-patronymic');
    let email = document.getElementById('register-email');
    let password = document.getElementById('register-password');
    let repeat_password = document.getElementById('register-repeat-password');
    
    if(!surname.value){
        raise_register_error('Заполните фамилию')
        return;
    }

    if(!name.value){
        raise_register_error('Заполните имя')
        return;
    }

    if(!email.value){
        raise_register_error('Заполните Email')
        return;
    }

    if(!validateEmail(email.value)){
        raise_register_error('Email указан в неверном формате')
        return;
    }

    if(!password.value){
        raise_register_error('Заполните пароль')
        return;
    }

    if(!repeat_password.value){
        raise_register_error('Повторите пароль')
        return;
    }

    if(password.value !== repeat_password.value){
        raise_register_error('Пароли не совпадают')
        return;
    }

    fetch("http://127.0.0.1:8000/api/register_user", {
        method: "POST",
        body: JSON.stringify({
            "name": name.value,
            "surname": surname.value,
            "patronymic": patronymic.value,
            "email": email.value,
            "password": password.value
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then((response) =>  response.json())
    .then(text => 
        {
            if(text['status'] == 400){
                raise_register_error(text['error']);
            }
            else if(text['status'] == 200){
                change_form_to_auth();
                name.value = "";
                surname.value = "";
                patronymic.value = "";
                email.value = "";
                password.value = "";
            }
        }
    );
}

function auth_user(){
    let email = document.getElementById('auth-email');
    let password = document.getElementById('auth-password');
    

    if(!email.value){
        raise_auth_error('Заполните Email')
        return;
    }

    if(!password.value){
        raise_auth_error('Заполните пароль')
        return;
    }

    fetch("http://127.0.0.1:8000/api/auth_user/" + email.value + "/" + password.value, {
        headers: {
            'Accept': 'application/json'
        }
    })
    .then((response) =>  response.json())
    .then(text => 
        {
            if(text['status'] == 400){
                raise_auth_error(text['error']);
            }
            else if(text['status'] == 200){
                localStorage.setItem('UID', text['user_id']);
                window.location.replace('personal_account.html');
            }
        }
    );
}