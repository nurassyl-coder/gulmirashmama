document.addEventListener('DOMContentLoaded', function () {
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwMNzott-1Z-P3pDo8hiwRRapMuoVcLj0Xm4pdOMBRsJO45rvfrx6psr3TVUx8OjXrN/exec';

    function initFormHandler() {
        let submitBtn = document.querySelector('.t-submit');

        if (!submitBtn) {
            const allDivs = document.querySelectorAll('div, a, button');
            for (let i = 0; i < allDivs.length; i++) {
                if (allDivs[i].textContent.trim() === 'Жіберу') {
                    submitBtn = allDivs[i];
                    break;
                }
            }
        }

        if (!submitBtn) {
            console.log("Submit button not found yet, retrying...");
            setTimeout(initFormHandler, 500);
            return;
        }

        console.log("Submit button found, attaching handler.");

        const newBtn = submitBtn.cloneNode(true);
        if (submitBtn.parentNode) {
            submitBtn.parentNode.replaceChild(newBtn, submitBtn);
        }

        // Prevent native submit if it's a real button
        if (newBtn.tagName === 'BUTTON' || newBtn.tagName === 'INPUT') {
            newBtn.type = 'button';
        }

        const handleSubmission = function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            const nameInput = document.querySelector('input[type="text"]');
            const attendanceInput = document.querySelector('input[type="radio"]:checked');

            // If nameInput is not found, maybe Tilda hasn't rendered inputs yet (unlikely if button exists)
            // Or maybe inputs are different type.

            const name = nameInput ? nameInput.value.trim() : '';
            const attendance = attendanceInput ? attendanceInput.value : '';

            if (!name) {
                alert('Аты-жөніңізді жазыңыз (Please enter your name)');
                if (nameInput) nameInput.focus();
                return;
            }
            if (!attendance) {
                alert('Тойға келесіз бе? Жауапты таңдаңыз. (Please select an option)');
                return;
            }

            const originalText = newBtn.innerText; // Use innerText to capture text
            newBtn.innerText = 'Жіберілуде...';
            newBtn.style.opacity = '0.7';
            newBtn.style.pointerEvents = 'none';

            const payload = {
                name: name,
                attendance: attendance
            };

            fetch(WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload)
            })
                .then(() => {
                    newBtn.innerText = 'Жіберілді!';
                    newBtn.style.backgroundColor = '#4CAF50';
                    newBtn.style.color = '#fff';

                    alert('Рахмет! Сіздің жауабыңыз қабылданды.');

                    if (nameInput) nameInput.value = '';
                    const allRadios = document.querySelectorAll('input[type="radio"]');
                    allRadios.forEach(r => r.checked = false);

                    setTimeout(() => {
                        newBtn.innerText = originalText;
                        newBtn.style.opacity = '1';
                        newBtn.style.pointerEvents = 'auto';
                        newBtn.style.backgroundColor = '';
                        newBtn.style.color = '';
                    }, 3000);
                })
                .catch(err => {
                    console.error('Submission error:', err);
                    newBtn.innerText = originalText;
                    newBtn.style.opacity = '1';
                    newBtn.style.pointerEvents = 'auto';
                    alert('Қате орын алды. Интернет байланысын тексеріп, қайта жасап көріңіз.');
                });
        };

        newBtn.addEventListener('click', handleSubmission);

        // Also trap Enter key if inside a form
        const nameInputForForm = document.querySelector('input[type="text"]');
        if (nameInputForForm) {
            const form = nameInputForForm.closest('form');
            if (form) {
                form.onsubmit = function (e) {
                    handleSubmission(e);
                    return false;
                };
            }

            // Also add keydown listener to name input if it's not in a form tag (Zero Block sometimes)
            nameInputForForm.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmission(e);
                }
            });
        }
    }

    initFormHandler();
});
