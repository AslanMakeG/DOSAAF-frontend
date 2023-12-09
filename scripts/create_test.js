load_plugins_on_select();

let questions = document.getElementById('test-questions');
let question_counter = 0;

//Создание вопроса
function create_question(){
    let question_name = document.getElementById('question-name');
    let question_type = document.getElementById('question-type');

    let question = new LOAD_PLUGINS[question_type.value](question_name.value, MD5(new Date()));

    questions.appendChild(question.display_question()); //Добавляем вопрос на страницу

    close_modal_window(); //Закрываем модальное окно и сбрасываем значения в нём
    question_name.value = '';
    question_type.value = question_type.firstElementChild.value;
}

//Вывод ошибки при создании теста
function raise_creation_error(error){
    document.getElementById('create-test-error').textContent = error;
    setTimeout(() => {document.getElementById('create-test-error').textContent = '';}, 5000);
    return;
}

//Создать тест (json)
function create_test(){
    try{
        let test_name = document.getElementById('test-name-input').value;
        
        //Проверка на пустоту имени теста
        if(!test_name){
            throw new Error('Заполните название теста');
        }

        let test_json = {
            'name' : test_name,
            'questions' : []
        };

        let questions = document.getElementsByClassName('question');
        //Проверка на отсутствие вопросов в тесте
        if(questions.length == 0){
            throw new Error('Создайте хотя бы один вопрос');
        }

        Array.from(questions).forEach((question) => {
            let name = question.children[0].children[1].value; //Получаем имя вопроса
            let question_type = question.dataset.type; //Получаем тип вопроса

            let question_json = {
                'name': name,
                'type': question_type,
                'answers': [],
                'right_answer': []
            }

            //Проверка на пустоту имени вопроса
            if(!name){
                throw new Error('Заполните все названия вопросов');
            }

            let saved_answers = LOAD_PLUGINS[question_type].save_answers(question);

            question_json['answers'] = saved_answers['all_answers'];
            question_json['right_answer'] = saved_answers['right_answers'];

            test_json['questions'].push(question_json); //Записываем вопрос в массив вопросов
        });
        
        post_test_on_server(test_json);
    }
    catch(e){
        raise_creation_error(e.message);
    }
}

function post_test_on_server(test){
    fetch("http://127.0.0.1:8000/api/create_test", {
        method: "POST",
        body: JSON.stringify(test),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then((response) => {
        if(response['status'] == 200){
            window.location.replace('list_of_tests.html');
        }
    });
}