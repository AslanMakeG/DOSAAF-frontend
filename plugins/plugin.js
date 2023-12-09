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
            `<div class='answer'><input type='radio' name="${name}" checked /><input class="answer-inputs" type='text' placeholder='Введите вариант ответа' /></div><div class='answer'><input type='radio' name="${name}" /><input class="answer-inputs" type='text' placeholder='Введите вариант ответа' /></div>`,
            `<input type='radio' name="${name}" /><input class="answer-inputs" type='text' placeholder='Введите вариант ответа' />`,
            'one',
            'Один выбор'
        );
    }
}

const PLUGINS = [OneChoiceQuestion];