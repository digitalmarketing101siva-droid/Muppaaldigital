// Interactive Application Logic for Muppaal Digital (Sivaprasad C)

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Navigation Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // 2. The Muppaal Growth Framework Donut Navigator
    function selectDimension(dim) {
        const dims = ['build', 'reach', 'grow'];
        dims.forEach(d => {
            const panel = document.getElementById('panel-dim-' + d);
            const tab = document.getElementById('tab-nav-' + d);
            const sector = document.getElementById('sector-group-' + d);

            if (d === dim) {
                if (panel) panel.classList.remove('hidden');
                if (sector) sector.classList.add('active-sector');
                if (tab) {
                    tab.className = d === 'build' ? 'px-5 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all border flex items-center gap-2 bg-midnight text-white border-midnight shadow-xs' :
                                    d === 'reach' ? 'px-5 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all border flex items-center gap-2 bg-slate text-white border-slate shadow-xs' :
                                    'px-5 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all border flex items-center gap-2 bg-copper text-white border-copper shadow-xs';
                }
            } else {
                if (panel) panel.classList.add('hidden');
                if (sector) sector.classList.remove('active-sector');
                if (tab) {
                    tab.className = 'px-5 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all border flex items-center gap-2 bg-warmNeutral text-charcoal border-borderLine hover:border-slate';
                }
            }
        });
    }

    // Expose globally
    window.selectDimension = selectDimension;

    // Attach click listeners to tabs and sectors if present
    ['build', 'reach', 'grow'].forEach(dim => {
        const tab = document.getElementById('tab-nav-' + dim);
        const sector = document.getElementById('sector-group-' + dim);
        if (tab) tab.addEventListener('click', () => selectDimension(dim));
        if (sector) sector.addEventListener('click', () => selectDimension(dim));
    });

    // 3. Toast Notifications
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    function showToast(message) {
        if (!toast || !toastMsg) return;
        toastMsg.textContent = message;
        toast.classList.remove('translate-y-20', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');

        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 3200);
    }

    // 4. Lead Capture Audit Request Form Handler (Formspree Instant Email Dispatch)
    const auditForm = document.getElementById('audit-form');
    const submitBtn = document.getElementById('submit-btn');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalMsg = document.getElementById('modal-msg');

    // Formspree Endpoint for instant email notifications
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/mrpqpdgr";

    if (auditForm) {
        auditForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const company = document.getElementById('company_name').value.trim();
            const url = document.getElementById('website_url').value.trim();
            const name = document.getElementById('full_name').value.trim();
            const email = document.getElementById('work_email').value.trim();
            const notesEl = document.getElementById('additional_notes');
            const notes = notesEl ? notesEl.value.trim() : '';

            // Form validation check
            if (!company || !url || !name || !email) {
                showToast('Please fill out all required fields.');
                return;
            }

            // Animate Button Submission State
            const origSubmitHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Sending Request...';

            const payload = {
                company_name: company,
                website_url: url,
                name: name,
                email: email,
                additional_notes: notes || "None provided",
                _subject: `New 90-Day Growth Plan Request: ${company}`,
                submitted_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            };

            fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then((response) => {
                if (response.ok) {
                    auditForm.reset();
                    if (modalMsg) {
                        modalMsg.innerHTML = `Thank you, <strong>${name}</strong>! I have received your growth plan request for <strong>${company}</strong> (${url}).<br><br>I will personally inspect your domain across the 10 pillars and 5 strategic scorecards, synthesize your customized 90-day growth plan, and reach out to you directly at <strong>${email}</strong>.`;
                    }
                    if (successModal) {
                        successModal.classList.remove('hidden');
                    }
                } else {
                    response.json().then(data => {
                        if (data && data.errors) {
                            showToast(data.errors.map(error => error.message).join(", "));
                        } else {
                            showToast('Oops! There was a problem submitting your request. Please try again.');
                        }
                    }).catch(() => {
                        showToast('Submission issue. Please try again or email siva@muppaaldigital.com directly.');
                    });
                }
            })
            .catch((error) => {
                console.error('Formspree submission error:', error);
                showToast('Network error. Please try again or email siva@muppaaldigital.com directly.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = origSubmitHTML;
            });
        });
    }

    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.add('hidden');
        });
    }

    // 5. Zoho Calendar Booking Modal Handler
    const openBookingBtn = document.getElementById('open-booking-modal-btn');
    const bookingModal = document.getElementById('booking-modal');
    const closeBookingBtn = document.getElementById('close-booking-modal-btn');

    if (openBookingBtn && bookingModal) {
        openBookingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            bookingModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    }

    const closeBookingModal = () => {
        if (bookingModal) {
            bookingModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    };

    if (closeBookingBtn) {
        closeBookingBtn.addEventListener('click', closeBookingModal);
    }

    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                closeBookingModal();
            }
        });
    }

    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (bookingModal && !bookingModal.classList.contains('hidden')) {
                closeBookingModal();
            }
            if (successModal && !successModal.classList.contains('hidden')) {
                successModal.classList.add('hidden');
            }
        }
    });

});
