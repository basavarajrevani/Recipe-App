const searchBox = document.querySelector('.searchBox');
const searchButton = document.querySelector('.searchButton');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeDetails = document.querySelector('.recipe-details');
const recipeCloseBtn = document.querySelector('.recipe-close-button');

// Function to handle image loading errors
const handleImageError = (img) => {
    img.classList.add('error');
    img.src = 'https://cdn-icons-png.flaticon.com/512/1147/1147931.png';
};

// Function to get recipes
const fetchRecipes = async (query) => {
    try {
        recipeContainer.innerHTML = `
            <div class="loading">
                <img src="https://cdn-icons-png.flaticon.com/512/4039/4039970.png" alt="Loading" class="loading-icon">
                <h2>Searching for "${query}"...</h2>
                <p>Finding delicious recipes for you!</p>
            </div>
        `;

        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
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

        recipeContainer.innerHTML = `
            ${data.meals.map(meal => `
                <div class="recipe" data-id="${meal.idMeal}">
                    <div class="recipe-image-container">
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
        `;
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

// Function to fetch recipe details
const fetchRecipeDetails = async (id) => {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        const meal = data.meals[0];

        // Format ingredients list
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
            }
        }

        recipeDetailsContent.innerHTML = `
            <h2 class="recipeName">
                <i class="fas fa-utensils"></i>
                ${meal.strMeal}
            </h2>
            <div class="recipeDetails">
                <div class="recipe-image-container">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" onerror="handleImageError(this)">
                </div>
                <div class="recipeInfo">
                    <p><i class="fas fa-tag"></i> <span>Category:</span> ${meal.strCategory}</p>
                    <p><i class="fas fa-globe-americas"></i> <span>Area:</span> ${meal.strArea}</p>
                    ${meal.strTags ? `<p><i class="fas fa-hashtag"></i> <span>Tags:</span> ${meal.strTags.split(',').join(', ')}</p>` : ''}
                </div>
            </div>
            <div class="ingredientlist">
                <h3><i class="fas fa-mortar-pestle"></i> Ingredients</h3>
                <ul>
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
        `;

        const recipeDetails = document.querySelector('.recipe-details');
        recipeDetails.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            recipeDetails.classList.add('active');
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

// Event Listeners
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

recipeContainer.addEventListener('click', (e) => {
    const recipeCard = e.target.closest('.recipe');
    if (recipeCard) {
        const recipeId = recipeCard.dataset.id;
        fetchRecipeDetails(recipeId);
    }
});

recipeCloseBtn.addEventListener('click', closeRecipeDetails);

// Initial welcome message
document.addEventListener('DOMContentLoaded', () => {
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