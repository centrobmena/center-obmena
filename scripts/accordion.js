document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function () {
        const accordion = this.parentElement; 
        const question = accordion.querySelector('.accordion-question'); 
        const content = this.nextElementSibling; 
        const isActive = accordion.classList.contains('active');

        document.body.style.overflow = 'hidden';

        document.querySelectorAll('.accordion').forEach(accordionElement => {
            accordionElement.classList.remove('active');
            accordionElement.style.maxHeight = '110px'; 
        });
        document.querySelectorAll('.accordion-question').forEach(questionElement => {
            questionElement.classList.remove('active');
        });
        document.querySelectorAll('.accordion-content').forEach(contentElement => {
            contentElement.style.maxHeight = null;
        });

        if (!isActive) {
            accordion.classList.add('active');
            question.classList.add('active');
            content.style.maxHeight = content.scrollHeight + '300px'; 
            accordion.style.maxHeight = accordion.scrollHeight + '300px'; 
        }

        setTimeout(() => {
            document.body.style.overflow = 'auto';
        }, 300); 
    });
});