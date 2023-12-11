let profile_link = document.getElementById('profile-link');

if(!localStorage.getItem("UID")){
    profile_link.textContent = 'Войти';
}
else{
    profile_link.textContent = 'Профиль';
    profile_link.href = 'personal_account.html';

    let leave_account = document.createElement('p');
    leave_account.textContent = 'Выйти';
    leave_account.classList.add('leave-button');

    leave_account.addEventListener("click", function(e) {
        delete localStorage.UID;
        window.location.replace('index.html');
    }, false);


    profile_link.parentElement.appendChild(leave_account);
}