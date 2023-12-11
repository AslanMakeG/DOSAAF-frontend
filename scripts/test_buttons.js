function delete_test(button){
    let test = button.parentNode;
    let test_id = test.dataset.id;

    delete_test_on_server(test_id, test);
}

//удалить тест на сервере
function delete_test_on_server(id, element){
    fetch('http://127.0.0.1:8000/api/delete_test/' + id, {
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if(response['status'] == 200){
            element.parentNode.parentNode.removeChild(element.parentNode);
        }
    });
} //стоит перенести в plugin_API

function solve_test(button){
    window.location.replace(`test.html?test_id=${button.parentNode.dataset.id}`);
}
