// Telegram Bot API данные (замените на свои)
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
            
            if (TELEGRAM_BOT_TOKEN !== 'YOUR_BOT_TOKEN' && TELEGRAM_CHAT_ID !== 'YOUR_CHAT_ID') {
                // Используем axios для отправки POST запроса к Telegram Bot API
                axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message
                })
                .then(response => {
                    console.log('Сообщение отправлено в Telegram:', response.data);
                })
                .catch(error => {
                    console.error('Ошибка при отправке в Telegram:', error);
                    sendToTelegramFallback(message);
                });
            } else {
                console.log('Телеграм бот не настроен. Сообщение:', message);
            }
        }
        
        // Fallback функция для отправки в Telegram
        function sendToTelegramFallback(message) {
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message)}`;
            
            fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Сообщение отправлено в Telegram (fallback):', data);
            })
            .catch(error => {
                console.error('Ошибка при отправке в Telegram (fallback):', error);
            });
        }
        
        // Мобильное меню
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Закрытие мобильного меню при клике на ссылку
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // Обработчик кнопок "Подробнее" для карточек служений
        document.addEventListener('DOMContentLoaded', function() {
            const detailButtons = document.querySelectorAll('.details-btn');
            
            detailButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const card = this.closest('.service-card');
                    const details = card.querySelector('.service-details');
                    const isActive = this.classList.contains('active');
                    
                    // Закрываем все открытые карточки, кроме текущей
                    detailButtons.forEach(btn => {
                        if (btn !== this) {
                            const otherCard = btn.closest('.service-card');
                            const otherDetails = otherCard.querySelector('.service-details');
                            if (otherDetails.classList.contains('visible')) {
                                otherDetails.classList.remove('visible');
                                otherDetails.classList.add('hidden');
                                btn.classList.remove('active');
                                btn.textContent = 'Подробнее';
                                
                                // После завершения анимации скрытия
                                setTimeout(() => {
                                    if (otherDetails.classList.contains('hidden')) {
                                        otherDetails.style.display = 'none';
                                    }
                                }, 500);
                            }
                        }
                    });
                    
                    if (!isActive) {
                        // Открываем карточку
                        this.classList.add('active');
                        this.textContent = 'Скрыть';
                        details.style.display = 'block';
                        
                        // Даем время для применения display: block
                        setTimeout(() => {
                            details.classList.remove('hidden');
                            details.classList.add('visible');
                        }, 10);
                        
                        // Прокручиваем к карточке, если она не видна полностью
                        const cardRect = card.getBoundingClientRect();
                        const viewportHeight = window.innerHeight;
                        
                        if (cardRect.bottom > viewportHeight) {
                            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    } else {
                        // Закрываем карточку
                        this.classList.remove('active');
                        this.textContent = 'Подробнее';
                        details.classList.remove('visible');
                        details.classList.add('hidden');
                        
                        // После завершения анимации скрытия
                        setTimeout(() => {
                            if (details.classList.contains('hidden')) {
                                details.style.display = 'none';
                            }
                        }, 500);
                    }
                });
            });
        });
        
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
        
        // Плавная прокрутка к якорям
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                if (this.getAttribute('href').startsWith('http')) return;
                
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Автоматическое скрытие заставки через 60 секунд (на случай, если пользователь не выберет ответ)
        setTimeout(() => {
            if (!isSurveyAnswered && splashScreen.style.display !== 'none') {
                isSurveyAnswered = true;
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
            }
        }, 60000);