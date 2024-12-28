alert("Раздел \"О проекте\"")

// Конструктор, через который создаётся комментарий
function Comment() {
    // Запросим имя
    this.author = prompt("Как вас зовут ?")
    if (this.author == null) {
        this.empty = true
        return
    }

    // Запросим текст
    this.text = prompt("Оставьте отзыв")
    if (this.text == null) {
        this.empty = true
        return
    }

    // Сохраним текущее время
    this.date = new Date().toLocaleString()
}

// Оставить комментарий
function addComment() {
    let comment = new Comment()

    // проверяем, успешно ли юзер осуществил ввод
    if (comment.empty) {
        return;
    }

    // Запросим, хочет ли пользователь оставить полноценный отзыв или это будет обычный комментарий
    let enableLikes = confirm('Разрешить пользователям оценивать ваш отзыв?')

    if (enableLikes) {
        // Создадим для отзыва новый объект из прототипа - комментария
        let review = Object.create(comment)
        // и добавим ему нужное свойство
        review.rate = 0;

        // Добавляем отзыв с возможностью пользовательских оценок
        writeReview(review)
    } else {
        // Добавим простой комментарий без возможности оценки
        writeReview(comment)
    }
}

const writeReview = review => {
    let likeCounter = '';

    // Если публикуется отзыв - добавляем ему кнопку с лайками.
    if (review.hasOwnProperty('rate')) {

        // Генерим идентификатор комментария.
        let commentId = Math.random();
        // Для кнопки лайков добавляем: идентификатор, атрибут onclick для передачи идентификатора в функцию, значок лайка, и само значение счётчика отделяем пробелом
        // Также мы добавили стиль, чтобы кнопка смотрелась лучше и не имела рамок
        likeCounter += '<button id="' + commentId + '" style="border: none" onclick="addLike(this.id)">' + `❤️ ${review.rate}</button>`
    }
    // Запишем результат 
    document.getElementsByClassName('reviews')[0].innerHTML += ' <div class="review-text">\n' +
        `<p> <i> <b>${review['author']}</b> ${review['date']}${likeCounter}</i></p>` + `<p>${review['text']}</p>` + '</div>';
}

// Увеличивает счётчик лайков
function addLike(id) {
    // Найдём нужный элемент по id
    let element = document.getElementById(id);

    // Преобразуем текст элемента в массив, разбив его по пробелам (так как счётчик лайков у нас отделен от символа ❤️пробелом)
    let array = element.innerText.split(' ')

    // Вытащим искомое значение счётчика и сразу же преобразуем его в число, так как
    // при сложении любого значения со строкой в JS будет строка, а нам этого не требуется
    let resultNum = parseInt(array[array.length - 1], 10);

    // Увеличим счётчик
    resultNum += 1

    // Сохраним измененное значение обратно в массив
    array[array.length - 1] = `${resultNum}`

    // Обновим текст элемента
    element.innerText = array.join(' ')
}

let slider = document.querySelector('.slider'),
    sliderList = slider.querySelector('.slider-list'),
    sliderTrack = slider.querySelector('.slider-track'),
    slides = slider.querySelectorAll('.slide'),
    arrows = slider.querySelector('.slider-arrows'),
    prev = arrows.children[0],
    next = arrows.children[1],
    slideWidth = slides[0].offsetWidth,
    slideIndex = 0,
    posInit = 0,
    posX1 = 0,
    posX2 = 0,
    posFinal = 0,
    posThreshold = slideWidth * .35,
    trfRegExp = /[-0-9.]+(?=px)/,
    slide = function () {
        sliderTrack.style.transition = 'transform .5s';
        sliderTrack.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;

        // делаем стрелку prev недоступной на первом слайде
        // и доступной в остальных случаях
        // делаем стрелку next недоступной на последнем слайде
        // и доступной в остальных случаях
        prev.classList.toggle('disabled', slideIndex === 0);
        next.classList.toggle('disabled', slideIndex === --slides.length);
    }


getEvent = () => event.type.search('touch') !== -1 ? event.touches[0] : event,

    swipeStart = function () {
        let evt = getEvent();

        // берем начальную позицию курсора по оси Х
        posInit = posX1 = evt.clientX;

        // убираем плавный переход, чтобы track двигался за курсором без задержки
        // т.к. он будет включается в функции slide()
        sliderTrack.style.transition = '';

        // и сразу начинаем отслеживать другие события на документе
        document.addEventListener('touchmove', swipeAction);
        document.addEventListener('touchend', swipeEnd);
        document.addEventListener('mousemove', swipeAction);
        document.addEventListener('mouseup', swipeEnd);
    },
    swipeAction = function () {
        let evt = getEvent(),
            // для более красивой записи возьмем в переменную текущее свойство transform
            style = sliderTrack.style.transform,
            // считываем трансформацию с помощью регулярного выражения и сразу превращаем в число
            transform = +style.match(trfRegExp)[0];

        posX2 = posX1 - evt.clientX;
        posX1 = evt.clientX;

        sliderTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`;
    }

swipeEnd = function () {
    // финальная позиция курсора
    posFinal = posInit - posX1;

    document.removeEventListener('touchmove', swipeAction);
    document.removeEventListener('mousemove', swipeAction);
    document.removeEventListener('touchend', swipeEnd);
    document.removeEventListener('mouseup', swipeEnd);

    // убираем знак минус и сравниваем с порогом сдвига слайда
    if (Math.abs(posFinal) > posThreshold) {
        // если мы тянули вправо, то уменьшаем номер текущего слайда
        if (posInit < posX1) {
            slideIndex--;
            // если мы тянули влево, то увеличиваем номер текущего слайда
        } else if (posInit > posX1) {
            slideIndex++;
        }
    }

    // если курсор двигался, то запускаем функцию переключения слайдов
    if (posInit !== posX1) {
        slide();
    }
};

arrows.addEventListener('click', function () {
    let target = event.target;

    if (target === next) {
        slideIndex++;
    } else if (target === prev) {
        slideIndex--;
    } else {
        return;
    }

    slide();
});

sliderTrack.style.transform = 'translate3d(0px, 0px, 0px)';

slider.addEventListener('touchstart', swipeStart);
slider.addEventListener('mousedown', swipeStart);