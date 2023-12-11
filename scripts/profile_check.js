let profile_link = document.getElementById('profile-link');

if(!localStorage.getItem("UID")){
    profile_link.textContent = 'Войти';
    profile_link.href = 'auth.html';
}
else{
    profile_link.textContent = 'Профиль';
    profile_link.href = 'personal_account.html';

    let leave_account = document.createElement('div');
    leave_account.textContent = 'Выйти';
    leave_account.classList.add('leave-button');

    leave_account.onclick = function(){
        delete localStorage.UID;
        window.location.replace('index.html');
    }

    profile_link.parentElement.appendChild(leave_account);
}