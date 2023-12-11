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

fetch('http://127.0.0.1:8000/api/get_news', {
    headers: {
       'Accept': 'application/json'
    }
    })
    .then(response => response.json())
    .then(text => {
        for(let i = 0; i < text['news'].length; i++){
            let news = text['news'][i];
            document.getElementById('news').innerHTML += `<div class="news" data-id="${news['id']}">
                        <div class="news-title">
                        ${news['name']}
                        </div>
                        <div class="news-desc">
                            ${news['description']}
                        </div>
                        <div class="news-bottom">
                            <p class="remove-news" onclick="remove_news(this)">Удалить</p>
                        </div>
                    </div>`;
        }
    });

function raise_creation_error(error){
    document.getElementById('news-error').textContent = error;

}

function remove_news(button){
    let news_id = button.parentNode.parentNode.dataset.id;

    fetch('http://127.0.0.1:8000/api/delete_news/' + news_id, {
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

function create_news(){
    let name = document.getElementById('news-name');
    let desc = document.getElementById('news-desc');

    if(!name.value){
        raise_creation_error("Заполните название новости")
        return
    }

    if(!desc.value){
        raise_creation_error("Заполните описание новости")
        return
    }


    fetch("http://127.0.0.1:8000/api/create_news", {
        method: "POST",
        body: JSON.stringify({
            "name": name.value,
            "description": desc.value
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())
    .then(text => {
        document.getElementById('news').innerHTML += `<div class="news" data-id="${text['id']}">
                        <div class="news-title">
                        ${text['name']}
                        </div>
                        <div class="news-desc">
                            ${text['description']}
                        </div>
                        <div class="news-bottom">
                            <p class="remove-news" onclick="remove_serive(this)">Удалить</p>
                        </div>
                    </div>`;
        close_modal_window();
    });
}