// 1. 
//  а) Збереження даних про систему користувача в localStorage  

const footerInfo = {
    os: navigator.platform,
    browser: navigator.userAgent,
    language: navigator.language,
    screensize: `${window.screen.width}x${window.screen.height}`
};

localStorage.setItem('userSystemInfo', JSON.stringify(footerInfo));

// б) Відображення збережених даних у футері
const footerInfoElement = document.getElementById('system-info');
const savedDataString = localStorage.getItem('userSystemInfo');

if (savedDataString && footerInfoElement) {
    const savedData = JSON.parse(savedDataString); 
        footerInfoElement.innerHTML = `
        <strong>ОС:</strong> ${savedData.os} | 
        <strong>Мова:</strong> ${savedData.language} | 
        <strong>Роздільна здатність:</strong> ${savedData.screensize} <br>
        <small style="color: gray;"><strong>Браузер:</strong> ${savedData.browser}</small>
    `;
}

// 2. Відображення коментарів з сервера
function loadEmployerComments() {
    const variant = 13; 
    const url = `https://jsonplaceholder.typicode.com/posts/${variant}/comments`;
    const container = document.getElementById('comments-list');

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Помилка мережі');
            }
            return response.json();
        })
        .then(comments => {
            container.innerHTML = '';

            comments.forEach(comment => {
                const card = document.createElement('div');
                card.className = 'comment-card';

                card.innerHTML = `
                    <span class="comment-author">${comment.name}</span>
                    <span class="comment-email">${comment.email}</span>
                    <p>${comment.body}</p>
                `;

                container.appendChild(card);
            });
        })
        .catch(error => {
            container.innerHTML = `<p style="color: red;">Не вдалося завантажити відгуки: ${error.message}</p>`;
        });
}

loadEmployerComments();



// 3. Відправлення форми зворотнього зв'язку
const modalOverlay = document.getElementById('feedback-modal');
const closeModalBtn = document.getElementById('close-modal');

setTimeout(() => {
    modalOverlay.classList.add('show');
}, 60000);

function closeModal() {
    modalOverlay.classList.remove('show');
}

closeModalBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
        closeModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalOverlay.classList.contains('show')) {
        closeModal();
    }
});

// Зупинка стандартної відправки, відправка на фоні
const feedbackForm = document.getElementById('feedback-form');

feedbackForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(feedbackForm);

    fetch(feedbackForm.action, {
        method: feedbackForm.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Дякую! Ваш відгук успішно відправлено.');
            feedbackForm.reset();
            closeModal();
        } else {
            alert('Ой, сталася помилка при відправці. Спробуйте пізніше.');
        }
    })
    .catch(error => {
        alert('Помилка мережі. Перевірте з\'єднання.');
    });
});

// 4. Автоматичне перемикання теми залежно від часу доби та ручне перемикання
const themeToggleBtn = document.getElementById('theme-toggle');
const bodyElement = document.body;

function checkAutoTheme() {
    const currentHour = new Date().getHours();
    const isDayTime = currentHour >= 7 && currentHour < 21;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        bodyElement.classList.add('dark-theme');
    } else if (savedTheme === 'light') {
        bodyElement.classList.remove('dark-theme');
    } else {
        if (isDayTime) {
            bodyElement.classList.remove('dark-theme');
        } else {
            bodyElement.classList.add('dark-theme');
        }
    }
}

checkAutoTheme();

themeToggleBtn.addEventListener('click', () => {
    bodyElement.classList.toggle('dark-theme');
    if (bodyElement.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});
