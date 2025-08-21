document.addEventListener('DOMContentLoaded', () => {
    const hotelsContainer = document.getElementById('hotels-container');
    const hotelModal = document.getElementById('hotelModal');
    const closeButton = document.querySelector('.close-button');
    const modalHotelName = document.getElementById('modal-hotel-name');
    const modalLocation = document.getElementById('modal-location');
    const modalRatings = document.getElementById('modal-ratings');
    const modalDescription = document.getElementById('modal-description');
    const modalImage = document.getElementById('modal-image');
    const modalVideo = document.getElementById('modal-video');
    const prevMediaButton = document.querySelector('.prev-media');
    const nextMediaButton = document.querySelector('.next-media');

    let currentMediaIndex = 0; // 0 for image, 1 for video

    const showMedia = () => {
        if (currentMediaIndex === 0) {
            modalImage.classList.remove('hidden-media');
            modalImage.classList.add('active-media');
            modalVideo.classList.remove('active-media');
            modalVideo.classList.add('hidden-media');
            modalVideo.pause();
        } else {
            modalVideo.classList.remove('hidden-media');
            modalVideo.classList.add('active-media');
            modalImage.classList.remove('active-media');
            modalImage.classList.add('hidden-media');
            modalVideo.play();
        }
    };

    prevMediaButton.addEventListener('click', () => {
        currentMediaIndex = (currentMediaIndex - 1 + 2) % 2; // Cycle between 0 and 1
        showMedia();
    });

    nextMediaButton.addEventListener('click', () => {
        currentMediaIndex = (currentMediaIndex + 1) % 2; // Cycle between 0 and 1
        showMedia();
    });

    if (hotelsContainer) {
        const currentPage = window.location.pathname.split('/').pop();
        let islandKey = '';

        if (currentPage === 'luzon.html') {
            islandKey = 'luzon';
        } else if (currentPage === 'visayas.html') {
            islandKey = 'visayas';
        } else if (currentPage === 'mindanao.html') {
            islandKey = 'mindanao';
        }

        if (islandKey) {
            fetch('hotels.json')
                .then(response => response.json())
                .then(data => {
                    const hotels = data[islandKey];
                    if (hotels && hotels.length > 0) {
                        hotels.forEach(hotel => {
                            const hotelCard = document.createElement('div');
                            hotelCard.classList.add('hotel-card');
                            hotelCard.dataset.hotel = JSON.stringify(hotel); // Store hotel data

                            hotelCard.innerHTML = `
                                <img src="${hotel['img-path']}" alt="${hotel.hotel}">
                                <div class="hotel-card-content">
                                    <h3>${hotel.hotel}</h3>
                                    <p class="location">${hotel.location}</p>
                                    <p class="ratings">${hotel.ratings}</p>
                                </div>
                            `;
                            hotelsContainer.appendChild(hotelCard);

                            hotelCard.addEventListener('click', () => {
                                const clickedHotel = JSON.parse(hotelCard.dataset.hotel);
                                modalHotelName.textContent = clickedHotel.hotel;
                                modalLocation.textContent = clickedHotel.location;
                                modalRatings.textContent = clickedHotel.ratings;
                                modalDescription.textContent = clickedHotel.description;
                                modalImage.src = clickedHotel['img-path'];
                                modalVideo.src = clickedHotel['vid-path'];

                                currentMediaIndex = 0; // Reset to image when opening modal
                                showMedia();

                                hotelModal.style.display = 'block';
                            });
                        });
                    } else {
                        hotelsContainer.innerHTML = '<p>No hotels found for this island.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching hotels:', error);
                    hotelsContainer.innerHTML = '<p>Failed to load hotels. Please try again later.</p>';
                });
        }
    }

    // Close modal when close button is clicked
    closeButton.addEventListener('click', () => {
        hotelModal.style.display = 'none';
        modalVideo.pause(); // Pause video when closing modal
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === hotelModal) {
            hotelModal.style.display = 'none';
            modalVideo.pause(); // Pause video when closing modal
        }
    });
});
