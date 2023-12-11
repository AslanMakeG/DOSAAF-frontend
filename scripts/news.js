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
                                                        <div class="news-left">
                                                            <div class="news-title">${news['name']}</div>
                                                            <div class="news-desc">${news['description'].slice(0, 100) + "..."}</div>
                                                            <div class="news-about">
                                                                Узнать больше
                                                            </div>
                                                        </div>
                                                        <div class="news-right">
                                                            <img src="images/news_image.png">
                                                        </div>
                                                    </div>`;
    }
});