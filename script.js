const theme = document.querySelector('#theme');
const search = document.querySelector('#search');
const input = document.querySelector('#search_country');
const sort = document.querySelector('#filter');
const cflag = document.querySelector('#flag');
const card = document.querySelector('.body');

const header = document.querySelector('header');
const body = document.querySelector('body');
const select = document.querySelector('select');
const back = document.querySelector('#back');

// The light theme function
const lightMode = () => {
    const cards = document.querySelectorAll('.card');

    if(header) {
        header.style.backgroundColor = '';
        header.style.boxShadow = '';
    }
    if(theme) {
        theme.style.backgroundColor = '';
        theme.style.color = '';
    }
    if(body) {
        body.style.backgroundColor = '';
        body.style.color = '';
    }
    if(search) {
        search.style.backgroundColor = '';
        search.style.boxShadow = '';
    }
    if(input) {
        input.style.backgroundColor = '';
        input.style.color = '';
    }
    if(select) {
        select.style.boxShadow = '';
        select.style.backgroundColor = '';
        select.style.color = '';
    }
    if(back) {
        back.style.backgroundColor = '';
        back.style.color = '';
        back.style.boxShadow = '';
    }
    cards.forEach(card => {
        card.style.backgroundColor = '';
        card.style.boxShadow = ''
    })
}

// The dark theme function
const darkMode = () => {
    const cards = document.querySelectorAll('.card');

    if(header) {
        header.style.backgroundColor = 'var(--primary)';
        header.style.boxShadow = '0 .1rem .5rem var(--secondaryD)';
    }
    if(theme) {
        theme.style.backgroundColor = 'var(--primary)';
        theme.style.color = 'var(--secondary)';
    }
    if(body) {
        body.style.backgroundColor = 'var(--lightD)';
        body.style.color = 'var(--secondary)';
    }
    if(search) {
        search.style.backgroundColor = 'var(--primary)';
        search.style.boxShadow = '0 .1rem .1rem var(--secondaryD)';
    }
    if(input) {
        input.style.backgroundColor = 'var(--primary)';
        input.style.color = 'var(--secondary)';
    }
    if(select) {
        select.style.boxShadow = '0 .1rem .1rem var(--secondaryD)';
        select.style.backgroundColor = 'var(--primary)';
        select.style.color = 'var(--secondary)';
    }
    if(back) {
        back.style.backgroundColor = 'var(--lightD)';
        back.style.color = 'var(--secondary)';
        back.style.boxShadow = '0 .1rem .5rem var(--secondaryD)';
    }
    cards.forEach(card => {
        card.style.backgroundColor = 'var(--primary)';
        card.style.boxShadow = '0 .5rem .5rem var(--secondaryD)'
    })
}

// Function to toggle the theme and save the state to sessionStorage
const toggleTheme = () => {
    if (sessionStorage.getItem('theme') === 'dark') {
        sessionStorage.setItem('theme', 'light');
        lightMode();
    } else {
        sessionStorage.setItem('theme', 'dark');
        darkMode();
    }
}

// Check the saved theme state when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('theme') === 'dark') {
        darkMode();
    } else {
        lightMode();
    }
    
    getCountries(); // Call the function to fetch and display countries
});

// Function to apply the current theme
const addTheme = () => {
    if (sessionStorage.getItem('theme') === 'dark') {
        darkMode();
    } else {
        lightMode();
    }
}

// const selectCard = () => {
//     // listens to the card for a click event, and renders the data from that particular card
//     const cards = document.querySelectorAll('.card');

//     cards.forEach((card, index) => (
//         card.addEventListener('click', () => {
//             console.log(`Button ${index} Clicked ${card.dataset.name}`);
//             // window.location.href = 'details.html';
//         })
//     ));
// }

const selectCard = () => {
    const cards = document.querySelectorAll('.card');

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            // Retrieve data from the card's dataset
            const cardData = {
                name: card.dataset.name,
                region: card.dataset.region,
                capital: card.dataset.capital
            };

            console.log(`Card Data:`, cardData);

            // Optional: Save the data to sessionStorage or localStorage
            sessionStorage.setItem('selectedCountry', JSON.stringify(cardData));

            // Navigate to another page
            // window.location.href = 'details.html';
        });
    });
};


// this part is where i start using the API
const url = 'https://restcountries.com/v3.1/all'

const getCountries = async() => {
    try {
        const res = await fetch(url);
        const data = await res.json();
        
        // renders the initial data fetched, to the UI
        if(card) {
            card.innerHTML += data.map(data => 
                `
                    <div class="card">
                        <img src=${data.flags.png} alt=${data.flags.alt}>
                        <div>
                            <h1>${data.name.common}</h1>
                            <p>Population: ${data.population}</p>
                            <p>Region: ${data.continents}</p>
                            <p>capital: ${data.capital}</p>
                        </div>
                    </div>
                `
            ).join('')
        }
                
        // This block checks for a change in the dropdown value before render
        if(sort) {
            sort.addEventListener('change', (e) => {
                const selected = e.target.value.toLowerCase()

                if(selected !== 'all') {
                    const sorted = data.filter((list) => list.region.toLowerCase().includes(selected))

                    // clears the innerHTML before render
                    card.innerHTML = '';
                
                    card.innerHTML += sorted.map(data => 
                        `
                            <div class="card">
                                <img src=${data.flags.png} alt=${data.flags.alt}>
                                <div>
                                    <h1>${data.name.common}</h1>
                                    <p>Population: ${data.population}</p>
                                    <p>Region: ${data.continents}</p>
                                    <p>capital: ${data.capital}</p>
                                </div>
                            </div>
                        `
                    ).join('')
                }
                else {
                    card.innerHTML = ''

                    card.innerHTML += data.map(data => 
                        `
                            <div class="card">
                                <img src=${data.flags.png} alt=${data.flags.alt}>
                                <div>
                                    <h1>${data.name.common}</h1>
                                    <p>Population: ${data.population}</p>
                                    <p>Region: ${data.continents}</p>
                                    <p>capital: ${data.capital}</p>
                                </div>
                            </div>
                        `
                    ).join('')
                }

                addTheme();
                selectCard();
            })
        }

        // This part handles the search bar input
        if(input) {
            input.addEventListener('input', (e) => {
                const searchValue = e.target.value.toLowerCase().trim()

                const names = data.filter(data => data.name.common.toLowerCase().includes(searchValue))
                
                card.innerHTML = ''

                card.innerHTML += names.map(data => 
                    `
                        <div class="card">
                            <img src=${data.flags.png} alt=${data.flags.alt}>
                            <div>
                                <h1>${data.name.common}</h1>
                                <p>Population: ${data.population}</p>
                                <p>Region: ${data.continents}</p>
                                <p>capital: ${data.capital}</p>
                            </div>
                        </div>
                    `
                ).join('')

                addTheme();
                selectCard();
            });
        }

        addTheme();
        selectCard();
    } catch (error) {
        console.error('Error fetching or filtering country data:', error);
        return [];
    }
    
    // const flag = data.map(data => card.innerHTML += `<img src=${data.flags.svg} alt=${data.flags.alt} />`)
    // const flag = data.map(data => data.flags.png)
    // const flagAlt = data.map(data => data.flags.alt)
    // const population = data.map(data => data.population)
    // const continents = data.map(data => data.continents)
    // const capital = data.map(data => data.capital)
    // const sub_region = data.map(data => data.subregion)
    // const tld = data.map(data => data.tld)
    // const currencies = data.map(data => data.currencies)
    // const languages = data.flatMap(data => data.languages)
    // const borders = data.map(data => data.borders)
}

// this part listens for a click event on the theme
theme.addEventListener('click', () => {toggleTheme()});
