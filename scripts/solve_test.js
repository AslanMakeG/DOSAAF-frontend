const urlParams = new URLSearchParams(window.location.search);
const test_id = urlParams.get('test_id');

function show_test_from_json(json){
   let test_title = document.getElementById('test-top-title');
   let test_questions = document.getElementById('test-questions');

   test_title.textContent = json['name'];

   json['questions'].forEach(question => {
      test_questions.appendChild(LOAD_PLUGINS[question['type']].display_for_solving(question, MD5(new Date())));
   });
}

function solve_test(){
   let questions = document.getElementsByClassName('question');

   let test_json = {
      'id' : test_id,
      'questions' : []
   };

   Array.from(questions).forEach((question) => {
      let name = question.children[0].children[0].value; //Получаем имя вопроса
      let question_type = question.dataset.type; //Получаем тип вопроса

      let question_json = {
          'name': name,
          'type': question_type,
          'right_answer': []
      }

      let saved_answers = LOAD_PLUGINS[question_type].save_answers(question, false);

      question_json['right_answer'] = saved_answers['right_answers'];

      test_json['questions'].push(question_json); //Записываем вопрос в массив вопросов
   });

   fetch("http://127.0.0.1:8000/api/check_answers", {
      method: "POST",
      body: JSON.stringify(test_json),
      headers: {
         "Content-type": "application/json; charset=UTF-8"
      }
   })
   .then(response => response.json())
   .then(text => {
      localStorage.setItem("result", text['result']);
      localStorage.setItem("question_amount", text['question_amount']);
      window.location.replace('test_results.html');
   });
}

fetch('http://127.0.0.1:8000/api/get_test/' + test_id, {
   headers: {
      'Accept': 'application/json'
   }
})
.then(response => response.json())
.then(text => show_test_from_json(text['test'][0])); //стоит перенести в plugin_API

