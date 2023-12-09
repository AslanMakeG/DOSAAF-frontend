let select = document.getElementById('question-type');
let load_plugins = {};

for(let i = 0; i < PLUGINS.length; i++){
    let plugin = new PLUGINS[i]; //Создание экзмепляра каждого класса
    load_plugins[plugin.get_question_type()] = PLUGINS[i]; //Словарь (ключ - тип вопроса, значение - класс)
    select.innerHTML += `<option value="${plugin.get_question_type()}">${plugin.get_question_type_name()}</option>` //Заполнение выпадающего списка
}