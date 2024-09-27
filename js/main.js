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
    document.getElementById('btnBuscar').addEventListener('click', (e) => {
        let result = getMovieInput(searchValue);
        result.forEach(element => {
            document.getElementById('lista').innerHTML += `
                <li class="list-group-item">
                <p>${element.title}</p>
                <p>${element.tagline}</p>
                <p>${element.vote_average}</p>
            </li>
            `
        });
    });
});

