/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
// id, name, summary, image
async function searchShows(query) {
  let response = await axios.get("http://api.tvmaze.com/search/shows?", {params: {q: query}}); //request for data
  let shows = response.data.map(function(show) { // map to return necessary data
      return {
        id: show.show.id,
        name: show.show.name,
        summary: show.show.summary,
        image: show.show.image ? show.show.image.medium : "https://tinyurl.com/tv-missing",
      }
  });
  return shows; 
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src="${show.image}">
             <p class="card-text">${show.summary}</p>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


async function getEpisodes(id) {
  let response = await axios.get(" http://api.tvmaze.com/shows/" + id + "/episodes"); //request
  let episodes = response.data.map(function(episode) { // map to return only what is necessary 
    return {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number,
    }
});
return episodes; 
}


function populateEpisodes(episodes){
  document.getElementById('episodes-area').style.display = 'block';
  let episodeList = $("#episodes-list").html(''); // clear out any existing data
  episodeList = $("#episodes-list");
  for (let episode of episodes) { // for each episode create a list item
    let $ep = $(
      `<li>${episode.name} Season ${episode.season} Episode ${episode.number}</li>`
    );
    episodeList.append($ep); // add item to the ul element
  }
}

let list = document.querySelector('#shows-list');
list.addEventListener('click', async function(e) {
  let showID = $(e.target).closest(".Show").data("show-id"); //grab the data attribute 'show-id' from the closest element up
  let episodeList = await getEpisodes(showID); // get the episodes & organize them
  populateEpisodes(episodeList); // popualte our list
});


