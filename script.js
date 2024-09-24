document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('index.html')) {
        loadContent('home.json', 'home-section');
        loadContent('arts.json', 'arts-section');
    } else if (path.includes('us&science.html')) {
        loadContent('science.json', 'science-section');
        loadContent('us.json', 'us-section');
    } else if (path.includes('books&world.html')) {
        loadContent('world.json', 'world-section');
        loadContent('books.json', 'books-section');
    }

    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    hamburger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
    });
    
    updateDate();
});

function updateDate() {
    const dateElement = document.getElementById('current-date');
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString(undefined, options);
    dateElement.textContent = formattedDate;
}

function loadContent(apiUrl, sectionId) {
    fetch(apiUrl)
        .then(response => {
            console.log('Fetching:', apiUrl);
            return response.json();
        })
        .then((data) => {
            console.log('Data fetched for:', sectionId, data);
            const results = data.results;
            const targetSection = document.getElementById(sectionId);

            if (sectionId === 'books-section') {
                const books = results.books;
                books.forEach((book) => {
                    const bookDiv = document.createElement('div');
                    bookDiv.classList.add('book');

                    const titleElement = document.createElement('h3');
                    titleElement.textContent = book.title;
                    bookDiv.appendChild(titleElement);

                    const authorElement = document.createElement('p');
                    authorElement.textContent = `by ${book.author}`;
                    bookDiv.appendChild(authorElement);

                    const descriptionElement = document.createElement('p');
                    descriptionElement.textContent = book.description;
                    bookDiv.appendChild(descriptionElement);

                    const imageElement = document.createElement('img');
                    imageElement.src = book.book_image;
                    imageElement.alt = book.title;
                    bookDiv.appendChild(imageElement);

                    const buyLinksContainer = document.createElement('div');
                    buyLinksContainer.style.display = 'flex';
                    buyLinksContainer.style.flexWrap = 'wrap';
                    buyLinksContainer.style.gap = '10px';

                    book.buy_links.forEach(link => {
                        const linkElement = document.createElement('a');
                        linkElement.href = link.url;
                        linkElement.textContent = link.name;
                        linkElement.target = '_blank';
                        linkElement.style.textDecoration = 'none';
                        linkElement.style.padding = '5px 10px';
                        linkElement.style.backgroundColor = 'black';
                        linkElement.style.color = 'white';
                        linkElement.style.borderRadius = '3px';
                        linkElement.style.border = 'none';
                        linkElement.style.cursor = 'pointer';
                        linkElement.style.fontSize = '0.85rem';
                        linkElement.style.transition = 'background-color 0.3s, transform 0.3s';

                        linkElement.onmouseover = () => {
                            linkElement.style.backgroundColor = 'black';
                            linkElement.style.transform = 'scale(1.05)';
                        };
                        linkElement.onmouseout = () => {
                            linkElement.style.backgroundColor = 'black';
                            linkElement.style.transform = 'scale(1)';
                        };

                        buyLinksContainer.appendChild(linkElement);
                    });

                    bookDiv.appendChild(buyLinksContainer);
                    targetSection.appendChild(bookDiv);
                });
            } else {
                results.forEach((item) => {
                    const sectionDiv = document.createElement('div');
                    sectionDiv.classList.add('section');

                    if (item.title) {
                        const titleElement = document.createElement('div');
                        titleElement.classList.add('section-title');
                        titleElement.textContent = item.title;
                        sectionDiv.appendChild(titleElement);
                        titleElement.style.paddingBottom = '10px';
                    }

                    if (item.abstract) {
                        const abstractElement = document.createElement('div');
                        abstractElement.classList.add('section-abstract');
                        abstractElement.textContent = item.abstract;
                        sectionDiv.appendChild(abstractElement);
                        abstractElement.style.paddingBottom = '10px';
                    }

                    if (item.multimedia) {
                        let imageAdded = false;
                        item.multimedia.forEach((media) => {
                            if (media.type === 'image' && media.format === 'threeByTwoSmallAt2X' && !imageAdded) {
                                const mediaContainer = document.createElement('div');
                                mediaContainer.classList.add('media-container');

                                const imageElement = document.createElement('img');
                                imageElement.src = media.url;
                                imageElement.alt = media.caption || 'Image';
                                imageElement.classList.add('media-image');

                                const descriptionElement = document.createElement('div');
                                descriptionElement.classList.add('media-description');
                                descriptionElement.textContent = media.caption || '';

                                mediaContainer.appendChild(imageElement);
                                mediaContainer.appendChild(descriptionElement);
                                sectionDiv.appendChild(mediaContainer);

                                imageAdded = true;
                            }
                        });

                        if (!imageAdded) {
                            console.log('No image found for item:', item);
                        }
                    }

                    if (sectionDiv.childElementCount > 0) {
                        targetSection.appendChild(sectionDiv);
                    }
                });
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}