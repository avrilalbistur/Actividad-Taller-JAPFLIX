let movies;

// Function to fetch the movies
let getMoviesData = (url) => {
    movies = {};
    return fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }else{
            throw new Error(response.statusText);
        }
    })
    .then(function(response){
        movies.status = 'ok';
        movies.data = response;
        return movies;
    })
    .catch(function(error) {
        movies.status = 'error';
        movies.data = error;
        return movies;
    });
};

// Function to search for the movie 
let getMovieInput = (searchValue) =>{
    let filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(searchValue) || movie.genres.includes(searchValue) || movie.tagline.toLowerCase().includes(searchValue) || movie.overview.toLowerCase().includes(searchValue));
    return filteredMovies;
};

// Event that will be executed when the document is fully loaded.
document.addEventListener('DOMContentLoaded', ()=>{
    let searchValue;
    // Fetch the movies data
    getMoviesData('https://japceibal.github.io/japflix_api/movies-data.json')
        .then(object => {
            if(object.status === 'ok'){
                movies = object.data;
            };
        });

    // Input movie event 
    document.getElementById('inputBuscar').addEventListener('input',(e) =>{
    searchValue = e.target.value.toLowerCase();
})
    // Search button event
    let listaHTML = document.getElementById('lista');

    document.getElementById('btnBuscar').addEventListener('click', (e) => {
        listaHTML.innerHTML='';
        let HTMLToAppend = '';
        
        let result = getMovieInput(searchValue);
        result.forEach(element => {
            let stars = '';
            let rating = Math.round(element.vote_average/2);

            for (let i = 0; i < rating; i++) {
                stars += `<span class="fa fa-star checked"></span>`;
            }
            
            for (let i = rating; i < 5; i++) {
                stars += `<span class="fa fa-star no-checked"></span>`;
            }

            HTMLToAppend += `
            <div class="card mb-3 movie-card" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" data-movie-id="${element.id}">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title">${element.title}</h5>
                        <p class="card-text">${element.tagline}</p>
                    </div>
                    <div>
                        ${stars}
                    </div>
                </div>
            </div>
        `;
        });
        listaHTML.innerHTML = HTMLToAppend;
// Add all cards an addEventListener that will send the element data to the offCanvas
        document.querySelectorAll('.movie-card').forEach(card => {
            card.addEventListener('click', (e) => {
                let movieId = e.currentTarget.getAttribute('data-movie-id');
                let selectedMovie = movies.find(movie => movie.id == movieId);

                if (selectedMovie) {
                    document.getElementById('offcanvasTopLabel').textContent = selectedMovie.title;
                    document.querySelector('.offcanvas-body').innerHTML = `
                        <p>${selectedMovie.overview}</p>
                        <hr>
                        <div class="d-flex justify-content-between align-items-start">
                            <p class="genres">${selectedMovie.genres.map(genre => genre.name).join(' - ')}</p>
                            <div class="dropdown">
                                <button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" data-bs-display="static">
                                    More
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                                    <li><span class="dropdown-item"><strong>Year:</strong> ${selectedMovie.year}</span></li>
                                    <li><span class="dropdown-item"><strong>Runtime:</strong> ${selectedMovie.runtime} mins</span></li>
                                    <li><span class="dropdown-item"><strong>Budget:</strong> $${selectedMovie.budget.toLocaleString()}</span></li>
                                    <li><span class="dropdown-item"><strong>Revenue:</strong> $${selectedMovie.revenue.toLocaleString()}</span></li>
                                </ul>
                            </div>
                        </div>
                    `;
                }
                
            });
        });
});
});

