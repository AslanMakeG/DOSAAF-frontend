let user_id = localStorage.getItem("UID");

if(!user_id){
   window.location.replace('auth.html');
}
else{
   fetch('http://127.0.0.1:8000/api/get_user_type/'+ user_id, {
   headers: {
      'Accept': 'application/json'
   }
   })
   .then(response => response.json())
   .then(text => {
      if(text['type'] !== 'admin'){
        window.location.replace('auth.html');
      }
   });
}

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
                        <div class="service-title">
                        ${service['name']}
                        </div>
                        <div class="service-desc">
                            ${service['description']}
                        </div>
                        <div class="service-bottom">
                            <div class="service-cost">
                                Цена: ${service['cost']} руб.
                            </div>
                            <p class="remove-service" onclick="remove_serive(this)">Удалить</p>
                        </div>
                    </div>`;
        }
    });

function raise_creation_error(error){
    document.getElementById('service-error').textContent = error;

}

function remove_serive(button){
    let service_id = button.parentNode.parentNode.dataset.id;

    fetch('http://127.0.0.1:8000/api/delete_service/' + service_id, {
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if(response['status'] == 200){
            button.parentNode.parentNode.parentNode.removeChild(button.parentNode.parentNode);
        }
    });
}

function create_service(){
    let name = document.getElementById('service-name');
    let desc = document.getElementById('service-desc');
    let cost = document.getElementById('service-cost');

    if(!name.value){
        raise_creation_error("Заполните название услуги")
        return
    }

    if(!cost.value){
        raise_creation_error("Заполните стоимость услуги")
        return
    }

    fetch("http://127.0.0.1:8000/api/create_service", {
        method: "POST",
        body: JSON.stringify({
            "name": name.value,
            "description": desc.value,
            "cost": cost.value
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())
    .then(text => {
        document.getElementById('services').innerHTML += `<div class="service" data-id="${text['id']}">
                        <div class="service-title">
                        ${text['name']}
                        </div>
                        <div class="service-desc">
                            ${text['description']}
                        </div>
                        <div class="service-bottom">
                            <div class="service-cost">
                                Цена: ${text['cost']} руб.
                            </div>
                            <p class="remove-service" onclick="remove_serive(this)">Удалить</p>
                        </div>
                    </div>`;
        close_modal_window();
    });
}