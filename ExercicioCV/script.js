
document.addEventListener("DOMContentLoaded", function(){

    const contactForm = document.getElementById("contact-form");
    const contactFormSubmitBtn = document.getElementById("submit-button");
    const thankYouMsg = document.getElementById("thank-you-message");

    function checkForm(){

        if(contactForm.checkValidity()){
            contactFormSubmitBtn.disabled = false;
            
        }
        else{
            contactFormSubmitBtn.disabled = true;
        }
    }

    document.querySelectorAll("#contact-form input").forEach(inputEl => {

        if(inputEl.hasAttribute("required")){
            inputEl.addEventListener("input", function(){
                const errorElement = document.getElementById(inputEl.id +"-error");
                console.log("checking")

                if(inputEl.checkValidity()){
                    errorElement.style.display = "none";

                }
                else{
                    errorElement.style.display = "inline";
                }

                checkForm();
            })
        }

    })

    contactForm.addEventListener("submit", function(event){
        console.log("submitted");
        event.preventDefault();

        thankYouMsg.classList.add('thank-you-message');
        thankYouMsg.classList.remove('thank-you-message-hidden');


         setTimeout(function() {
            thankYouMsg.classList.remove('thank-you-message');
             thankYouMsg.classList.add('.thank-you-message-hidden');
         }, 5000);
  
  
        })

        class GitHubApiConnection {
 
            //declarando propiedades so de lida para que nao mudem os dados
            get API_URL() {
                return "https://api.github.com/users/LdeAlejandro/repos";
            }

            async fetchGitHubRepos() {
                try {
                    const resp = await fetch(this.API_URL);
                    if (!resp.ok) {
                        throw new Error('Failed to fetch GitHub repositories');
                    }
                    return await resp.json(); // Return parsed JSON data
            
                    // Optionally process the fetched data here
                } catch (error) {
                    console.error('Error in fetchGitHubRepos():', error);
                    throw error; // Rethrow the error to handle it in fetchData()
                }
            
        }
    }

    const githubApi = new GitHubApiConnection();

    githubApi.fetchGitHubRepos()
    .then((results)=>{
        const recentRepos = orderByFiveMoreRecent(results);
        createProjectList(recentRepos);
    })
    .catch((err) =>{
        console.error(`Error GitHubApi: ${err}`);
    })
     
        
        function orderByFiveMoreRecent(repoArray){
            for(let i = 0; i < repoArray.length -1; i++){
                for( let j = 0; j < repoArray.length -i -1; j++){
                let a = new Date(repoArray[j].updated_at);
                let b = new Date(repoArray[j+1].updated_at);
                
                if(a.getTime() < b.getTime() ){
                    let temp = repoArray[j]
                    repoArray[j] = repoArray[j+1];
                    repoArray[j+1] = temp;
                }
                  
                }
            }
            repoArray.length =5;
            return repoArray;
        }
        
        

//recentRepos[1].name
//recentRepos[1].html_url
//recentRepos[1].haspages
//https://api.github.com/repos/LdeAlejandro/Toti-exercicios/contents
//https://ldealejandro.github.io/




function createProjectList(reposList){

    console.log(reposList)
reposList.forEach((repo)=>{
    console.log(repo.name, repo.html_url)
    projectCardElementTemplate(repo.name, repo.html_url);
})

      
}
  
function projectCardElementTemplate(repoName, repoUrl){
    console.log("cards")
    const projectItemElement = document.createElement('li');
    projectItemElement.classList.add("projects-item");
    
    const itemImgDescription = document.createElement("div");
    itemImgDescription.classList.add("project-img-and-description");
    projectItemElement.appendChild(itemImgDescription);
    
    const iconElement = document.createElement("i");
    iconElement.classList.add("project-card-image", "fa-solid", "fa-code", "fa-6x");
    itemImgDescription.appendChild(iconElement);
    
    const projectTitleElement = document.createElement("h3");
    projectTitleElement.classList.add("project-title");
    projectTitleElement.textContent= repoName;
    itemImgDescription.appendChild(projectTitleElement);
    
    const cardButtonsElements = document.createElement("div");
    cardButtonsElements.classList.add("card-buttons");
    projectItemElement.appendChild(cardButtonsElements);
    
    const carButtonElement1 = document.createElement("a");
    carButtonElement1.classList.add("project-link", "card-button");
    carButtonElement1.href = repoUrl;
    carButtonElement1.target="_blank";
    carButtonElement1.textContent = "REPOSITÓRIO";
    cardButtonsElements.appendChild(carButtonElement1);
    
    const carButtonElement2 = document.createElement("a");
    carButtonElement2.classList.add("project-link", "card-button");
    carButtonElement2.href = repoUrl;
    carButtonElement2.target="_blank";
    carButtonElement2.textContent = "VER DEMO";
    cardButtonsElements.appendChild(carButtonElement2);
    
    document.querySelector("#projects-list").appendChild(projectItemElement);
    } 
            
// smooth local href

document.querySelectorAll('a.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

})