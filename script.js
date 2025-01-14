document.addEventListener('DOMContentLoaded', function() {
    const backgroundImage = document.querySelector('.background-image');
    const content = document.querySelector('.content');
    const elements = document.querySelectorAll('.fade-in-text');

    setTimeout(() => {
        backgroundImage.classList.add('fade-in');
    }, 500);

    setTimeout(() => {
        content.classList.add('fade-in');
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = 1;
                element.style.transform = 'translateY(0)';
            }, index * 500); // Задержка между появлением элементов
        });
    }, 1500);
});
