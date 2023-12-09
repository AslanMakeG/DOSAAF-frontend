class BaseQuestion{

    //Создание верхушки вопроса (где вводится имя вопроса)
    create_question_top(){
        let top = document.createElement('div');
        top.classList.add('question-top');
        top.innerHTML = this.question_top_code;
        return top;
    }

    //Создание самого вопроса (где добавляются варианты ответов)
    create_question_body(code, addable_code){
        let body = document.createElement('div');
        body.classList.add('question-body');
        body.innerHTML = code;
        
        //Если к вопросу можно добавить вариант ответа
        if(addable_code){
            let add_button = document.createElement('p');
            add_button.classList.add('text-button');
            add_button.textContent = 'Добавить вариант ответа';

            add_button.addEventListener("click", function(e) {
                let new_answer = document.createElement('div');
                new_answer.classList.add('answer');
                new_answer.innerHTML = addable_code;

                this.parentNode.insertBefore(new_answer, this);
            }, false);

            body.appendChild(add_button);
        }

        return body;
    }

    static create_divs(name, type){
        let question_div = document.createElement('div');
        question_div.classList.add('question');
        question_div.dataset.type = type;

        let question_top_div = document.createElement('div');
        question_top_div.classList.add('question-top');
        question_top_div.innerHTML = `<p class="question-top-title">${name}</p>`;

        let question_body_div = document.createElement('div');
        question_body_div.classList.add('question-body');

        return {'question_div': question_div, 'question_top_div': question_top_div, 'question_body_div': question_body_div}
    }

    //Отобразить вопрос (возвращает div элемент)
    display_question(){
        let question = document.createElement('div');
        question.classList.add('question');
        question.dataset.type = this.question_type;
        
        question.appendChild(this.question_top);
        question.appendChild(this.question_body);

        return question;
    }

    get_question_type(){
        return this.question_type;
    }

    get_question_type_name(){
        return this.question_type_name;
    }

    constructor(name, code, addable_code, question_type, question_type_name){
        this.question_top_code = `<p class="question-top-title">Название вопроса:</p>
                            <input class="question-top-input" type="text" name="question-name" placeholder="Введите название вопроса" value="${name}">`;
        this.question_top = this.create_question_top();
        this.question_body = this.create_question_body(code, addable_code);
        this.question_type = question_type;
        this.question_type_name = question_type_name;
    }
}

class OneChoiceQuestion extends BaseQuestion{
    constructor(question_name = '', name = ''){
        super(
            question_name,
            `<div class='answer'><input type='radio' name="${name}" checked /><input class="answer-input" type='text' placeholder='Введите вариант ответа' /></div><div class='answer'><input type='radio' name="${name}" /><input class="answer-input" type='text' placeholder='Введите вариант ответа' /></div>`,
            `<input type='radio' name="${name}" /><input class="answer-input" type='text' placeholder='Введите вариант ответа' />`,
            'one',
            'Один выбор'
        );
    }

    static display_for_solving(question, name=''){
        let divs = this.create_divs(question['name'], question['type'])
        let question_div = divs['question_div'];
        let question_top_div = divs['question_top_div'];
        let question_body_div = divs['question_body_div'];

        for(let i = 0; i < question['answers'].length; i++){
            let answer_div = document.createElement('div');
            answer_div.classList.add('answer');
            answer_div.innerHTML += `<input type='radio' name="${name}" ${i == 0 ? "checked": ""}/>`;
            answer_div.innerHTML += `<p class="answer-input"/>${question['answers'][i]}</p>`;

            question_body_div.appendChild(answer_div);
        }

        question_div.appendChild(question_top_div);
        question_div.appendChild(question_body_div);

        return question_div;
    }

    static save_answers(question, isCreating = true){
        let answers = question.children[1].getElementsByClassName('answer');

        let current_answer = 0;
        let all_answers = [];
        let right_answers = [];

        Array.from(answers).forEach((answer) => {
            let answer_name = answer.lastElementChild.value;

            //Проверка на пустоту имени вопроса
            if(!answer_name && isCreating){
                throw new Error('Заполните все варианты ответов');
            }

            all_answers.push(answer_name);

            //Если этот вопрос оказался правильным, записываем в массив правильных ответов
            if(answer.firstElementChild.checked){
                right_answers.push(current_answer);
            }

            current_answer++;
        });

        return {'all_answers': all_answers, 'right_answers': right_answers}
    }
}

class MultipleChoiceQuestion extends BaseQuestion{
    constructor(question_name = '', name = ''){
        super(
            question_name,
            `<div class='answer'><input type='checkbox' /><input class='answer-input' type='text' placeholder='Введите вариант ответа' /></div><div class='answer'><input type='checkbox' /><input class='answer-input' type='text' placeholder='Введите вариант ответа' /></div>`,
            `<input type='checkbox' /><input class='answer-input' type='text' placeholder='Введите вариант ответа' />`,
            'multiple',
            'Множественный выбор'
        );
    }

    static display_for_solving(question, name=''){
        let divs = this.create_divs(question['name'], question['type'])
        let question_div = divs['question_div'];
        let question_top_div = divs['question_top_div'];
        let question_body_div = divs['question_body_div'];

        for(let i = 0; i < question['answers'].length; i++){
            let answer_div = document.createElement('div');
            answer_div.classList.add('answer');
            answer_div.innerHTML = `<input type='checkbox' name="${name}" />`;
            answer_div.innerHTML += `<p class="answer-input"/>${question['answers'][i]}</p>`;

            question_body_div.appendChild(answer_div);
        }

        question_div.appendChild(question_top_div);
        question_div.appendChild(question_body_div);

        return question_div;
    }

    static validate_answers(question){
        //Проверяем, чтобы хотя бы один чекбокс был выделен 
        let inputs = question.children[1].querySelectorAll('input[type=checkbox]');
        let check = false; //Проверка, что хотя бы один чекбокс будет нажат
        for(let i = 0; i < inputs.length; i++){
            if(inputs[i].checked){
                check = true;
                break; //Выходим с цикла, если хотя бы один чекбокс выделен
            }
        }
        //Если ни один чекбокс не выделен
        if(!check){
            throw new Error('В вопросах с множественным выбором выберите хотя бы один вариант ответа');
        }
    }

    static save_answers(question, isCreating = true){
        if(isCreating)
            this.validate_answers(question);

        let answers = question.children[1].getElementsByClassName('answer');

        let current_answer = 0;
        let all_answers = [];
        let right_answers = [];

        Array.from(answers).forEach((answer) => {
            let answer_name = answer.lastElementChild.value;

            //Проверка на пустоту имени вопроса
            if(!answer_name && isCreating){
                throw new Error('Заполните все варианты ответов');
            }

            all_answers.push(answer_name);

            //Если этот вопрос оказался правильным, записываем в массив правильных ответов
            if(answer.firstElementChild.checked){
                right_answers.push(current_answer);
            }

            current_answer++;
        });

        return {'all_answers': all_answers, 'right_answers': right_answers}
    }
}

class TextChoiceQuestion extends BaseQuestion{
    constructor(question_name = '', name = ''){
        super(
            question_name,
            `<div class='answer'><input class='answer-input' type='text' name="${name}" placeholder='Введите правильный ответ'/></div>`,
            null,
            'text',
            'Текстовый ответ'
        );
    }

    static display_for_solving(question, name=''){
        let divs = this.create_divs(question['name'], question['type'])
        let question_div = divs['question_div'];
        let question_top_div = divs['question_top_div'];
        let question_body_div = divs['question_body_div'];

        let answer_div = document.createElement('div');
        answer_div.classList.add('answer');
        answer_div.innerHTML += `<input class="answer-input" type='text' name="${name}" placeholder="Введите ответ"/>`;
        question_body_div.appendChild(answer_div);

        question_div.appendChild(question_top_div);
        question_div.appendChild(question_body_div);

        return question_div;
    }

    static save_answers(question, isCreating = true){
        let answers = question.children[1].getElementsByClassName('answer');

        let right_answers = [];

        let right_answer = answers[0].lastElementChild.value;

        //Проверка на пустоту ответа
        if(!right_answer && isCreating){
            throw new Error('Заполните все варианты ответов');
        }

        right_answers.push(right_answer.toLowerCase());

        return {'all_answers': [], 'right_answers': right_answers}
    }
}

const PLUGINS = [OneChoiceQuestion, MultipleChoiceQuestion, TextChoiceQuestion];