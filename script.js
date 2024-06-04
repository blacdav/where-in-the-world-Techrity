const theme = document.querySelector('#theme');
const search = document.querySelector('#search');
const input = document.querySelector('#search_country');
const sort = document.querySelector('#filter');
const cflag = document.querySelector('#flag');
// const cname = document.querySelector('#name');
// const cpopulation = document.querySelector('#population');
// const cregion = document.querySelector('#region');
// const ccapital = document.querySelector('#capital');
const card = document.querySelector('.body');

const header = document.querySelector('header');
const body = document.querySelector('body');
const select = document.querySelector('select');
const back = document.querySelector('#back');

// The light theme function
const lightMode = () => {
    const cards = document.querySelectorAll('.card');

    header.style.backgroundColor = '';
    header.style.boxShadow = '';
    theme.style.backgroundColor = '';
    theme.style.color = '';
    body.style.backgroundColor = '';
    body.style.color = '';
    search.style.backgroundColor = '';
    search.style.boxShadow = '';
    input.style.backgroundColor = '';
    input.style.color = '';
    select.style.boxShadow = '';
    select.style.backgroundColor = '';
    select.style.color = '';
    // back.style.backgroundColor = 'var(--lightD)';
    // back.style.color = 'var(--secondary)';
    cards.forEach(card => {
        card.style.backgroundColor = '';
        card.style.boxShadow = ''
    })
}

// The dark theme function
const darkMode = () => {
    const cards = document.querySelectorAll('.card');

    header.style.backgroundColor = 'var(--primary)';
    header.style.boxShadow = '0 .1rem .5rem var(--secondaryD)';
    theme.style.backgroundColor = 'var(--primary)';
    theme.style.color = 'var(--secondary)';
    body.style.backgroundColor = 'var(--lightD)';
    body.style.color = 'var(--secondary)';
    search.style.backgroundColor = 'var(--primary)';
    search.style.boxShadow = '0 .1rem .1rem var(--secondaryD)';
    input.style.backgroundColor = 'var(--primary)';
    input.style.color = 'var(--secondary)';
    select.style.boxShadow = '0 .1rem .1rem var(--secondaryD)';
    select.style.backgroundColor = 'var(--primary)';
    select.style.color = 'var(--secondary)';
    // back.style.backgroundColor = 'var(--lightD)';
    // back.style.color = 'var(--secondary)';
    cards.forEach(card => {
        card.style.backgroundColor = 'var(--primary)';
        card.style.boxShadow = '0 .5rem .5rem var(--secondaryD)'
    })
}

// Function to toggle the theme and save the state to localStorage
const toggleTheme = () => {
    if (localStorage.getItem('theme') === 'dark') {
        localStorage.setItem('theme', 'light');
        lightMode();
    } else {
        localStorage.setItem('theme', 'dark');
        darkMode();
    }
}

// Check the saved theme state when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        darkMode();
    } else {
        lightMode();
    }
    
    getCountries(); // Call the function to fetch and display countries
});

// Function to apply the current theme
const addTheme = () => {
    if (localStorage.getItem('theme') === 'dark') {
        darkMode();
    } else {
        lightMode();
    }
}

const selectCard = () => {
    // listens to the card for a click event, and renders the data from that particular card
    const cards = document.querySelectorAll('.card');

    cards.forEach((card, index) => (
        card.addEventListener('click', () => {
            console.log(`Button ${index} Clicked`);
            window.location.href = 'details.html'
        })
    ));
}

// this part is where start using the API
const url = 'https://restcountries.com/v3.1/all'

const getCountries = async() => {
    try {
        const res = await fetch(url);
        const data = await res.json();
        
        // renders the initial data fetched, to the UI
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
                
        // This block checks for a change in the dropdown value before render
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

        // This part handles the search bar input
        input.addEventListener('input', (e) => {
            const searchValue = e.target.value.toLowerCase()

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
