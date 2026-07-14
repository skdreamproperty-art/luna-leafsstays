// --- DATA ---
const FALLBACK_IMAGE = "tree.jpg";
const WHATSAPP_NUMBER = "917876810980";

const PROPERTY_IMAGES = {
    shimla: [
        "6.jpeg",
        "1.jpeg",
        "shimla.avif",
        "washroom.jpeg",
        "living.jpeg",
        "bedroom.jpeg",
        "balcony.PNG"
    ],
    mohali: [
        "mohali flat.jpg",
        "design1.jpeg",
        "design2.jpeg",
        "design3.jpeg",
        "lcd.jpeg",
        "lcd1.jpeg",
        "bedroom1.jpeg",
        "bedroom2.jpeg",
        "kitchen.jpeg",
        "kitchen1.jpeg",
        "kitchen2.jpeg",
        "washroom1.jpeg"
    ]
};

const apartments = [
    {
        id: 1,
        title: "Shimla Luxury Apartment",
        category: "Premium Apartment",
        location: "Shimla",
        citySlug: "shimla",
        address: "Shimla, Himachal Pradesh",
        guests: 3,
        beds: 1,
        wifi: "Free Wi-Fi",
        description: "Experience the perfect blend of comfort and nature. Enjoy breathtaking mountain views, peaceful surroundings and thoughtfully designed interiors in this premium Shimla stay.",
        features: [
            { icon: "fas fa-mountain", label: "Mountain View" },
            { icon: "fas fa-couch", label: "Fully Furnished" },
            { icon: "fas fa-border-all", label: "Private Balcony" },
            { icon: "fas fa-bolt", label: "Power Backup" }
        ],
        images: PROPERTY_IMAGES.shimla,
        amenities: ["Mountain View", "Free Wi-Fi", "Smart TV", "Private Balcony", "Free Parking", "Power Backup"]
    },
    {
        id: 2,
        title: "Mohali Luxury Apartment",
        category: "Premium Apartment",
        location: "Mohali",
        citySlug: "mohali",
        address: "Mohali, Punjab",
        guests: 5,
        beds: 2,
        wifi: "Free Wi-Fi",
        description: "Experience stylish urban living in Mohali with modern interiors, premium comfort and convenient access to Chandigarh's leading business and lifestyle destinations.",
        features: [
            { icon: "fas fa-map-marker-alt", label: "Prime City Location" },
            { icon: "fas fa-couch", label: "Fully Furnished" },
            { icon: "fas fa-utensils", label: "Modern Kitchen" },
            { icon: "fas fa-bolt", label: "Power Backup" }
        ],
        images: PROPERTY_IMAGES.mohali,
        amenities: ["Prime City Location", "Free Wi-Fi", "Smart TV", "Modern Kitchen", "Free Parking", "Power Backup"]
    }
];

const galleryImages = [
    { src: "shimla.avif", location: "shimla", category: "exterior", alt: "Luna and Leaf Shimla luxury apartment exterior view" },
    { src: "1.jpeg", location: "shimla", category: "living", alt: "Luna and Leaf Shimla luxury apartment living room" },
    { src: "6.jpeg", location: "shimla", category: "exterior", alt: "Luna and Leaf Shimla premium apartment view" },
    { src: "washroom.jpeg", location: "shimla", category: "exterior", alt: "Luna and Leaf Shimla apartment washroom" },
    { src: "mohali flat.jpg", location: "mohali", category: "exterior", alt: "Luna and Leaf Mohali luxury apartment exterior" },
    { src: "design1.jpeg", location: "mohali", category: "living", alt: "Luna and Leaf Mohali luxury apartment living room" },
    { src: "design2.jpeg", location: "mohali", category: "living", alt: "Luna and Leaf Mohali premium lounge area" },
    { src: "design3.jpeg", location: "mohali", category: "living", alt: "Luna and Leaf Mohali modern apartment interiors" },
    { src: "lcd.jpeg", location: "mohali", category: "living", alt: "Luna and Leaf Mohali living room smart TV" },
    { src: "lcd1.jpeg", location: "mohali", category: "living", alt: "Luna and Leaf Mohali media wall" },
    { src: "bedroom1.jpeg", location: "mohali", category: "bedroom", alt: "Luna and Leaf Mohali comfortable bedroom" },
    { src: "bedroom2.jpeg", location: "mohali", category: "bedroom", alt: "Luna and Leaf Mohali second bedroom" },
    { src: "kitchen.jpeg", location: "mohali", category: "kitchen", alt: "Luna and Leaf Mohali apartment kitchen" },
    { src: "kitchen1.jpeg", location: "mohali", category: "kitchen", alt: "Luna and Leaf Mohali modern kitchen" },
    { src: "kitchen2.jpeg", location: "mohali", category: "kitchen", alt: "Luna and Leaf Mohali premium kitchen" },
    { src: "washroom1.jpeg", location: "mohali", category: "exterior", alt: "Luna and Leaf Mohali premium washroom" },
    { src: "living.jpeg", location: "shimla", category: "living", alt: "Luna and Leaf Shimla premium living room" },
    { src: "bedroom.jpeg", location: "shimla", category: "bedroom", alt: "Luna and Leaf Shimla apartment bedroom" },
    { src: "balcony.PNG", location: "shimla", category: "balcony", alt: "Luna and Leaf Shimla apartment balcony view" }
];

let activeApartmentLocation = "all";
let activeGalleryLocation = "all";
let activeGalleryCategory = "all";
let galleryExpanded = false;
let currentApt = null;
let currentSlideIndex = 0;
const imageCache = new Map();

document.addEventListener("DOMContentLoaded", () => {
    renderApartments(activeApartmentLocation);
    renderGallery();
    bindDestinationCards();
    bindGalleryFilters();
    bindMapTabs();
    setupAnimations();
    setupDates();
    setupKeyboardControls();
    warmImageCache();
});

function preloadImage(src) {
    if (!src || imageCache.has(src)) return imageCache.get(src);
    const request = new Promise(resolve => {
        const image = new Image();
        image.onload = () => resolve(src);
        image.onerror = () => resolve(FALLBACK_IMAGE);
        image.src = src;
    });
    imageCache.set(src, request);
    return request;
}

function warmImageCache() {
    const priorityImages = [
        ...apartments.map(apartment => apartment.images[0]),
        ...galleryImages.slice(0, 10).map(image => image.src)
    ];

    priorityImages.forEach(src => preloadImage(src));
    window.setTimeout(() => {
        [...PROPERTY_IMAGES.shimla, ...PROPERTY_IMAGES.mohali].forEach(src => preloadImage(src));
    }, 1200);
}

// --- RENDER FUNCTIONS ---
function renderApartments(location = "all") {
    activeApartmentLocation = location;
    const grid = document.getElementById("apartment-grid");
    if (!grid) return;
    const visibleApartments = apartments.filter(apt => location === "all" || apt.citySlug === location);
    const isAllLocations = location === "all";

    syncDestinationCards(location);
    grid.classList.toggle("compact-apartment-grid", isAllLocations);

    if (!visibleApartments.length) {
        grid.innerHTML = `<div class="empty-state">No properties are currently available for this location.</div>`;
        return;
    }

    grid.innerHTML = visibleApartments.map(apt => isAllLocations ? renderCompactApartmentCard(apt) : renderApartmentShowcaseCard(apt)).join("");
}

function renderCompactApartmentCard(apartment) {
    return `
        <article class="apartment-compact-card" data-property-id="${apartment.id}">
            <div class="apartment-compact-image-wrap">
                <img class="apartment-compact-image" src="${apartment.images[0]}"
                    alt="${apartment.title} property image" loading="lazy" onerror="handleImageError(this)">
                <div class="apartment-status-badge apartment-compact-badge">
                    <span class="status-dot"></span>
                    <span>Available Now</span>
                </div>
            </div>
            <div class="apartment-compact-content">
                <div class="apartment-compact-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${apartment.address}</span>
                </div>
                <h3 class="apartment-compact-title">${apartment.title}</h3>
                <div class="apartment-compact-meta">
                    <span><i class="fas fa-user"></i> ${apartment.guests} Guests</span>
                    <span><i class="fas fa-bed"></i> ${apartment.beds} ${apartment.beds === 1 ? "Bed" : "Beds"}</span>
                </div>
                <button type="button" class="apartment-compact-details" onclick="showApartmentDetails(${apartment.id})">
                    View Details
                </button>
            </div>
        </article>
    `;
}

function renderApartmentShowcaseCard(apt) {
    return `
        <article class="apartment-showcase-card" data-property-id="${apt.id}" data-current-image-index="0">
            <button type="button" class="apartment-detail-back" onclick="renderApartments('all')">
                <span class="apartment-detail-back-icon"><i class="fas fa-arrow-left"></i></span>
                <span>Back to Apartments</span>
            </button>
            <div class="apartment-showcase-main">
                <div class="apartment-media-panel">
                    <img class="apartment-main-image" src="${apt.images[0]}" alt="${apt.title} main property image"
                        loading="lazy" onerror="handleImageError(this)">
                    <button type="button" class="apartment-slider-btn apartment-slider-prev"
                        aria-label="Previous ${apt.title} photo" onclick="changeCardSlide(${apt.id}, -1)">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button type="button" class="apartment-slider-btn apartment-slider-next"
                        aria-label="Next ${apt.title} photo" onclick="changeCardSlide(${apt.id}, 1)">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <div class="apartment-status-badge">
                        <span class="status-dot"></span>
                        <span>Available Now</span>
                    </div>
                    <div class="apartment-location-overlay">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${apt.address}</span>
                    </div>
                    ${renderApartmentThumbnails(apt)}
                </div>

                <div class="apartment-content-panel">
                    <div class="apartment-premium-label">
                        <i class="fas fa-crown"></i>
                        <span>${apt.category}</span>
                    </div>
                    <h3 class="apartment-title">${apt.title}</h3>
                    <div class="apartment-quick-info">
                        <span class="apartment-info-pill"><i class="fas fa-user-friends"></i> ${apt.guests} Guests</span>
                        <span class="apartment-info-pill"><i class="fas fa-bed"></i> ${apt.beds} ${apt.beds === 1 ? "Bed" : "Beds"}</span>
                        <span class="apartment-info-pill"><i class="fas fa-wifi"></i> ${apt.wifi}</span>
                    </div>
                    <p class="apartment-description">${apt.description}</p>
                    <div class="apartment-feature-grid">
                        ${apt.features.map(feature => `
                            <div class="apartment-feature">
                                <i class="${feature.icon}"></i>
                                <span>${feature.label}</span>
                            </div>
                        `).join("")}
                    </div>
                    <div class="apartment-actions">
                        <a class="apartment-whatsapp-button" href="${getApartmentWhatsAppUrl(apt)}"
                            target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-whatsapp"></i>
                            <span>WhatsApp Inquiry</span>
                        </a>
                    </div>
                </div>
            </div>

            <div class="apartment-benefits-bar">
                <div class="apartment-benefit"><i class="fas fa-map-marker-alt"></i><span>Prime Location</span></div>
                <div class="apartment-benefit"><i class="fas fa-headset"></i><span>24/7 Support</span></div>
                <div class="apartment-benefit"><i class="fas fa-shield-alt"></i><span>Secure Stay</span></div>
                <div class="apartment-benefit"><i class="fas fa-award"></i><span>Best Price Guarantee</span></div>
            </div>
        </article>
    `;
}

function showApartmentDetails(id) {
    const apartment = apartments.find(apt => apt.id === id);
    const grid = document.getElementById("apartment-grid");
    if (!apartment || !grid) return;
    activeApartmentLocation = apartment.citySlug;
    syncDestinationCards(apartment.citySlug);
    grid.classList.remove("compact-apartment-grid");
    grid.innerHTML = renderApartmentShowcaseCard(apartment);
    document.getElementById("apartments")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderApartmentThumbnails(apartment) {
    const visibleImages = apartment.images.slice(0, 4);
    const remaining = apartment.images.length - visibleImages.length;
    return `
        <div class="apartment-thumbnail-list">
            ${visibleImages.map((image, index) => `
                <button type="button" class="apartment-thumbnail ${index === 0 ? "active" : ""}"
                    data-property-id="${apartment.id}" data-image-index="${index}"
                    aria-label="View ${apartment.title} image ${index + 1}"
                    onclick="changeCardImage(${apartment.id}, ${index})">
                    <img src="${image}" alt="" loading="lazy" onerror="handleImageError(this)">
                </button>
            `).join("")}
            ${remaining > 0 ? `<button type="button" class="apartment-thumbnail apartment-more-images"
                data-property-id="${apartment.id}" data-image-index="4"
                aria-label="View more ${apartment.title} images" onclick="changeCardImage(${apartment.id}, 4)">+${remaining}</button>` : ""}
        </div>
    `;
}

function renderGallery() {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;
    const isFullGalleryPage = document.body.classList.contains("gallery-page");
    const visibleImages = galleryImages.filter(img => {
        const locationMatch = activeGalleryLocation === "all" || img.location === activeGalleryLocation;
        const categoryMatch = activeGalleryCategory === "all" || img.category === activeGalleryCategory;
        return locationMatch && categoryMatch;
    });
    const initialLimit = 10;
    const displayImages = galleryExpanded || isFullGalleryPage ? visibleImages : visibleImages.slice(0, initialLimit);
    const remainingImages = visibleImages.length - displayImages.length;

    if (!visibleImages.length) {
        grid.innerHTML = `<div class="empty-state">No gallery photos match this filter.</div>`;
        return;
    }

    grid.innerHTML = displayImages.map(img => `
        <div class="gallery-item reveal">
            <img src="${img.src}" alt="${img.alt}" loading="lazy"
                onclick="openLightbox('${img.src}', '${img.alt.replace(/'/g, "\\'")}')"
                onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';">
        </div>
    `).join("") + (remainingImages > 0 && !isFullGalleryPage ? `
        <div class="gallery-view-all-wrap">
            <a class="gallery-view-all-btn" href="gallery.html">
                <i class="fas fa-images"></i>
                <span>View All Photos</span>
                <small>+${remainingImages}</small>
            </a>
        </div>
    ` : "");
    setupAnimations();
}

function showAllGalleryPhotos() {
    window.location.href = "gallery.html";
}

// --- FILTERS ---
function filterApartments(location) {
    renderApartments(location);
    document.getElementById("apartments")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function bindDestinationCards() {
    document.querySelectorAll(".destination-card[data-location]").forEach(card => {
        const location = card.dataset.location;
        card.addEventListener("click", () => filterApartments(location));
        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                filterApartments(location);
            }
        });
    });
}

function syncDestinationCards(location) {
    document.querySelectorAll(".destination-card[data-location]").forEach(card => {
        const isActive = card.dataset.location === location;
        card.classList.toggle("active", isActive);
        card.setAttribute("aria-pressed", String(isActive));
    });
}

function bindGalleryFilters() {
    const locationDropdown = document.getElementById("galleryLocationDropdown");
    const locationTrigger = locationDropdown?.querySelector(".gallery-location-trigger");
    const locationLabel = document.getElementById("galleryLocationLabel");

    if (locationDropdown && locationTrigger) {
        locationTrigger.addEventListener("click", () => {
            const isOpen = locationDropdown.classList.toggle("open");
            locationTrigger.setAttribute("aria-expanded", String(isOpen));
        });

        locationDropdown.querySelectorAll(".gallery-location-option").forEach(option => {
            option.addEventListener("click", () => {
                activeGalleryLocation = option.dataset.location;
                galleryExpanded = false;
                if (locationLabel) locationLabel.textContent = option.textContent.trim();
                locationDropdown.querySelectorAll(".gallery-location-option").forEach(item => {
                    const isActive = item === option;
                    item.classList.toggle("active", isActive);
                    item.setAttribute("aria-selected", String(isActive));
                });
                locationDropdown.classList.remove("open");
                locationTrigger.setAttribute("aria-expanded", "false");
                renderGallery();
            });
        });

        document.addEventListener("click", event => {
            if (!locationDropdown.contains(event.target)) {
                locationDropdown.classList.remove("open");
                locationTrigger.setAttribute("aria-expanded", "false");
            }
        });
    }

    document.querySelectorAll(".gallery-category-filter").forEach(button => {
        button.addEventListener("click", () => {
            activeGalleryCategory = button.dataset.category;
            galleryExpanded = false;
            setActiveButton(".gallery-category-filter", button);
            renderGallery();
        });
    });
}

function setActiveButton(selector, activeButton) {
    document.querySelectorAll(selector).forEach(button => button.classList.remove("active"));
    activeButton.classList.add("active");
}

function changeCardImage(propertyId, imageIndex) {
    const apartment = apartments.find(apt => apt.id === propertyId);
    const card = document.querySelector(`.apartment-showcase-card[data-property-id="${propertyId}"]`);
    if (!apartment || !card || !apartment.images[imageIndex]) return;

    const mainImage = card.querySelector(".apartment-main-image");
    const nextSrc = apartment.images[imageIndex];
    mainImage.style.opacity = "0.45";
    preloadImage(nextSrc).then(loadedSrc => {
        mainImage.src = loadedSrc;
        mainImage.alt = `${apartment.title} property image ${imageIndex + 1}`;
        mainImage.style.opacity = "1";
    });
    card.dataset.currentImageIndex = String(imageIndex);

    card.querySelectorAll(".apartment-thumbnail").forEach(button => {
        button.classList.toggle("active", Number(button.dataset.imageIndex) === imageIndex);
    });
}

function changeCardSlide(propertyId, direction) {
    const apartment = apartments.find(apt => apt.id === propertyId);
    const card = document.querySelector(`.apartment-showcase-card[data-property-id="${propertyId}"]`);
    if (!apartment || !card) return;

    const currentIndex = Number(card.dataset.currentImageIndex || 0);
    const nextIndex = (currentIndex + direction + apartment.images.length) % apartment.images.length;
    changeCardImage(propertyId, nextIndex);
}

function handleImageError(image) {
    image.onerror = null;
    image.src = FALLBACK_IMAGE;
}

// --- MODAL ---
function openModal(id) {
    document.getElementById(id)?.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal(id) {
    document.getElementById(id)?.classList.remove("active");
    document.body.style.overflow = "auto";
}

function openApartmentModal(id) {
    currentApt = apartments.find(a => a.id === id);
    if (!currentApt) return;
    currentSlideIndex = 0;
    updateModalContent();
    openModal("aptModal");
}

function updateModalContent() {
    if (!currentApt) return;
    const modalImg = document.getElementById("modalImg");
    modalImg.src = currentApt.images[currentSlideIndex];
    modalImg.alt = `Luna and Leaf ${currentApt.location} apartment photo ${currentSlideIndex + 1}`;
    document.getElementById("modalTitle").textContent = currentApt.title;
    document.getElementById("modalLocation").textContent = currentApt.address;
    document.getElementById("modalGuests").innerHTML = `<i class="fas fa-user"></i> ${currentApt.guests} Guests`;
    document.getElementById("modalBeds").innerHTML = `<i class="fas fa-bed"></i> ${currentApt.beds} ${currentApt.beds === 1 ? "Bedroom" : "Bedrooms"}`;
    document.getElementById("modalDesc").textContent = currentApt.description;
    document.getElementById("modalAmenities").innerHTML = currentApt.amenities.map(am => `<li><i class="fas fa-check"></i> ${am}</li>`).join("");
    document.getElementById("modalWhatsapp").href = buildWhatsAppUrl(currentApt);
}

function changeSlide(direction) {
    if (!currentApt) return;
    currentSlideIndex = (currentSlideIndex + direction + currentApt.images.length) % currentApt.images.length;
    updateModalContent();
}

// --- LIGHTBOX ---
function openLightbox(src, alt = "Property gallery image") {
    const lightboxImg = document.getElementById("lightboxImg");
    lightboxImg.alt = alt;
    document.getElementById("lightbox").classList.add("active");
    lightboxImg.style.opacity = "0";
    preloadImage(src).then(loadedSrc => {
        lightboxImg.src = loadedSrc;
        lightboxImg.style.opacity = "1";
    });
}

function closeLightbox() {
    document.getElementById("lightbox").classList.remove("active");
}

// --- MAPS ---
function bindMapTabs() {
    document.querySelectorAll(".map-tab").forEach(button => {
        button.addEventListener("click", () => switchMap(button.dataset.location));
    });
    switchMap("shimla");
}

function switchMap(location) {
    document.querySelectorAll(".map-tab").forEach(tab => {
        const isActive = tab.dataset.location === location;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
    });
    document.querySelectorAll(".map-frame").forEach(frame => frame.classList.toggle("active", frame.dataset.location === location));
    document.querySelectorAll(".location-address").forEach(address => address.classList.toggle("active", address.dataset.location === location));
}

// --- WHATSAPP & BOOKING ---
function buildWhatsAppUrl(apartment) {
    return getApartmentWhatsAppUrl(apartment);
}

function getApartmentWhatsAppUrl(apartment) {
    const message =
        `Hello Luna & Leaf Stays, I am interested in the ${apartment.title}. ` +
        `Please share its availability, pricing and booking details.`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function handleBooking(e) {
    e.preventDefault();
    const form = e.target;
    const selectedProperty = apartments.find(apt => apt.citySlug === form.property.value);
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const checkin = form.checkin.value;
    const checkout = form.checkout.value;
    const guests = Number(form.guests.value);
    const message = form.message.value.trim();

    if (!name || !phone || !selectedProperty || !checkin || !checkout || guests < 1) {
        showToast("Please complete all required booking fields.");
        return;
    }

    if (new Date(checkout) < new Date(checkin)) {
        showToast("Check-out date cannot be before check-in.");
        return;
    }

    const whatsappMessage = `Hello Luna & Leaf Stays,

I want to check availability.

Name: ${name}
Phone: ${phone}
Property: ${selectedProperty.title}
Location: ${selectedProperty.location}
Check-in: ${checkin}
Check-out: ${checkout}
Guests: ${guests}
Message: ${message || "N/A"}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`, "_blank", "noopener,noreferrer");
    form.reset();
    setupDates();
}

function setupDates() {
    const form = document.getElementById("bookingForm");
    if (!form) return;
    const today = new Date().toISOString().split("T")[0];
    form.checkin.min = today;
    form.checkout.min = form.checkin.value || today;
    if (form.dataset.datesBound === "true") return;
    form.dataset.datesBound = "true";
    form.checkin.addEventListener("change", () => {
        form.checkout.min = form.checkin.value || today;
        if (form.checkout.value && form.checkout.value < form.checkin.value) {
            form.checkout.value = form.checkin.value;
        }
    });
}

// --- UI HELPERS ---
function showToast(msg) {
    const toast = document.getElementById("toast");
    document.getElementById("toastMsg").innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

function setupAnimations() {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("active");
        });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
}

function setupKeyboardControls() {
    document.addEventListener("keydown", event => {
        const aptModal = document.getElementById("aptModal");
        if (event.key === "Escape") {
            closeModal("aptModal");
            closeLightbox();
        }
        if (aptModal?.classList.contains("active")) {
            if (event.key === "ArrowRight") changeSlide(1);
            if (event.key === "ArrowLeft") changeSlide(-1);
        }
    });
}

// --- NAV & SCROLL ---
window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    if (document.body.classList.contains("gallery-page") || window.scrollY > 50) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
});

document.getElementById("hamburger").addEventListener("click", () => {
    document.getElementById("nav-menu").classList.toggle("active");
    const icon = document.querySelector(".hamburger i");
    if (document.getElementById("nav-menu").classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
        icon.style.color = "var(--color-charcoal)";
    } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
        icon.style.color = window.scrollY > 50 ? "var(--color-charcoal)" : "var(--color-white)";
    }
});

function closeMenu() {
    document.getElementById("nav-menu").classList.remove("active");
    const icon = document.querySelector(".hamburger i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
}

window.onclick = function (event) {
    if (event.target.classList.contains("modal-overlay")) {
        event.target.classList.remove("active");
        document.body.style.overflow = "auto";
    }
    if (event.target.id === "lightbox") closeLightbox();
};

// Stats Counter Animation
const statsSection = document.getElementById("stats");
let statsAnimated = false;
const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
        const counters = document.querySelectorAll(".counter");
        counters.forEach(counter => {
            const target = +counter.getAttribute("data-target");
            const isFloat = target % 1 !== 0;
            let count = 0;
            const increment = target / 50;
            const updateCount = () => {
                count += increment;
                if (count < target) {
                    counter.innerText = isFloat ? count.toFixed(1) : Math.ceil(count);
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = isFloat ? target.toFixed(1) : target + (target === 100 ? "+" : "");
                }
            };
            updateCount();
        });
        statsAnimated = true;
    }
}, { threshold: 0.5 });
if (statsSection) statsObserver.observe(statsSection);
