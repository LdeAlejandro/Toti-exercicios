function createCards(title, description, imague_url, image_description) {
  //creating card elements
  let cardElement = document.createElement("article");
  cardElement.classList.add("card", "mb-2", "mx-2");

  let imgElement = createImage(imague_url, image_description);
  imgElement.classList.add("card-img-top");
  imgElement.src = imague_url;
  imgElement.alt = "alt-text";

  let cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  let cardTitle = document.createElement("h3");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = title;

  let cardDescription = document.createElement("p");
  cardDescription.classList.add("card-text");
  cardDescription.textContent = description;

  //appenidng elements
  cardElement.appendChild(imgElement);
  cardElement.appendChild(cardBody);

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardDescription);

  return cardElement;
}

function createImage(url, description) {
  let el;

  if (url && description) {
    el = document.createElement("img");
    el.src = url;
    el.alt = description;
  } else {
    el = document.createElement("div");
    el.classList.add("img-sample");
  }
  return el;
}


function createSampleCard() {
  return createCards("Carregando...", "...");
}


// function constructor with class:
class ApiConnection {
 
    //declarando propiedades so de lida para que nao mudem os dados
    get API_URL() {
        return "https://api.nasa.gov/planetary/apod";
    }

    get API_KEY() {
        return "DEMO_KEY"; 
    }

    async getRandomImages(count) {

        const request_url = `${this.API_URL}?api_key=${this.API_KEY}&count=${count}`;
        const resp = await fetch(request_url);

        if (resp.ok) {
            return await resp.json();
        }
        throw new Error("Ocorreu um erro na requisição");
    }
    async getImagesForDateRange(start_date, end_date) {

        let request_url = this.API_URL + '?api_key=' + this.API_KEY;
        if (end_date) {
            request_url += '&start_date=' + start_date + '&end_date=' + end_date;
        } else {
            request_url += '&start_date=' + start_date;
        }


        const resp = await fetch(request_url);
        if (resp.ok) {
            return await resp.json();
        }
        throw new Error(`Error fetching API, status: ${resp.status}`);
    }
}


/*
// function constructor with prototype:
function ApiConnection(){}

ApiConnection.prototype.API_URL = "https://api.nasa.gov/planetary/apod";
ApiConnection.prototype.API_KEY = "NluNws4dbwVsEUZ8fPIQlELKCu0h0FArlnWuFn69"

ApiConnection.prototype.getRandomImages = async function (count) {

    const request_url = `${this.API_URL}?api_key=${this.API_KEY}&count=${count}`;
        const resp = await fetch(request_url);

        if (resp.ok) {
          return await resp.json();
        }
        throw new Error("Ocorreu um erro na requisição");
}


ApiConnection.prototype.getImagesForDateRange = async function (start_date, end_date) {

    let request_url = this.API_URL + '?api_key=' + this.API_KEY;
       if(end_date){
        request_url +='&start_date='+start_date+ '&end_date='+end_date;
       }else{
        request_url +='&start_date='+start_date;
       }
       

    const resp = await fetch(request_url)
    if(resp.ok){
        return await resp.json();
    }
    throw new Error (`Error fetching API, status: ${resp.status}`)
}
*/

//
/** 
 * api request try catch
async function requestRandomImages(count) {

    try {  
        const resp = await fetch(request_url);

        if (!resp.ok) {
          throw new Error("Ocorreu um erro na requisição");
        }
    
        const data = await resp.json()
        console.log(data);

        return data;
    }
    catch(error){
        console.error(error);
    }

}

let requestData = requestRandomImages(25);

*/

//let apiConnection = new ApiConnection();



document.addEventListener("DOMContentLoaded", function startApp(){

    const search_results_el = document.getElementById("search-results");
    const search_form_el = document.getElementById("search-form");
    const search_type_options_els = document.querySelectorAll('[name=search-type]');
    const start_date_el = document.getElementById("start-date");
    const end_date_el = document.getElementById("end-date");
    const api_connection = new ApiConnection();

    console.log("started app!!!");
//create card sample elements
function displayCardPlaceHolders(el, count){
    el.innerHTML ="";
    for (let i = 0; i < count; i++){
        el.appendChild(createSampleCard());
    }
}

displayCardPlaceHolders(search_results_el, 15);

function displayResultsAsCards(el, results){
    el.innerHTML ="";
    results.forEach(result => {
        if(!result.url.includes("youtube")){
        el.appendChild(createCards(result.title, truncateText(result.explanation), result.url, result.title));  
    }
      })
}
    //delete sample and create card elements with the api content
    api_connection.getRandomImages(8)
    .then(results =>{
        displayResultsAsCards(search_results_el, results);
    })
 
    

    
//validar tamano do texto
function truncateText(text, max = 150){
    if(text.length < max){
        return text;
    }

    return text.slice(0, max) + "[...]";
}


 //pegar dados do formulario quando enviado
 search_form_el.addEventListener("submit", function submitSearchAndLoadResults(event){
   event.preventDefault();
  
   //dados do formulario
   const form_data = new FormData(event.target);
   const search_type = form_data.get("search-type");
   const random_count = +form_data.get("random-qty");
   const start_date = form_data.get("start-date");
   const end_date = form_data.get("end-date");

   if (search_type === "random" && random_count) {
    
     displayCardPlaceHolders(
       search_results_el,
       random_count <= 15 ? random_count : 15
     );

     api_connection
       .getRandomImages(random_count)
       .then((results) => {search_results_el.innerHTML ="";
       displayResultsAsCards(search_results_el, results)})
       .catch((err) => console.error(err));
   }

   if (search_type === "data-range" && start_date) {
   
     displayCardPlaceHolders(
       search_results_el,
       random_count <= 15 ? random_count : 15
     );

     api_connection
       .getImagesForDateRange(start_date, end_date)
       .then((results) => displayResultsAsCards(search_results_el, results))
       .catch((err) => console.error(err));
   }
 }
)


//convertindo en array
Array.from(search_type_options_els).forEach((opt_el) => {
    opt_el.addEventListener("change", 
    
    function changeEnabledSearchType(event){
            document.querySelectorAll('[data-search-type-fieldset]').forEach(fs => {
               
                fs.disabled = event.target.value !== fs.dataset.searchTypeFieldset
              
            })
        })
    
})

function dateToString(date){
    const day = String(date.getDate());
    const month_zero_based = date.getMonth();
    const month = String(month_zero_based + 1).padStart(2,0);
    const year = String(date.getFullYear())

    return `${year}-${month}-${day}`;
}

now_string = dateToString(new Date())

start_date_el.max = now_string;
end_date_el.max = now_string;

start_date_el.addEventListener("change", function changeStartDateMinLimit(event){
    if(end_date_el.valueAsDate < event.target.valueAsDate){
        end_date_el.value = event.target.value;
    }

    end_date_el.min = event.target.value;
})


   
})



