    document.addEventListener('DOMContentLoaded', function() {
                // Telegram Bot API данные
                const TELEGRAM_BOT_TOKEN = '8210111831:AAFgs1nnKSaVW-DadSa78kpJPP8fpge_1pY';
                const TELEGRAM_CHAT_ID = '8164483415';

                // Элементы DOM
                const splashScreen = document.getElementById('splash-screen');
                const mainSite = document.getElementById('main-site');
                const surveyItems = document.querySelectorAll('.survey-item');
                const mobileMenuBtn = document.getElementById('mobile-menu-btn');
                const navMenu = document.getElementById('nav-menu');

                // Вопросы для опроса
                const questions = [
                    "Слышал, но не вникал",
                    "Знал все о подкомитете",
                    "Нет, не знал",
                    "Я новичок"
                ];

                let isSurveyAnswered = false;

                // Обработчики выбора варианта опроса
                surveyItems.forEach(item => {
                    item.addEventListener('click', function() {
                        if (isSurveyAnswered) return;
                        
                        isSurveyAnswered = true;
                        const questionNum = this.getAttribute('data-question');
                        const answerText = questions[questionNum - 1];
                        
                        // Убираем выделение со всех элементов
                        surveyItems.forEach(el => el.classList.remove('selected'));
                        
                        // Выделяем выбранный элемент
                        this.classList.add('selected');
                        
                        // Визуальная обратная связь
                        this.style.transform = 'scale(0.98)';
                        this.style.background = 'rgba(236, 75, 47, 0.2)';
                        
                        // Отправка ответа в Telegram
                        sendToTelegram(questionNum, answerText);
                        
                        // Анимация исчезновения заставки через 1 секунду
                        setTimeout(() => {
                            splashScreen.style.opacity = '0';
                            
                            setTimeout(() => {
                                splashScreen.style.display = 'none';
                                mainSite.style.display = 'block';
                                
                                setTimeout(() => {
                                    mainSite.style.opacity = '1';
                                    animateSiteContent();
                                    window.scrollTo(0, 0);
                                }, 100);
                            }, 1500);
                        }, 1000);
                    });
                });

                // Функция отправки в Telegram
                function sendToTelegram(questionNum, answerText) {
                    const message = `Пользователь выбрал ответ №${questionNum}: "${answerText}" на вопрос "Знали ли вы, чем занимается подкомитет связи с общественностью?"`;
                    
                    console.log('Sending to Telegram:', message);
                    
                    // Простой метод через fetch
                    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message)}`;
                    
                    fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        console.log('Сообщение отправлено в Telegram:', data);
                    })
                    .catch(error => {
                        console.error('Ошибка при отправке в Telegram:', error);
                    });
                }

                // Мобильное меню
                if (mobileMenuBtn && navMenu) {
                    mobileMenuBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        
                        // Переключаем класс active у меню
                        navMenu.classList.toggle('active');
                        
                        // Меняем иконку
                        const icon = this.querySelector('i');
                        if (navMenu.classList.contains('active')) {
                            icon.classList.remove('fa-bars');
                            icon.classList.add('fa-times');
                            this.setAttribute('aria-label', 'Закрыть меню');
                        } else {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                            this.setAttribute('aria-label', 'Открыть меню');
                        }
                    });
                    
                    // Закрытие меню при клике на ссылку
                    document.querySelectorAll('nav a').forEach(link => {
                        link.addEventListener('click', function() {
                            navMenu.classList.remove('active');
                            const icon = mobileMenuBtn.querySelector('i');
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                            mobileMenuBtn.setAttribute('aria-label', 'Открыть меню');
                        });
                    });
                    
                    // Закрытие меню при клике вне его области
                    document.addEventListener('click', function(e) {
                        if (navMenu.classList.contains('active') && 
                            !navMenu.contains(e.target) && 
                            !mobileMenuBtn.contains(e.target)) {
                            navMenu.classList.remove('active');
                            const icon = mobileMenuBtn.querySelector('i');
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                            mobileMenuBtn.setAttribute('aria-label', 'Открыть меню');
                        }
                    });
                    
                    // Закрытие меню при изменении размера окна на десктоп
                    window.addEventListener('resize', function() {
                        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                            navMenu.classList.remove('active');
                            const icon = mobileMenuBtn.querySelector('i');
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                            mobileMenuBtn.setAttribute('aria-label', 'Открыть меню');
                        }
                    });
                }
                
                // Анимация карточек услуг при скролле
                const serviceCards = document.querySelectorAll('.service-card');
                const observerOptions = {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                };
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animated');
                            observer.unobserve(entry.target);
                        }
                    });
                }, observerOptions);
                
                serviceCards.forEach(card => {
                    observer.observe(card);
                });
                
                // Кнопки "Подробнее" в услугах
                document.querySelectorAll('.details-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const card = this.closest('.service-card');
                        const details = card.querySelector('.service-details');
                        const isVisible = details.classList.contains('visible');
                        
                        if (isVisible) {
                            details.classList.remove('visible');
                            details.classList.add('hidden');
                            this.textContent = 'Подробнее';
                            setTimeout(() => {
                                details.style.display = 'none';
                            }, 500);
                        } else {
                            details.style.display = 'block';
                            details.classList.remove('hidden');
                            details.classList.add('visible');
                            this.textContent = 'Скрыть';
                        }
                    });
                });
                
                // Плавная прокрутка
                document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function(e) {
                        e.preventDefault();
                        const targetId = this.getAttribute('href');
                        if (targetId === '#') return;
                        
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            window.scrollTo({
                                top: targetElement.offsetTop - 70,
                                behavior: 'smooth'
                            });
                        }
                    });
                });
                
                // КОД ДЛЯ МОДАЛЬНОГО ОКНА С ИЗОБРАЖЕНИЯМИ
                const modal = document.getElementById('image-modal');
                const modalImage = document.getElementById('modal-image');
                const modalClose = document.getElementById('modal-close');
                const modalPrev = document.getElementById('modal-prev');
                const modalNext = document.getElementById('modal-next');
                const modalCounter = document.getElementById('modal-counter');
                
                let images = [];
                let currentImageIndex = 0;
                
                // Находим все изображения с классом modal-image-trigger
                const imageTriggers = document.querySelectorAll('.modal-image-trigger');
                
                // Заполняем массив изображений
                imageTriggers.forEach((img, index) => {
                    images.push({
                        src: img.src,
                        alt: img.alt
                    });
                    
                    // Добавляем обработчик клика
                    img.addEventListener('click', function(e) {
                        e.preventDefault();
                        currentImageIndex = index;
                        openModal();
                    });
                });
                
                // Функция открытия модального окна
                function openModal() {
                    if (images.length === 0) return;
                    
                    updateModalImage();
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    document.addEventListener('keydown', handleKeyDown);
                }
                
                // Функция закрытия модального окна
                function closeModal() {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    document.removeEventListener('keydown', handleKeyDown);
                }
                
                // Функция обновления изображения в модальном окне
                function updateModalImage() {
                    if (images.length === 0) return;
                    
                    const image = images[currentImageIndex];
                    modalImage.src = image.src;
                    modalImage.alt = image.alt;
                    modalCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
                    
                    // Показываем/скрываем кнопки навигации
                    modalPrev.style.display = images.length > 1 ? 'flex' : 'none';
                    modalNext.style.display = images.length > 1 ? 'flex' : 'none';
                    modalCounter.style.display = images.length > 1 ? 'block' : 'none';
                }
                
                // Функция для перехода к следующему изображению
                function nextImage() {
                    if (images.length === 0) return;
                    
                    currentImageIndex = (currentImageIndex + 1) % images.length;
                    updateModalImage();
                }
                
                // Функция для перехода к предыдущему изображению
                function prevImage() {
                    if (images.length === 0) return;
                    
                    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                    updateModalImage();
                }
                
                // Обработчик клавиатуры
                function handleKeyDown(e) {
                    if (e.key === 'Escape') {
                        closeModal();
                    } else if (e.key === 'ArrowRight') {
                        nextImage();
                    } else if (e.key === 'ArrowLeft') {
                        prevImage();
                    }
                }
                
                // Назначение обработчиков
                if (modalClose) modalClose.addEventListener('click', closeModal);
                if (modalNext) modalNext.addEventListener('click', nextImage);
                if (modalPrev) modalPrev.addEventListener('click', prevImage);
                
                // Закрытие по клику на фон
                if (modal) {
                    modal.addEventListener('click', function(e) {
                        if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                            closeModal();
                        }
                    });
                }
                
                // Блокируем всплытие события для элементов внутри модального окна
                const modalContent = modal ? modal.querySelector('.modal-content') : null;
                if (modalContent) {
                    modalContent.addEventListener('click', function(e) {
                        e.stopPropagation();
                    });
                }
                
                // Обработка свайпов на мобильных устройствах
                let touchStartX = 0;
                let touchEndX = 0;
                
                modal.addEventListener('touchstart', function(e) {
                    touchStartX = e.changedTouches[0].screenX;
                });
                
                modal.addEventListener('touchend', function(e) {
                    touchEndX = e.changedTouches[0].screenX;
                    handleSwipe();
                });
                
                function handleSwipe() {
                    const swipeThreshold = 50;
                    
                    if (touchEndX < touchStartX - swipeThreshold) {
                        nextImage();
                    } else if (touchEndX > touchStartX + swipeThreshold) {
                        prevImage();
                    }
                }
                
                // Предзагрузка изображений для плавной навигации
                function preloadImages() {
                    images.forEach(img => {
                        const image = new Image();
                        image.src = img.src;
                    });
                }
                
                window.addEventListener('load', preloadImages);
                
                // Анимация контента сайта
                function animateSiteContent() {
                    // Анимируем заголовки секций
                    const sectionTitles = document.querySelectorAll('.section-title');
                    sectionTitles.forEach(title => {
                        title.style.animation = 'fadeInUp 0.8s ease forwards';
                    });
                    
                    // Анимируем подзаголовки
                    const sectionSubtitles = document.querySelectorAll('.section-subtitle');
                    sectionSubtitles.forEach((subtitle, index) => {
                        setTimeout(() => {
                            subtitle.style.animation = `fadeInUp 0.8s ease forwards`;
                        }, index * 100 + 200);
                    });
                    
                    // Анимируем карточки услуг
                    const serviceCards = document.querySelectorAll('.service-card');
                    serviceCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.animation = `fadeInUp 0.8s ease forwards`;
                            card.classList.add('animated');
                        }, index * 100);
                    });
                    
                    // Анимируем параграфы в about
                    const aboutParagraphs = document.querySelectorAll('.about-text p');
                    aboutParagraphs.forEach((p, index) => {
                        setTimeout(() => {
                            p.style.animation = `fadeInUp 0.8s ease forwards`;
                        }, index * 200);
                    });
                    
                    // Анимируем контактную информацию
                    const contactInfo = document.querySelector('.contact-info');
                    const contactForm = document.querySelector('.contact-form');
                    
                    if (contactInfo) {
                        contactInfo.style.animation = 'fadeInUp 0.8s ease 0.3s forwards';
                    }
                    
                    if (contactForm) {
                        contactForm.style.animation = 'fadeInUp 0.8s ease 0.5s forwards';
                    }
                }
                
                // Автоматическое скрытие заставки через 60 секунд
                setTimeout(() => {
                    if (!isSurveyAnswered && splashScreen && splashScreen.style.display !== 'none') {
                        isSurveyAnswered = true;
                        splashScreen.style.opacity = '0';
                        
                        setTimeout(() => {
                            splashScreen.style.display = 'none';
                            if (mainSite) {
                                mainSite.style.display = 'block';
                                
                                setTimeout(() => {
                                    mainSite.style.opacity = '1';
                                    animateSiteContent();
                                    window.scrollTo(0, 0);
                                }, 100);
                            }
                        }, 1500);
                    }
                }, 60000);
            });
