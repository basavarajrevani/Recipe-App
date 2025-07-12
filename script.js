// DOM Elements
const searchBox = document.querySelector('.searchBox');
const searchButton = document.querySelector('.searchButton');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeDetails = document.querySelector('.recipe-details');
const recipeCloseBtn = document.querySelector('.recipe-close-button');

// New elements for enhanced features
const themeToggle = document.getElementById('themeToggle');
const favoritesBtn = document.getElementById('favoritesBtn');
const favoritesModal = document.getElementById('favoritesModal');
const favoritesCloseBtn = document.getElementById('favoritesCloseBtn');
const favoritesContainer = document.getElementById('favoritesContainer');
const favoritesCount = document.querySelector('.favorites-count');
const categoryFilter = document.getElementById('categoryFilter');
const areaFilter = document.getElementById('areaFilter');

// Timer elements
const timerBtn = document.getElementById('timerBtn');
const timerModal = document.getElementById('timerModal');
const timerCloseBtn = document.getElementById('timerCloseBtn');
const timerContainer = document.getElementById('timerContainer');
const activeTimers = document.getElementById('activeTimers');
const timerCount = document.querySelector('.timer-count');
const addTimerBtn = document.getElementById('addTimerBtn');
const timerMinutes = document.getElementById('timerMinutes');
const timerSeconds = document.getElementById('timerSeconds');
const timerLabel = document.getElementById('timerLabel');

// Shopping list elements
const shoppingBtn = document.getElementById('shoppingBtn');
const shoppingModal = document.getElementById('shoppingModal');
const shoppingCloseBtn = document.getElementById('shoppingCloseBtn');
const shoppingContainer = document.getElementById('shoppingContainer');
const shoppingCount = document.querySelector('.shopping-count');
const clearShoppingBtn = document.getElementById('clearShoppingBtn');
const printShoppingBtn = document.getElementById('printShoppingBtn');

// Collections elements
const collectionsBtn = document.getElementById('collectionsBtn');
const collectionsModal = document.getElementById('collectionsModal');
const collectionsCloseBtn = document.getElementById('collectionsCloseBtn');
const collectionsContainer = document.getElementById('collectionsContainer');
const collectionsCount = document.querySelector('.collections-count');
const newCollectionBtn = document.getElementById('newCollectionBtn');

// Random recipe button
const randomRecipeBtn = document.getElementById('randomRecipeBtn');

// Accessibility elements
const accessibilityBtn = document.getElementById('accessibilityBtn');
const accessibilityModal = document.getElementById('accessibilityModal');
const accessibilityCloseBtn = document.getElementById('accessibilityCloseBtn');

// State management
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentTheme = localStorage.getItem('theme') || 'light';
let allRecipes = [];
let currentSearchQuery = '';

// Timer management
let timers = [];
let timerIdCounter = 0;

// Shopping list management
let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
let shoppingIdCounter = 0;

// Recipe notes and ratings management
let recipeNotes = JSON.parse(localStorage.getItem('recipeNotes')) || {};
let recipeRatings = JSON.parse(localStorage.getItem('recipeRatings')) || {};
let cookingHistory = JSON.parse(localStorage.getItem('cookingHistory')) || [];

// Collections management
let collections = JSON.parse(localStorage.getItem('collections')) || [];
let collectionIdCounter = parseInt(localStorage.getItem('collectionIdCounter')) || 0;

// Accessibility settings
let accessibilitySettings = JSON.parse(localStorage.getItem('accessibilitySettings')) || {
    fontSize: 'medium',
    highContrast: false,
    textToSpeech: false,
    readingMode: false,
    keyboardNavigation: false
};

// Initialize app
const initializeApp = () => {
    // Set theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    updateFavoritesCount();
    updateTimerCount();
    updateShoppingCount();
    updateCollectionsCount();
    applyAccessibilitySettings();

    // Add event listeners
    setupEventListeners();
};

// Theme Management
const toggleTheme = () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
};

const updateThemeIcon = () => {
    const icon = themeToggle.querySelector('i');
    icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
};

// Favorites Management
const toggleFavorite = (recipe) => {
    const index = favorites.findIndex(fav => fav.idMeal === recipe.idMeal);

    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(recipe);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
    updateFavoriteButtons();
};

const isFavorite = (recipeId) => {
    return favorites.some(fav => fav.idMeal === recipeId);
};

const updateFavoritesCount = () => {
    favoritesCount.textContent = favorites.length;
};

// Timer Management Functions
const updateTimerCount = () => {
    timerCount.textContent = timers.length;
};

const createTimer = (minutes, seconds, label) => {
    const totalSeconds = (minutes * 60) + seconds;
    if (totalSeconds <= 0) return;

    const timer = {
        id: ++timerIdCounter,
        label: label || `Timer ${timerIdCounter}`,
        totalSeconds: totalSeconds,
        remainingSeconds: totalSeconds,
        isRunning: false,
        isFinished: false,
        interval: null
    };

    timers.push(timer);
    updateTimerCount();
    renderTimers();
    return timer;
};

const startTimer = (timerId) => {
    const timer = timers.find(t => t.id === timerId);
    if (!timer || timer.isFinished) return;

    timer.isRunning = true;
    timer.interval = setInterval(() => {
        timer.remainingSeconds--;

        if (timer.remainingSeconds <= 0) {
            timer.remainingSeconds = 0;
            timer.isRunning = false;
            timer.isFinished = true;
            clearInterval(timer.interval);
            playTimerAlert();
            showTimerNotification(timer.label);
        }

        renderTimers();
    }, 1000);

    renderTimers();
};

const pauseTimer = (timerId) => {
    const timer = timers.find(t => t.id === timerId);
    if (!timer) return;

    timer.isRunning = false;
    clearInterval(timer.interval);
    renderTimers();
};

const stopTimer = (timerId) => {
    const timer = timers.find(t => t.id === timerId);
    if (!timer) return;

    timer.isRunning = false;
    timer.remainingSeconds = timer.totalSeconds;
    timer.isFinished = false;
    clearInterval(timer.interval);
    renderTimers();
};

const deleteTimer = (timerId) => {
    const timerIndex = timers.findIndex(t => t.id === timerId);
    if (timerIndex === -1) return;

    const timer = timers[timerIndex];
    if (timer.interval) {
        clearInterval(timer.interval);
    }

    timers.splice(timerIndex, 1);
    updateTimerCount();
    renderTimers();
};

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const playTimerAlert = () => {
    // Create audio context for timer alert
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);

        // Play multiple beeps
        setTimeout(() => {
            const oscillator2 = audioContext.createOscillator();
            const gainNode2 = audioContext.createGain();
            oscillator2.connect(gainNode2);
            gainNode2.connect(audioContext.destination);
            oscillator2.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
            oscillator2.start();
            oscillator2.stop(audioContext.currentTime + 0.5);
        }, 600);
    } catch (error) {
        console.log('Audio not supported');
    }
};

const showTimerNotification = (label) => {
    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Timer Finished!', {
            body: `${label} is complete!`,
            icon: 'https://cdn-icons-png.flaticon.com/512/4039/4039970.png'
        });
    }

    // Show visual alert
    const alertDiv = document.createElement('div');
    alertDiv.className = 'timer-alert';
    alertDiv.innerHTML = `
        <div class="timer-alert-content">
            <i class="fas fa-bell"></i>
            <h3>Timer Finished!</h3>
            <p>${label} is complete!</p>
            <button onclick="this.parentElement.parentElement.remove()">OK</button>
        </div>
    `;
    document.body.appendChild(alertDiv);

    // Auto remove after 10 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 10000);
};

const renderTimers = () => {
    if (timers.length === 0) {
        activeTimers.innerHTML = `
            <div class="timer-empty">
                <i class="fas fa-clock"></i>
                <h3>No active timers</h3>
                <p>Add a timer to get started with cooking assistance!</p>
            </div>
        `;
        return;
    }

    activeTimers.innerHTML = timers.map(timer => `
        <div class="timer-item ${timer.isFinished ? 'finished' : timer.isRunning ? 'running' : ''}">
            <div class="timer-info">
                <div class="timer-label">${timer.label}</div>
                <div class="timer-display ${timer.isFinished ? 'finished' : ''}">${formatTime(timer.remainingSeconds)}</div>
            </div>
            <div class="timer-actions">
                ${!timer.isFinished ? `
                    <button class="timer-action-btn ${timer.isRunning ? 'pause' : 'play'}"
                            onclick="${timer.isRunning ? 'pauseTimer' : 'startTimer'}(${timer.id})"
                            title="${timer.isRunning ? 'Pause' : 'Start'}">
                        <i class="fas fa-${timer.isRunning ? 'pause' : 'play'}"></i>
                    </button>
                    <button class="timer-action-btn stop" onclick="stopTimer(${timer.id})" title="Reset">
                        <i class="fas fa-stop"></i>
                    </button>
                ` : ''}
                <button class="timer-action-btn delete" onclick="deleteTimer(${timer.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
};

// Timer modal functions
const showTimerModal = () => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    timerModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        timerModal.classList.add('active');
    }, 10);
    renderTimers();
};

const closeTimerModal = () => {
    timerModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    setTimeout(() => {
        timerModal.style.display = 'none';
    }, 300);
};

// Shopping List Management Functions
const updateShoppingCount = () => {
    shoppingCount.textContent = shoppingList.length;
};

const addToShoppingList = (ingredients, recipeName) => {
    ingredients.forEach(ingredient => {
        const cleanIngredient = ingredient.trim();
        if (!cleanIngredient) return;

        // Check if ingredient already exists
        const existingItem = shoppingList.find(item =>
            item.name.toLowerCase() === cleanIngredient.toLowerCase()
        );

        if (existingItem) {
            existingItem.quantity += 1;
            existingItem.recipes.push(recipeName);
        } else {
            shoppingList.push({
                id: ++shoppingIdCounter,
                name: cleanIngredient,
                quantity: 1,
                completed: false,
                category: categorizeIngredient(cleanIngredient),
                recipes: [recipeName]
            });
        }
    });

    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    updateShoppingCount();
};

const categorizeIngredient = (ingredient) => {
    const categories = {
        'Produce': ['onion', 'garlic', 'tomato', 'potato', 'carrot', 'celery', 'pepper', 'lettuce', 'spinach', 'herbs', 'lemon', 'lime', 'apple', 'banana'],
        'Meat & Seafood': ['chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp', 'turkey', 'lamb', 'bacon', 'sausage'],
        'Dairy': ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'eggs'],
        'Pantry': ['flour', 'sugar', 'salt', 'pepper', 'oil', 'vinegar', 'rice', 'pasta', 'beans', 'spices', 'sauce'],
        'Frozen': ['frozen', 'ice cream'],
        'Bakery': ['bread', 'rolls', 'bagels']
    };

    const lowerIngredient = ingredient.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => lowerIngredient.includes(keyword))) {
            return category;
        }
    }
    return 'Other';
};

const toggleShoppingItem = (itemId) => {
    const item = shoppingList.find(item => item.id === itemId);
    if (item) {
        item.completed = !item.completed;
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
        renderShoppingList();
    }
};

const removeShoppingItem = (itemId) => {
    const itemIndex = shoppingList.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        shoppingList.splice(itemIndex, 1);
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
        updateShoppingCount();
        renderShoppingList();
    }
};

const clearShoppingList = () => {
    if (confirm('Are you sure you want to clear the entire shopping list?')) {
        shoppingList = [];
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
        updateShoppingCount();
        renderShoppingList();
    }
};

const printShoppingList = () => {
    const printWindow = window.open('', '_blank');
    const categories = groupShoppingByCategory();

    printWindow.document.write(`
        <html>
        <head>
            <title>Shopping List</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #4caf50; }
                h2 { color: #333; border-bottom: 2px solid #4caf50; }
                .category { margin-bottom: 20px; }
                .item { margin: 5px 0; padding: 5px; }
                .completed { text-decoration: line-through; color: #999; }
                .quantity { background: #4caf50; color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.8em; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <h1>🛒 Shopping List</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            ${Object.entries(categories).map(([category, items]) => `
                <div class="category">
                    <h2>${category}</h2>
                    ${items.map(item => `
                        <div class="item ${item.completed ? 'completed' : ''}">
                            ☐ ${item.name}
                            ${item.quantity > 1 ? `<span class="quantity">${item.quantity}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.print();
};

const groupShoppingByCategory = () => {
    const categories = {};
    shoppingList.forEach(item => {
        if (!categories[item.category]) {
            categories[item.category] = [];
        }
        categories[item.category].push(item);
    });
    return categories;
};

const renderShoppingList = () => {
    if (shoppingList.length === 0) {
        shoppingContainer.innerHTML = `
            <div class="shopping-empty">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your shopping list is empty</h3>
                <p>Add ingredients from recipes to start building your shopping list!</p>
            </div>
        `;
        return;
    }

    const categories = groupShoppingByCategory();

    shoppingContainer.innerHTML = `
        <div class="shopping-categories">
            ${Object.entries(categories).map(([category, items]) => `
                <div class="shopping-category">
                    <div class="shopping-category-title">
                        <i class="fas fa-${getCategoryIcon(category)}"></i>
                        ${category} (${items.length})
                    </div>
                    <div class="shopping-items">
                        ${items.map(item => `
                            <div class="shopping-item ${item.completed ? 'completed' : ''}">
                                <div class="shopping-item-info">
                                    <input type="checkbox" class="shopping-item-checkbox"
                                           ${item.completed ? 'checked' : ''}
                                           onchange="toggleShoppingItem(${item.id})">
                                    <span class="shopping-item-text">${item.name}</span>
                                </div>
                                <div class="shopping-item-actions">
                                    ${item.quantity > 1 ? `<span class="shopping-item-quantity">${item.quantity}</span>` : ''}
                                    <button class="shopping-item-btn remove" onclick="removeShoppingItem(${item.id})" title="Remove">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
};

const getCategoryIcon = (category) => {
    const icons = {
        'Produce': 'leaf',
        'Meat & Seafood': 'fish',
        'Dairy': 'cheese',
        'Pantry': 'box',
        'Frozen': 'snowflake',
        'Bakery': 'bread-slice',
        'Other': 'shopping-basket'
    };
    return icons[category] || 'shopping-basket';
};

// Shopping modal functions
const showShoppingModal = () => {
    shoppingModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        shoppingModal.classList.add('active');
    }, 10);
    renderShoppingList();
};

const closeShoppingModal = () => {
    shoppingModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    setTimeout(() => {
        shoppingModal.style.display = 'none';
    }, 300);
};

// Collections Management Functions
const updateCollectionsCount = () => {
    collectionsCount.textContent = collections.length;
};

const createCollection = (name, description = '') => {
    const collection = {
        id: ++collectionIdCounter,
        name: name,
        description: description,
        recipes: [],
        createdAt: new Date().toISOString(),
        color: getRandomColor()
    };

    collections.push(collection);
    localStorage.setItem('collections', JSON.stringify(collections));
    localStorage.setItem('collectionIdCounter', collectionIdCounter.toString());
    updateCollectionsCount();
    return collection;
};

const getRandomColor = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
    return colors[Math.floor(Math.random() * colors.length)];
};

const addRecipeToCollection = (collectionId, recipe) => {
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
        // Check if recipe already exists in collection
        const exists = collection.recipes.some(r => r.idMeal === recipe.idMeal);
        if (!exists) {
            collection.recipes.push(recipe);
            localStorage.setItem('collections', JSON.stringify(collections));
            showToast(`Recipe added to "${collection.name}"!`);
            return true;
        } else {
            showToast(`Recipe already in "${collection.name}"!`, 'error');
            return false;
        }
    }
    return false;
};

const removeRecipeFromCollection = (collectionId, recipeId) => {
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
        collection.recipes = collection.recipes.filter(r => r.idMeal !== recipeId);
        localStorage.setItem('collections', JSON.stringify(collections));
        renderCollections();
    }
};

const deleteCollection = (collectionId) => {
    const collection = collections.find(c => c.id === collectionId);
    if (collection && confirm(`Are you sure you want to delete "${collection.name}"?`)) {
        collections = collections.filter(c => c.id !== collectionId);
        localStorage.setItem('collections', JSON.stringify(collections));
        updateCollectionsCount();
        renderCollections();
        showToast('Collection deleted!');
    }
};

const renderCollections = () => {
    if (collections.length === 0) {
        collectionsContainer.innerHTML = `
            <div class="collections-empty">
                <i class="fas fa-folder-open"></i>
                <h3>No collections yet</h3>
                <p>Create your first collection to organize your favorite recipes!</p>
                <button class="create-first-collection-btn" onclick="promptNewCollection()">
                    <i class="fas fa-plus"></i> Create Collection
                </button>
            </div>
        `;
        return;
    }

    collectionsContainer.innerHTML = `
        <div class="collections-grid">
            ${collections.map(collection => `
                <div class="collection-card" style="border-left: 4px solid ${collection.color}">
                    <div class="collection-header">
                        <h3>${collection.name}</h3>
                        <div class="collection-actions">
                            <button class="collection-action-btn" onclick="viewCollection(${collection.id})" title="View Collection">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="collection-action-btn delete" onclick="deleteCollection(${collection.id})" title="Delete Collection">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <p class="collection-description">${collection.description || 'No description'}</p>
                    <div class="collection-stats">
                        <span class="recipe-count">${collection.recipes.length} recipe${collection.recipes.length !== 1 ? 's' : ''}</span>
                        <span class="created-date">Created ${new Date(collection.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="collection-preview">
                        ${collection.recipes.slice(0, 3).map(recipe => `
                            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="preview-image">
                        `).join('')}
                        ${collection.recipes.length > 3 ? `<span class="more-count">+${collection.recipes.length - 3}</span>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
};

const promptNewCollection = () => {
    const name = prompt('Enter collection name:');
    if (name && name.trim()) {
        const description = prompt('Enter collection description (optional):') || '';
        createCollection(name.trim(), description.trim());
        renderCollections();
        showToast('Collection created!');
    }
};

const viewCollection = (collectionId) => {
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return;

    closeCollectionsModal();

    // Display collection recipes in main container
    recipeContainer.innerHTML = `
        <div class="collection-view">
            <div class="collection-view-header">
                <h2 style="color: ${collection.color}">
                    <i class="fas fa-folder"></i> ${collection.name}
                </h2>
                <p>${collection.description}</p>
                <button class="back-to-search-btn" onclick="showWelcomeMessage()">
                    <i class="fas fa-arrow-left"></i> Back to Search
                </button>
            </div>
            <div class="collection-recipes">
                ${collection.recipes.length === 0 ? `
                    <div class="empty-collection">
                        <i class="fas fa-folder-open"></i>
                        <h3>No recipes in this collection</h3>
                        <p>Search for recipes and add them to this collection!</p>
                    </div>
                ` : collection.recipes.map(meal => `
                    <div class="recipe" data-id="${meal.idMeal}">
                        <div class="recipe-image-container">
                            <div class="recipe-badges">
                                <div class="recipe-badge time">
                                    <i class="fas fa-clock"></i>
                                    ${meal.cookTime || '30 min'}
                                </div>
                                <div class="recipe-badge difficulty">
                                    <i class="fas fa-signal"></i>
                                    ${meal.difficulty || 'Medium'}
                                </div>
                            </div>
                            <button class="favorite-heart ${isFavorite(meal.idMeal) ? 'favorited' : ''}" data-id="${meal.idMeal}" onclick="toggleFavorite(${JSON.stringify(meal).replace(/"/g, '&quot;')})">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="remove-from-collection-btn" onclick="removeRecipeFromCollection(${collectionId}, '${meal.idMeal}')" title="Remove from collection">
                                <i class="fas fa-times"></i>
                            </button>
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" onerror="handleImageError(this)">
                            <div class="recipe-overlay">
                                <button class="recipe-btn">
                                    <i class="fas fa-utensils"></i>
                                    View Recipe
                                </button>
                            </div>
                        </div>
                        <div class="recipe-content">
                            <h3>${meal.strMeal}</h3>
                            <p><i class="fas fa-tag"></i> <span>Category:</span> ${meal.strCategory}</p>
                            <p><i class="fas fa-globe-americas"></i> <span>Area:</span> ${meal.strArea}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};

const showWelcomeMessage = () => {
    recipeContainer.innerHTML = `
        <div class="error-container welcome">
            <img src="https://cdn-icons-png.flaticon.com/512/2276/2276931.png" alt="Welcome">
            <h3>Welcome to Recipe Explorer!</h3>
            <p>Discover thousands of delicious recipes from around the world</p>
            <div class="suggestion-container">
                <p>Start by searching for:</p>
                <div class="suggestions">
                    <span>Butter Chicken</span>
                    <span>Spaghetti</span>
                    <span>Burger</span>
                    <span>Chocolate Cake</span>
                </div>
            </div>
        </div>
    `;
};

// Collections modal functions
const showCollectionsModal = () => {
    collectionsModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        collectionsModal.classList.add('active');
    }, 10);
    renderCollections();
};

const closeCollectionsModal = () => {
    collectionsModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    setTimeout(() => {
        collectionsModal.style.display = 'none';
    }, 300);
};

const addToCollectionFromSelect = (recipeId, selectElement) => {
    const collectionId = parseInt(selectElement.value);
    if (!collectionId) return;

    // Find the recipe data
    const recipeData = allRecipes.find(r => r.idMeal === recipeId) ||
                      favorites.find(r => r.idMeal === recipeId);

    if (recipeData) {
        addRecipeToCollection(collectionId, recipeData);
    }

    // Reset select
    selectElement.value = '';
};

// Recipe Sharing Functions
const printRecipe = (recipeId) => {
    const recipeData = getCurrentRecipeData(recipeId);
    if (!recipeData) return;

    const printWindow = window.open('', '_blank');
    const ingredients = getRecipeIngredients(recipeData);
    const instructions = getRecipeInstructions(recipeData);

    printWindow.document.write(`
        <html>
        <head>
            <title>${recipeData.strMeal} - Recipe</title>
            <style>
                body {
                    font-family: 'Georgia', serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    line-height: 1.6;
                }
                .recipe-header {
                    text-align: center;
                    border-bottom: 3px solid #ff6b6b;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .recipe-title {
                    color: #ff6b6b;
                    font-size: 2.5em;
                    margin-bottom: 10px;
                }
                .recipe-meta {
                    display: flex;
                    justify-content: space-around;
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .meta-item {
                    text-align: center;
                }
                .meta-label {
                    font-weight: bold;
                    color: #666;
                    font-size: 0.9em;
                }
                .meta-value {
                    color: #ff6b6b;
                    font-size: 1.1em;
                    font-weight: bold;
                }
                .section {
                    margin: 30px 0;
                }
                .section h2 {
                    color: #333;
                    border-bottom: 2px solid #4ecdc4;
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                }
                .ingredients {
                    columns: 2;
                    column-gap: 30px;
                }
                .ingredient {
                    margin: 8px 0;
                    break-inside: avoid;
                }
                .instruction {
                    margin: 15px 0;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border-left: 4px solid #4ecdc4;
                }
                .step-number {
                    background: #ff6b6b;
                    color: white;
                    width: 25px;
                    height: 25px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 10px;
                    font-weight: bold;
                }
                @media print {
                    body { margin: 0; padding: 15px; }
                    .recipe-header { page-break-after: avoid; }
                    .section { page-break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            <div class="recipe-header">
                <h1 class="recipe-title">${recipeData.strMeal}</h1>
                <div class="recipe-meta">
                    <div class="meta-item">
                        <div class="meta-label">Category</div>
                        <div class="meta-value">${recipeData.strCategory}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Cuisine</div>
                        <div class="meta-value">${recipeData.strArea}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Servings</div>
                        <div class="meta-value">${recipeData.servings || '4'}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Cook Time</div>
                        <div class="meta-value">${recipeData.cookTime || '30 min'}</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>🥘 Ingredients</h2>
                <div class="ingredients">
                    ${ingredients.map(ingredient => `
                        <div class="ingredient">• ${ingredient}</div>
                    `).join('')}
                </div>
            </div>

            <div class="section">
                <h2>👨‍🍳 Instructions</h2>
                ${instructions.map((instruction, index) => `
                    <div class="instruction">
                        <span class="step-number">${index + 1}</span>
                        ${instruction}
                    </div>
                `).join('')}
            </div>

            <div style="text-align: center; margin-top: 40px; color: #666; font-size: 0.9em;">
                Recipe from Recipe Explorer • Generated on ${new Date().toLocaleDateString()}
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.print();
};

const getCurrentRecipeData = (recipeId) => {
    // Try to get from current recipe details
    const recipeElement = document.querySelector(`[data-recipe-id="${recipeId}"]`);
    if (recipeElement) {
        const recipeName = document.querySelector('.recipeName').textContent.trim();
        const recipeData = allRecipes.find(r => r.idMeal === recipeId) ||
                          favorites.find(r => r.idMeal === recipeId);
        return recipeData;
    }
    return null;
};

const getRecipeIngredients = (recipeData) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (recipeData[`strIngredient${i}`]) {
            ingredients.push(`${recipeData[`strIngredient${i}`]} - ${recipeData[`strMeasure${i}`]}`);
        }
    }
    return ingredients;
};

const getRecipeInstructions = (recipeData) => {
    return recipeData.strInstructions.split('\r\n').filter(step => step.trim() !== '');
};

const emailRecipe = (recipeId) => {
    const recipeData = getCurrentRecipeData(recipeId);
    if (!recipeData) return;

    const ingredients = getRecipeIngredients(recipeData);
    const instructions = getRecipeInstructions(recipeData);

    const subject = `Recipe: ${recipeData.strMeal}`;
    const body = `Hi there!

I wanted to share this delicious recipe with you:

🍽️ ${recipeData.strMeal}
📍 ${recipeData.strArea} Cuisine
🏷️ Category: ${recipeData.strCategory}
⏱️ Cook Time: ${recipeData.cookTime || '30 min'}
👥 Servings: ${recipeData.servings || '4'}

📝 INGREDIENTS:
${ingredients.map(ingredient => `• ${ingredient}`).join('\n')}

👨‍🍳 INSTRUCTIONS:
${instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n\n')}

${recipeData.strYoutube ? `🎥 Video Recipe: ${recipeData.strYoutube}` : ''}

Enjoy cooking!

---
Shared from Recipe Explorer`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
};

const shareRecipe = async (recipeId) => {
    const recipeData = getCurrentRecipeData(recipeId);
    if (!recipeData) return;

    const shareData = {
        title: `Recipe: ${recipeData.strMeal}`,
        text: `Check out this delicious ${recipeData.strArea} recipe for ${recipeData.strMeal}!`,
        url: window.location.href
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
            showToast('Recipe shared successfully!');
        } catch (error) {
            if (error.name !== 'AbortError') {
                fallbackShare(recipeData);
            }
        }
    } else {
        fallbackShare(recipeData);
    }
};

const fallbackShare = (recipeData) => {
    const shareText = `Check out this delicious ${recipeData.strArea} recipe for ${recipeData.strMeal}! ${window.location.href}`;

    // Create a temporary modal with sharing options
    const shareModal = document.createElement('div');
    shareModal.className = 'share-modal';
    shareModal.innerHTML = `
        <div class="share-modal-content">
            <h3>Share Recipe</h3>
            <div class="share-options">
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}" target="_blank" class="share-option twitter">
                    <i class="fab fa-twitter"></i> Twitter
                </a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="share-option facebook">
                    <i class="fab fa-facebook"></i> Facebook
                </a>
                <a href="https://wa.me/?text=${encodeURIComponent(shareText)}" target="_blank" class="share-option whatsapp">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </a>
            </div>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;

    document.body.appendChild(shareModal);
    setTimeout(() => shareModal.remove(), 10000); // Auto remove after 10 seconds
};

const copyRecipeLink = (recipeId) => {
    const url = `${window.location.origin}${window.location.pathname}#recipe-${recipeId}`;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showToast('Recipe link copied to clipboard!');
        }).catch(() => {
            fallbackCopyToClipboard(url);
        });
    } else {
        fallbackCopyToClipboard(url);
    }
};

const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showToast('Recipe link copied to clipboard!');
    } catch (err) {
        showToast('Could not copy link. Please copy manually: ' + text, 'error');
    }

    document.body.removeChild(textArea);
};

// Recipe Recommendation Functions
const getRecommendations = (currentRecipe) => {
    const recommendations = [];

    // Get similar recipes by category
    const categoryMatches = allRecipes.filter(recipe =>
        recipe.idMeal !== currentRecipe.idMeal &&
        recipe.strCategory === currentRecipe.strCategory
    ).slice(0, 3);

    // Get similar recipes by area
    const areaMatches = allRecipes.filter(recipe =>
        recipe.idMeal !== currentRecipe.idMeal &&
        recipe.strArea === currentRecipe.strArea &&
        !categoryMatches.some(cat => cat.idMeal === recipe.idMeal)
    ).slice(0, 2);

    // Get random recipes if we don't have enough
    const existingIds = [...categoryMatches, ...areaMatches].map(r => r.idMeal);
    const randomRecipes = allRecipes.filter(recipe =>
        recipe.idMeal !== currentRecipe.idMeal &&
        !existingIds.includes(recipe.idMeal)
    ).sort(() => Math.random() - 0.5).slice(0, 2);

    recommendations.push(...categoryMatches, ...areaMatches, ...randomRecipes);

    return recommendations.slice(0, 5);
};

const getPersonalizedRecommendations = () => {
    const recommendations = [];

    // Get recipes from favorite categories
    const favoriteCategories = [...new Set(favorites.map(fav => fav.strCategory))];
    const categoryRecs = allRecipes.filter(recipe =>
        favoriteCategories.includes(recipe.strCategory) &&
        !favorites.some(fav => fav.idMeal === recipe.idMeal)
    ).sort(() => Math.random() - 0.5).slice(0, 3);

    // Get highly rated recipes
    const ratedRecipes = Object.keys(recipeRatings)
        .filter(id => recipeRatings[id].rating >= 4)
        .map(id => allRecipes.find(recipe => recipe.idMeal === id))
        .filter(Boolean)
        .slice(0, 2);

    recommendations.push(...categoryRecs, ...ratedRecipes);

    return recommendations.slice(0, 5);
};

const getTrendingRecipes = () => {
    // Simulate trending based on cooking history and ratings
    const trending = allRecipes
        .map(recipe => ({
            ...recipe,
            score: (cookingHistory.filter(h => h.recipeId === recipe.idMeal).length * 2) +
                   (recipeRatings[recipe.idMeal]?.rating || 0) +
                   (favorites.some(fav => fav.idMeal === recipe.idMeal) ? 3 : 0)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

    return trending;
};

const getRandomRecipe = () => {
    if (allRecipes.length === 0) return null;
    return allRecipes[Math.floor(Math.random() * allRecipes.length)];
};

const renderRecommendations = (recommendations, title, containerId) => {
    const container = document.getElementById(containerId);
    if (!container || recommendations.length === 0) return;

    container.innerHTML = `
        <h3><i class="fas fa-lightbulb"></i> ${title}</h3>
        <div class="recommendations-grid">
            ${recommendations.map(recipe => `
                <div class="recommendation-card" data-id="${recipe.idMeal}" onclick="fetchRecipeDetails('${recipe.idMeal}')">
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" onerror="handleImageError(this)">
                    <div class="recommendation-info">
                        <h4>${recipe.strMeal}</h4>
                        <p><i class="fas fa-tag"></i> ${recipe.strCategory}</p>
                        <div class="recommendation-rating">
                            ${renderStarRating(recipe.idMeal, getRecipeRating(recipe.idMeal), false)}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
};

const showRandomRecipe = () => {
    const randomRecipe = getRandomRecipe();
    if (randomRecipe) {
        fetchRecipeDetails(randomRecipe.idMeal);
        showToast(`Random recipe: ${randomRecipe.strMeal}!`);
    } else {
        showToast('No recipes available. Try searching first!', 'error');
    }
};

// Accessibility Functions
const applyAccessibilitySettings = () => {
    // Apply font size
    document.documentElement.setAttribute('data-font-size', accessibilitySettings.fontSize);

    // Apply high contrast
    if (accessibilitySettings.highContrast) {
        document.documentElement.setAttribute('data-high-contrast', 'true');
    } else {
        document.documentElement.removeAttribute('data-high-contrast');
    }

    // Apply reading mode
    if (accessibilitySettings.readingMode) {
        document.documentElement.setAttribute('data-reading-mode', 'true');
    } else {
        document.documentElement.removeAttribute('data-reading-mode');
    }

    // Apply keyboard navigation
    if (accessibilitySettings.keyboardNavigation) {
        document.documentElement.setAttribute('data-keyboard-nav', 'true');
        enableKeyboardNavigation();
    } else {
        document.documentElement.removeAttribute('data-keyboard-nav');
    }
};

const saveAccessibilitySettings = () => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(accessibilitySettings));
};

const changeFontSize = (size) => {
    accessibilitySettings.fontSize = size;
    saveAccessibilitySettings();
    applyAccessibilitySettings();
    showToast(`Font size changed to ${size}!`);

    // Update button states
    document.querySelectorAll('.font-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="changeFontSize('${size}')"]`).classList.add('active');
};

const toggleHighContrast = () => {
    accessibilitySettings.highContrast = !accessibilitySettings.highContrast;
    saveAccessibilitySettings();
    applyAccessibilitySettings();
    showToast(`High contrast ${accessibilitySettings.highContrast ? 'enabled' : 'disabled'}!`);

    // Update button state
    const btn = document.querySelector('[onclick="toggleHighContrast()"]');
    btn.classList.toggle('active', accessibilitySettings.highContrast);
};

const toggleTextToSpeech = () => {
    accessibilitySettings.textToSpeech = !accessibilitySettings.textToSpeech;
    saveAccessibilitySettings();
    showToast(`Text to speech ${accessibilitySettings.textToSpeech ? 'enabled' : 'disabled'}!`);

    // Update button state
    const btn = document.querySelector('[onclick="toggleTextToSpeech()"]');
    btn.classList.toggle('active', accessibilitySettings.textToSpeech);

    if (accessibilitySettings.textToSpeech) {
        // Add click listeners for text-to-speech
        addTextToSpeechListeners();
    } else {
        removeTextToSpeechListeners();
    }
};

const toggleReadingMode = () => {
    accessibilitySettings.readingMode = !accessibilitySettings.readingMode;
    saveAccessibilitySettings();
    applyAccessibilitySettings();
    showToast(`Reading mode ${accessibilitySettings.readingMode ? 'enabled' : 'disabled'}!`);

    // Update button state
    const btn = document.querySelector('[onclick="toggleReadingMode()"]');
    btn.classList.toggle('active', accessibilitySettings.readingMode);
};

const toggleKeyboardNavigation = () => {
    accessibilitySettings.keyboardNavigation = !accessibilitySettings.keyboardNavigation;
    saveAccessibilitySettings();
    applyAccessibilitySettings();
    showToast(`Keyboard navigation ${accessibilitySettings.keyboardNavigation ? 'enabled' : 'disabled'}!`);

    // Update button state
    const btn = document.querySelector('[onclick="toggleKeyboardNavigation()"]');
    btn.classList.toggle('active', accessibilitySettings.keyboardNavigation);
};

const enableKeyboardNavigation = () => {
    document.addEventListener('keydown', handleKeyboardNavigation);
};

const handleKeyboardNavigation = (e) => {
    if (!accessibilitySettings.keyboardNavigation) return;

    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'f':
                e.preventDefault();
                document.querySelector('.searchBox').focus();
                break;
            case 'h':
                e.preventDefault();
                showWelcomeMessage();
                break;
            case 'r':
                e.preventDefault();
                showRandomRecipe();
                break;
            case 't':
                e.preventDefault();
                toggleTheme();
                break;
        }
    }

    // Handle escape key
    if (e.key === 'Escape') {
        // Close any open modals
        document.querySelectorAll('.modal, .favorites-modal, .shopping-modal, .timer-modal, .collections-modal, .accessibility-modal').forEach(modal => {
            if (modal.classList.contains('active')) {
                modal.classList.remove('active');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        });
        document.body.style.overflow = 'auto';
    }
};

const showKeyboardShortcuts = () => {
    const shortcutsModal = document.createElement('div');
    shortcutsModal.className = 'shortcuts-modal';
    shortcutsModal.innerHTML = `
        <div class="shortcuts-modal-content">
            <h3>Keyboard Shortcuts</h3>
            <div class="shortcuts-list">
                <div class="shortcut-item">
                    <kbd>Ctrl</kbd> + <kbd>F</kbd>
                    <span>Focus search box</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Ctrl</kbd> + <kbd>H</kbd>
                    <span>Go to home</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Ctrl</kbd> + <kbd>R</kbd>
                    <span>Random recipe</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Ctrl</kbd> + <kbd>T</kbd>
                    <span>Toggle theme</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Esc</kbd>
                    <span>Close modals</span>
                </div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;

    document.body.appendChild(shortcutsModal);
    setTimeout(() => shortcutsModal.remove(), 15000);
};

const addTextToSpeechListeners = () => {
    // Add click listeners to recipe titles and instructions for text-to-speech
    document.addEventListener('click', textToSpeechHandler);
};

const removeTextToSpeechListeners = () => {
    document.removeEventListener('click', textToSpeechHandler);
};

const textToSpeechHandler = (e) => {
    if (!accessibilitySettings.textToSpeech) return;

    // Check if clicked element contains text we should read
    const textElements = ['h1', 'h2', 'h3', 'h4', 'p', 'li', '.recipe-content'];
    const clickedElement = e.target.closest(textElements.join(','));

    if (clickedElement && clickedElement.textContent.trim()) {
        speakText(clickedElement.textContent.trim());
    }
};

const speakText = (text) => {
    if ('speechSynthesis' in window) {
        // Stop any current speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;

        speechSynthesis.speak(utterance);
        showToast('Reading text...', 'success');
    } else {
        showToast('Text-to-speech not supported in this browser', 'error');
    }
};

// Accessibility modal functions
const showAccessibilityModal = () => {
    accessibilityModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        accessibilityModal.classList.add('active');
    }, 10);

    // Update button states
    updateAccessibilityButtonStates();
};

const closeAccessibilityModal = () => {
    accessibilityModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    setTimeout(() => {
        accessibilityModal.style.display = 'none';
    }, 300);
};

const updateAccessibilityButtonStates = () => {
    // Update font size buttons
    document.querySelectorAll('.font-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="changeFontSize('${accessibilitySettings.fontSize}')"]`)?.classList.add('active');

    // Update other buttons
    document.querySelector('[onclick="toggleHighContrast()"]')?.classList.toggle('active', accessibilitySettings.highContrast);
    document.querySelector('[onclick="toggleTextToSpeech()"]')?.classList.toggle('active', accessibilitySettings.textToSpeech);
    document.querySelector('[onclick="toggleReadingMode()"]')?.classList.toggle('active', accessibilitySettings.readingMode);
    document.querySelector('[onclick="toggleKeyboardNavigation()"]')?.classList.toggle('active', accessibilitySettings.keyboardNavigation);
};

// Recipe Notes and Rating Functions
const saveRecipeNote = (recipeId, note) => {
    recipeNotes[recipeId] = {
        note: note,
        lastModified: new Date().toISOString()
    };
    localStorage.setItem('recipeNotes', JSON.stringify(recipeNotes));
};

const getRecipeNote = (recipeId) => {
    return recipeNotes[recipeId]?.note || '';
};

const saveRecipeRating = (recipeId, rating) => {
    recipeRatings[recipeId] = {
        rating: rating,
        ratedOn: new Date().toISOString()
    };
    localStorage.setItem('recipeRatings', JSON.stringify(recipeRatings));
};

const getRecipeRating = (recipeId) => {
    return recipeRatings[recipeId]?.rating || 0;
};

const addToCookingHistory = (recipeId, recipeName) => {
    const historyEntry = {
        recipeId: recipeId,
        recipeName: recipeName,
        cookedOn: new Date().toISOString(),
        id: Date.now()
    };

    // Remove existing entry for same recipe to avoid duplicates
    cookingHistory = cookingHistory.filter(entry => entry.recipeId !== recipeId);

    // Add new entry at the beginning
    cookingHistory.unshift(historyEntry);

    // Keep only last 50 entries
    if (cookingHistory.length > 50) {
        cookingHistory = cookingHistory.slice(0, 50);
    }

    localStorage.setItem('cookingHistory', JSON.stringify(cookingHistory));
};

const getLastCooked = (recipeId) => {
    const entry = cookingHistory.find(entry => entry.recipeId === recipeId);
    return entry ? new Date(entry.cookedOn).toLocaleDateString() : null;
};

const renderStarRating = (recipeId, currentRating = 0, interactive = true) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const filled = i <= currentRating;
        stars.push(`
            <span class="star ${filled ? 'filled' : ''} ${interactive ? 'interactive' : ''}"
                  ${interactive ? `onclick="setRating('${recipeId}', ${i})"` : ''}>
                <i class="fas fa-star"></i>
            </span>
        `);
    }
    return stars.join('');
};

const setRating = (recipeId, rating) => {
    saveRecipeRating(recipeId, rating);

    // Update the rating display
    const ratingContainer = document.querySelector(`[data-recipe-id="${recipeId}"] .recipe-rating`);
    if (ratingContainer) {
        ratingContainer.innerHTML = renderStarRating(recipeId, rating, true);
    }

    // Show feedback
    showToast(`Recipe rated ${rating} star${rating !== 1 ? 's' : ''}!`);
};

const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

const markAsCooked = (recipeId, recipeName) => {
    addToCookingHistory(recipeId, recipeName);
    showToast(`"${recipeName}" marked as cooked!`);

    // Update the last cooked display
    const lastCookedElement = document.querySelector('.last-cooked');
    if (lastCookedElement) {
        lastCookedElement.textContent = `Last cooked: ${new Date().toLocaleDateString()}`;
    } else {
        // Add last cooked element if it doesn't exist
        const metaElement = document.querySelector('.recipe-meta');
        if (metaElement) {
            const lastCookedDiv = document.createElement('div');
            lastCookedDiv.className = 'last-cooked';
            lastCookedDiv.textContent = `Last cooked: ${new Date().toLocaleDateString()}`;
            metaElement.appendChild(lastCookedDiv);
        }
    }
};

const saveNote = (recipeId, note) => {
    saveRecipeNote(recipeId, note.trim());
    if (note.trim()) {
        showToast('Note saved!');
    }
};

// Ingredient Scaling Functions
const parseIngredient = (ingredient) => {
    // Extract quantity and unit from ingredient string
    const regex = /^(\d+(?:\.\d+)?(?:\/\d+)?)\s*([a-zA-Z]*)\s*(.+)/;
    const match = ingredient.match(regex);

    if (match) {
        let quantity = match[1];
        const unit = match[2] || '';
        const name = match[3].trim();

        // Convert fractions to decimals
        if (quantity.includes('/')) {
            const parts = quantity.split('/');
            quantity = parseFloat(parts[0]) / parseFloat(parts[1]);
        } else {
            quantity = parseFloat(quantity);
        }

        return { quantity, unit, name, original: ingredient };
    }

    return { quantity: 1, unit: '', name: ingredient, original: ingredient };
};

const formatQuantity = (quantity) => {
    // Convert decimal to fraction if it's a common fraction
    const fractions = {
        0.125: '1/8',
        0.25: '1/4',
        0.33: '1/3',
        0.5: '1/2',
        0.67: '2/3',
        0.75: '3/4'
    };

    const rounded = Math.round(quantity * 8) / 8; // Round to nearest 1/8

    if (fractions[rounded]) {
        return fractions[rounded];
    }

    if (quantity % 1 === 0) {
        return quantity.toString();
    }

    return quantity.toFixed(2).replace(/\.?0+$/, '');
};

const scaleIngredients = (ingredients, originalServings, newServings) => {
    const scaleFactor = newServings / originalServings;

    return ingredients.map(ingredient => {
        const parsed = parseIngredient(ingredient);
        const scaledQuantity = parsed.quantity * scaleFactor;
        const formattedQuantity = formatQuantity(scaledQuantity);

        if (parsed.unit) {
            return `${formattedQuantity} ${parsed.unit} ${parsed.name}`;
        } else {
            return `${formattedQuantity} ${parsed.name}`;
        }
    });
};

const updateScaledIngredients = (recipeId, newServings) => {
    const originalServings = parseInt(document.querySelector('.original-servings').textContent);
    const ingredientsList = document.querySelector('.ingredients-list');
    const originalIngredients = JSON.parse(ingredientsList.dataset.originalIngredients);

    const scaledIngredients = scaleIngredients(originalIngredients, originalServings, newServings);

    ingredientsList.innerHTML = scaledIngredients.map(ingredient => `
        <li>
            <i class="fas fa-check-circle"></i>
            ${ingredient}
        </li>
    `).join('');

    // Update serving size display
    document.querySelector('.current-servings').textContent = newServings;

    // Update shopping list button
    const shoppingBtn = document.querySelector('.add-to-shopping-btn');
    if (shoppingBtn) {
        shoppingBtn.onclick = () => addToShoppingList(scaledIngredients, document.querySelector('.recipeName').textContent.trim());
    }
};

const updateFavoriteButtons = () => {
    const heartButtons = document.querySelectorAll('.favorite-heart');
    heartButtons.forEach(button => {
        const recipeId = button.dataset.id;
        button.classList.toggle('favorited', isFavorite(recipeId));
    });
};

// Enhanced recipe data with mock additional info
const enhanceRecipeData = (meal) => {
    // Generate mock data for demonstration
    const cookingTimes = ['15 min', '30 min', '45 min', '1 hr', '1.5 hrs'];
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const calories = ['250', '350', '450', '550', '650'];
    const servings = ['2', '4', '6', '8'];

    return {
        ...meal,
        cookTime: cookingTimes[Math.floor(Math.random() * cookingTimes.length)],
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
        calories: calories[Math.floor(Math.random() * calories.length)],
        servings: servings[Math.floor(Math.random() * servings.length)]
    };
};

// Function to handle image loading errors
const handleImageError = (img) => {
    img.classList.add('error');
    img.src = 'https://cdn-icons-png.flaticon.com/512/1147/1147931.png';
};

// Enhanced function to get recipes with filtering
const fetchRecipes = async (query, category = '', area = '') => {
    try {
        currentSearchQuery = query;
        recipeContainer.innerHTML = `
            <div class="loading">
                <img src="https://cdn-icons-png.flaticon.com/512/4039/4039970.png" alt="Loading" class="loading-icon">
                <h2>Searching for "${query}"...</h2>
                <p>Finding delicious recipes for you!</p>
            </div>
        `;

        let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.meals) {
            recipeContainer.innerHTML = `
                <div class="error-container">
                    <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="No recipes found">
                    <h3>No recipes found</h3>
                    <p>We couldn't find any recipes matching "${query}". Try another search!</p>
                    <div class="suggestion-container">
                        <p>Why not try searching for:</p>
                        <div class="suggestions">
                            <span>Chicken</span>
                            <span>Pasta</span>
                            <span>Pizza</span>
                            <span>Soup</span>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        // Store all recipes and apply filters
        allRecipes = data.meals.map(enhanceRecipeData);
        displayFilteredRecipes();

    } catch (error) {
        recipeContainer.innerHTML = `
            <div class="error-container">
                <img src="https://cdn-icons-png.flaticon.com/512/1832/1832415.png" alt="Error">
                <h3>Something went wrong</h3>
                <p>There was an error fetching the recipes. Please try again later.</p>
            </div>
        `;
        console.error('Error fetching recipes:', error);
    }
};

// Display filtered recipes
const displayFilteredRecipes = () => {
    let filteredRecipes = [...allRecipes];

    // Apply category filter
    const selectedCategory = categoryFilter.value;
    if (selectedCategory) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.strCategory === selectedCategory
        );
    }

    // Apply area filter
    const selectedArea = areaFilter.value;
    if (selectedArea) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.strArea === selectedArea
        );
    }

    if (filteredRecipes.length === 0) {
        recipeContainer.innerHTML = `
            <div class="error-container">
                <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="No recipes found">
                <h3>No recipes match your filters</h3>
                <p>Try adjusting your filters or search for different recipes.</p>
            </div>
        `;
        return;
    }

    recipeContainer.innerHTML = filteredRecipes.map(meal => `
        <div class="recipe" data-id="${meal.idMeal}">
            <div class="recipe-image-container">
                <div class="recipe-badges">
                    <div class="recipe-badge time">
                        <i class="fas fa-clock"></i>
                        ${meal.cookTime}
                    </div>
                    <div class="recipe-badge difficulty">
                        <i class="fas fa-signal"></i>
                        ${meal.difficulty}
                    </div>
                    <div class="recipe-badge calories">
                        <i class="fas fa-fire"></i>
                        ${meal.calories} cal
                    </div>
                    <div class="recipe-badge servings">
                        <i class="fas fa-users"></i>
                        ${meal.servings} servings
                    </div>
                </div>
                <button class="favorite-heart" data-id="${meal.idMeal}" onclick="toggleFavorite(${JSON.stringify(meal).replace(/"/g, '&quot;')})">
                    <i class="fas fa-heart"></i>
                </button>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" onerror="handleImageError(this)">
                <div class="recipe-overlay">
                    <button class="recipe-btn">
                        <i class="fas fa-utensils"></i>
                        View Recipe
                    </button>
                </div>
            </div>
            <div class="recipe-content">
                <h3>${meal.strMeal}</h3>
                <p><i class="fas fa-tag"></i> <span>Category:</span> ${meal.strCategory}</p>
                <p><i class="fas fa-globe-americas"></i> <span>Area:</span> ${meal.strArea}</p>
                <div class="recipe-stats">
                    <div class="recipe-stat">
                        <i class="fas fa-clock"></i>
                        ${meal.cookTime}
                    </div>
                    <div class="recipe-stat">
                        <i class="fas fa-signal"></i>
                        ${meal.difficulty}
                    </div>
                    <div class="recipe-stat">
                        <i class="fas fa-fire"></i>
                        ${meal.calories} cal
                    </div>
                </div>
                <div class="recipe-card-rating">
                    ${renderStarRating(meal.idMeal, getRecipeRating(meal.idMeal), false)}
                </div>
            </div>
        </div>
    `).join('');

    updateFavoriteButtons();
};

// Enhanced function to fetch recipe details
const fetchRecipeDetails = async (id) => {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        let meal = data.meals[0];

        // Enhance with mock data
        meal = enhanceRecipeData(meal);

        // Format ingredients list
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
            }
        }

        const currentRating = getRecipeRating(meal.idMeal);
        const currentNote = getRecipeNote(meal.idMeal);
        const lastCooked = getLastCooked(meal.idMeal);

        recipeDetailsContent.innerHTML = `
            <div data-recipe-id="${meal.idMeal}">
                <h2 class="recipeName">
                    <i class="fas fa-utensils"></i>
                    ${meal.strMeal}
                    <button class="favorite-heart" data-id="${meal.idMeal}" onclick="toggleFavorite(${JSON.stringify(meal).replace(/"/g, '&quot;')})" style="position: relative; margin-left: 15px;">
                        <i class="fas fa-heart"></i>
                    </button>
                </h2>

                <div class="recipe-meta">
                    <div class="recipe-rating">
                        <label>Rate this recipe:</label>
                        ${renderStarRating(meal.idMeal, currentRating, true)}
                    </div>
                    ${lastCooked ? `<div class="last-cooked">Last cooked: ${lastCooked}</div>` : ''}
                    <button class="cooked-btn" onclick="markAsCooked('${meal.idMeal}', '${meal.strMeal.replace(/'/g, "\\'")}')">
                        <i class="fas fa-check"></i> Mark as Cooked
                    </button>

                    <div class="add-to-collection">
                        <select class="collection-select" onchange="addToCollectionFromSelect('${meal.idMeal}', this)">
                            <option value="">Add to Collection...</option>
                            ${collections.map(collection => `
                                <option value="${collection.id}">${collection.name}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>
            <div class="recipeDetails">
                <div class="recipe-image-container">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" onerror="handleImageError(this)">
                </div>
                <div class="recipeInfo">
                    <p><i class="fas fa-tag"></i> <span>Category:</span> ${meal.strCategory}</p>
                    <p><i class="fas fa-globe-americas"></i> <span>Area:</span> ${meal.strArea}</p>
                    <p><i class="fas fa-clock"></i> <span>Cook Time:</span> ${meal.cookTime}</p>
                    <p><i class="fas fa-signal"></i> <span>Difficulty:</span> ${meal.difficulty}</p>
                    <p><i class="fas fa-fire"></i> <span>Calories:</span> ${meal.calories} per serving</p>
                    <p><i class="fas fa-users"></i> <span>Servings:</span> ${meal.servings}</p>
                    ${meal.strTags ? `<p><i class="fas fa-hashtag"></i> <span>Tags:</span> ${meal.strTags.split(',').join(', ')}</p>` : ''}
                </div>
            </div>
            <div class="ingredientlist">
                <h3><i class="fas fa-mortar-pestle"></i> Ingredients</h3>

                <div class="ingredient-controls">
                    <div class="serving-scaler">
                        <label>Adjust servings:</label>
                        <div class="serving-controls">
                            <button class="serving-btn" onclick="updateScaledIngredients('${meal.idMeal}', Math.max(1, parseInt(document.querySelector('.current-servings').textContent) - 1))">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="serving-display">
                                <span class="current-servings">${meal.servings}</span> servings
                                <small>(original: <span class="original-servings">${meal.servings}</span>)</small>
                            </span>
                            <button class="serving-btn" onclick="updateScaledIngredients('${meal.idMeal}', parseInt(document.querySelector('.current-servings').textContent) + 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>

                    <button class="add-to-shopping-btn" onclick="addToShoppingList(${JSON.stringify(ingredients).replace(/"/g, '&quot;')}, '${meal.strMeal.replace(/'/g, "\\'")}')">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Shopping List
                    </button>
                </div>

                <ul class="ingredients-list" data-original-ingredients='${JSON.stringify(ingredients)}'>
                    ${ingredients.map(ingredient => `
                        <li>
                            <i class="fas fa-check-circle"></i>
                            ${ingredient}
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="recipeInstructions">
                <h3><i class="fas fa-list-ol"></i> Instructions</h3>
                ${meal.strInstructions.split('\r\n').filter(step => step.trim() !== '').map((step, index) => `
                    <div class="instruction-step">
                        <span class="step-number">${index + 1}</span>
                        <p>${step}</p>
                    </div>
                `).join('')}
            </div>
            ${meal.strYoutube ? `
                <div class="recipeVideo">
                    <h3><i class="fab fa-youtube"></i> Video Recipe</h3>
                    <a href="${meal.strYoutube}" target="_blank" class="recipe-btn">
                        <i class="fab fa-youtube"></i> Watch Video
                    </a>
                </div>
            ` : ''}

            <div class="recipe-sharing">
                <h3><i class="fas fa-share-alt"></i> Share Recipe</h3>
                <div class="sharing-buttons">
                    <button class="share-btn print" onclick="printRecipe('${meal.idMeal}')" title="Print Recipe">
                        <i class="fas fa-print"></i>
                        Print
                    </button>
                    <button class="share-btn email" onclick="emailRecipe('${meal.idMeal}')" title="Email Recipe">
                        <i class="fas fa-envelope"></i>
                        Email
                    </button>
                    <button class="share-btn social" onclick="shareRecipe('${meal.idMeal}')" title="Share">
                        <i class="fas fa-share"></i>
                        Share
                    </button>
                    <button class="share-btn copy" onclick="copyRecipeLink('${meal.idMeal}')" title="Copy Link">
                        <i class="fas fa-link"></i>
                        Copy Link
                    </button>
                </div>
            </div>

            <div class="recipe-notes-section">
                <h3><i class="fas fa-sticky-note"></i> Personal Notes</h3>
                <textarea class="recipe-notes-input" placeholder="Add your personal notes, modifications, or cooking tips..."
                          onblur="saveNote('${meal.idMeal}', this.value)">${currentNote}</textarea>
                <div class="notes-help">
                    <small><i class="fas fa-info-circle"></i> Notes are automatically saved when you click outside the text area</small>
                </div>
            </div>

            <div class="recommendations-section" id="recommendationsSection">
                <!-- Recommendations will be loaded here -->
            </div>
            </div>
        `;

        const recipeDetails = document.querySelector('.recipe-details');
        recipeDetails.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            recipeDetails.classList.add('active');
            updateFavoriteButtons();

            // Load recommendations
            const recommendations = getRecommendations(meal);
            renderRecommendations(recommendations, 'You Might Also Like', 'recommendationsSection');
        }, 10);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
};

// Function to close recipe details
const closeRecipeDetails = () => {
    recipeDetails.classList.remove('active');
    document.body.style.overflow = 'auto';
    setTimeout(() => {
        recipeDetails.style.display = 'none';
    }, 300);
};

// Favorites modal functions
const showFavorites = () => {
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="favorites-empty">
                <i class="fas fa-heart-broken"></i>
                <h3>No favorites yet</h3>
                <p>Start adding recipes to your favorites by clicking the heart icon!</p>
            </div>
        `;
    } else {
        favoritesContainer.innerHTML = favorites.map(meal => `
            <div class="recipe" data-id="${meal.idMeal}">
                <div class="recipe-image-container">
                    <div class="recipe-badges">
                        <div class="recipe-badge time">
                            <i class="fas fa-clock"></i>
                            ${meal.cookTime}
                        </div>
                        <div class="recipe-badge difficulty">
                            <i class="fas fa-signal"></i>
                            ${meal.difficulty}
                        </div>
                    </div>
                    <button class="favorite-heart favorited" data-id="${meal.idMeal}" onclick="toggleFavorite(${JSON.stringify(meal).replace(/"/g, '&quot;')})">
                        <i class="fas fa-heart"></i>
                    </button>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" onerror="handleImageError(this)">
                    <div class="recipe-overlay">
                        <button class="recipe-btn">
                            <i class="fas fa-utensils"></i>
                            View Recipe
                        </button>
                    </div>
                </div>
                <div class="recipe-content">
                    <h3>${meal.strMeal}</h3>
                    <p><i class="fas fa-tag"></i> <span>Category:</span> ${meal.strCategory}</p>
                    <p><i class="fas fa-globe-americas"></i> <span>Area:</span> ${meal.strArea}</p>
                </div>
            </div>
        `).join('');
    }

    favoritesModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        favoritesModal.classList.add('active');
    }, 10);
};

const closeFavorites = () => {
    favoritesModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    setTimeout(() => {
        favoritesModal.style.display = 'none';
    }, 300);
};

// Setup all event listeners
const setupEventListeners = () => {
    // Search functionality
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        const searchInput = searchBox.value.trim();
        if (!searchInput) {
            recipeContainer.innerHTML = `
                <div class="error-container">
                    <img src="https://cdn-icons-png.flaticon.com/512/3787/3787262.png" alt="Empty search">
                    <h3>Looking for something specific?</h3>
                    <p>Type a dish name or ingredient in the search box to discover amazing recipes!</p>
                    <div class="suggestion-container">
                        <p>Popular searches:</p>
                        <div class="suggestions">
                            <span>Chicken Curry</span>
                            <span>Pasta</span>
                            <span>Pizza</span>
                            <span>Chocolate Cake</span>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        fetchRecipes(searchInput);
    });

    // Filter functionality
    categoryFilter.addEventListener('change', () => {
        if (allRecipes.length > 0) {
            displayFilteredRecipes();
        }
    });

    areaFilter.addEventListener('change', () => {
        if (allRecipes.length > 0) {
            displayFilteredRecipes();
        }
    });

    // Recipe interactions
    recipeContainer.addEventListener('click', (e) => {
        const recipeCard = e.target.closest('.recipe');
        if (recipeCard && !e.target.closest('.favorite-heart')) {
            const recipeId = recipeCard.dataset.id;
            fetchRecipeDetails(recipeId);
        }
    });

    // Favorites interactions
    favoritesContainer.addEventListener('click', (e) => {
        const recipeCard = e.target.closest('.recipe');
        if (recipeCard && !e.target.closest('.favorite-heart')) {
            const recipeId = recipeCard.dataset.id;
            fetchRecipeDetails(recipeId);
            closeFavorites();
        }
    });

    // Modal controls
    recipeCloseBtn.addEventListener('click', closeRecipeDetails);
    favoritesBtn.addEventListener('click', showFavorites);
    favoritesCloseBtn.addEventListener('click', closeFavorites);
    collectionsBtn.addEventListener('click', showCollectionsModal);
    collectionsCloseBtn.addEventListener('click', closeCollectionsModal);
    shoppingBtn.addEventListener('click', showShoppingModal);
    shoppingCloseBtn.addEventListener('click', closeShoppingModal);
    timerBtn.addEventListener('click', showTimerModal);
    timerCloseBtn.addEventListener('click', closeTimerModal);
    accessibilityBtn.addEventListener('click', showAccessibilityModal);
    accessibilityCloseBtn.addEventListener('click', closeAccessibilityModal);
    randomRecipeBtn.addEventListener('click', showRandomRecipe);
    themeToggle.addEventListener('click', toggleTheme);

    // Collections controls
    newCollectionBtn.addEventListener('click', promptNewCollection);

    // Shopping list controls
    clearShoppingBtn.addEventListener('click', clearShoppingList);
    printShoppingBtn.addEventListener('click', printShoppingList);

    // Timer controls
    addTimerBtn.addEventListener('click', () => {
        const minutes = parseInt(timerMinutes.value) || 0;
        const seconds = parseInt(timerSeconds.value) || 0;
        const label = timerLabel.value.trim() || `Timer ${timerIdCounter + 1}`;

        if (minutes > 0 || seconds > 0) {
            createTimer(minutes, seconds, label);
            timerMinutes.value = '5';
            timerSeconds.value = '0';
            timerLabel.value = '';
        }
    });

    // Allow Enter key to add timer
    [timerMinutes, timerSeconds, timerLabel].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTimerBtn.click();
            }
        });
    });

    // Close modals on outside click
    favoritesModal.addEventListener('click', (e) => {
        if (e.target === favoritesModal) {
            closeFavorites();
        }
    });

    collectionsModal.addEventListener('click', (e) => {
        if (e.target === collectionsModal) {
            closeCollectionsModal();
        }
    });

    shoppingModal.addEventListener('click', (e) => {
        if (e.target === shoppingModal) {
            closeShoppingModal();
        }
    });

    timerModal.addEventListener('click', (e) => {
        if (e.target === timerModal) {
            closeTimerModal();
        }
    });

    accessibilityModal.addEventListener('click', (e) => {
        if (e.target === accessibilityModal) {
            closeAccessibilityModal();
        }
    });

    recipeDetails.addEventListener('click', (e) => {
        if (e.target === recipeDetails) {
            closeRecipeDetails();
        }
    });

    // Suggestion clicks
    document.addEventListener('click', (e) => {
        if (e.target.matches('.suggestions span')) {
            searchBox.value = e.target.textContent;
            fetchRecipes(e.target.textContent);
        }
    });
};

// Initial welcome message and app initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();

    recipeContainer.innerHTML = `
        <div class="error-container welcome">
            <img src="https://cdn-icons-png.flaticon.com/512/2276/2276931.png" alt="Welcome">
            <h3>Welcome to Recipe Explorer!</h3>
            <p>Discover thousands of delicious recipes from around the world</p>
            <div class="suggestion-container">
                <p>Start by searching for:</p>
                <div class="suggestions">
                    <span>Butter Chicken</span>
                    <span>Spaghetti</span>
                    <span>Burger</span>
                    <span>Chocolate Cake</span>
                </div>
            </div>
        </div>
    `;
});

// Make functions globally available for onclick handlers
window.toggleFavorite = toggleFavorite;
window.handleImageError = handleImageError;
window.startTimer = startTimer;
window.pauseTimer = pauseTimer;
window.stopTimer = stopTimer;
window.deleteTimer = deleteTimer;
window.addToShoppingList = addToShoppingList;
window.toggleShoppingItem = toggleShoppingItem;
window.removeShoppingItem = removeShoppingItem;
window.setRating = setRating;
window.markAsCooked = markAsCooked;
window.saveNote = saveNote;
window.updateScaledIngredients = updateScaledIngredients;
window.promptNewCollection = promptNewCollection;
window.viewCollection = viewCollection;
window.deleteCollection = deleteCollection;
window.removeRecipeFromCollection = removeRecipeFromCollection;
window.addToCollectionFromSelect = addToCollectionFromSelect;
window.showWelcomeMessage = showWelcomeMessage;
window.printRecipe = printRecipe;
window.emailRecipe = emailRecipe;
window.shareRecipe = shareRecipe;
window.copyRecipeLink = copyRecipeLink;
window.showRandomRecipe = showRandomRecipe;
window.changeFontSize = changeFontSize;
window.toggleHighContrast = toggleHighContrast;
window.toggleTextToSpeech = toggleTextToSpeech;
window.toggleReadingMode = toggleReadingMode;
window.toggleKeyboardNavigation = toggleKeyboardNavigation;
window.showKeyboardShortcuts = showKeyboardShortcuts;