// Inicialización cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes
    initGallery();
    initBudgetCalculator();
    initBookingSystem();
    initTestimonials();
    initContactForm();
    initWhatsAppFloat();
});

// Galería de fotos
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').getAttribute('src');
            const modal = document.createElement('div');
            modal.classList.add('modal', 'fade');
            modal.setAttribute('id', 'galleryModal');
            modal.setAttribute('tabindex', '-1');
            modal.setAttribute('aria-labelledby', 'galleryModalLabel');
            modal.setAttribute('aria-hidden', 'true');
            
            modal.innerHTML = `
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="galleryModalLabel">Galería de Fotos</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <img src="${imgSrc}" class="img-fluid" alt="Imagen ampliada">
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
            
            modal.addEventListener('hidden.bs.modal', function() {
                document.body.removeChild(modal);
            });
        });
    });
}

// Calculadora de presupuesto
function initBudgetCalculator() {
    const budgetForm = document.getElementById('budgetForm');
    if (!budgetForm) return;
    
    budgetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener valores del formulario
        const distance = parseFloat(document.getElementById('distance').value);
        const serviceType = document.getElementById('serviceType').value;
        const hasHeavyItems = document.getElementById('heavyItems').checked;
        
        // Cálculo básico (esto es un ejemplo, ajustar según necesidades reales)
        let basePrice = 0;
        
        switch(serviceType) {
            case 'mudanza':
                basePrice = 5000;
                break;
            case 'transporte':
                basePrice = 3000;
                break;
            case 'entrega':
                basePrice = 2000;
                break;
            default:
                basePrice = 2500;
        }
        
        // Calcular precio según distancia y otros factores
        let totalPrice = basePrice + (distance * 100);
        
        // Agregar cargo por artículos pesados
        if (hasHeavyItems) {
            totalPrice += 1500;
        }
        
        // Mostrar resultado
        document.getElementById('budgetResult').innerHTML = `
            <div class="alert alert-success mt-3">
                <h4 class="alert-heading">Presupuesto Estimado</h4>
                <p>El costo aproximado del servicio es: <strong>$${totalPrice.toLocaleString('es-AR')}</strong></p>
                <hr>
                <p class="mb-0">Este es un presupuesto preliminar. Para un presupuesto detallado, contáctenos directamente.</p>
            </div>
        `;
        
        // Mostrar botón de WhatsApp con presupuesto
        document.getElementById('whatsappBudget').innerHTML = `
            <a href="https://wa.me/5491155826806?text=Hola,%20solicito%20un%20presupuesto%20detallado%20para%20un%20servicio%20de%20${serviceType}%20por%20${distance}km.%20El%20presupuesto%20estimado%20fue%20$${totalPrice.toLocaleString('es-AR')}" 
               class="btn btn-success btn-lg w-100 mt-3">
                <i class="fab fa-whatsapp me-2"></i> Solicitar presupuesto detallado
            </a>
        `;
    });
    
    // Manejar carga de fotos
    const photoUpload = document.getElementById('photoUpload');
    if (photoUpload) {
        photoUpload.addEventListener('change', function() {
            const fileCount = this.files.length;
            document.getElementById('uploadedFiles').textContent = `${fileCount} archivo(s) seleccionado(s)`;
        });
    }
}

// Sistema de reservas
function initBookingSystem() {
    // Inicializar Flatpickr para el selector de fecha
    const dateSelector = document.getElementById('booking-date');
    if (dateSelector) {
        // Configuración del calendario
        flatpickr(dateSelector, {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            minDate: "today",
            maxDate: new Date().fp_incr(30), // Permitir reservas hasta 30 días en el futuro
            minTime: "08:00",
            maxTime: "18:00",
            locale: {
                firstDayOfWeek: 1, // Lunes como primer día de la semana
                weekdays: {
                    shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                    longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
                },
                months: {
                    shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                    longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
                }
            },
            disable: [
                function(date) {
                    // Deshabilitar domingos
                    return date.getDay() === 0;
                }
            ],
            disableMobile: "true"
        });
    }
    
    // Manejar envío del formulario de reserva en el modal
    const submitBookingBtn = document.getElementById('submit-booking');
    if (submitBookingBtn) {
        submitBookingBtn.addEventListener('click', function() {
            const bookingForm = document.getElementById('booking-form');
            
            // Validar formulario
            if (!bookingForm.checkValidity()) {
                bookingForm.classList.add('was-validated');
                return;
            }
            
            // Obtener datos del formulario
            const name = document.getElementById('booking-name').value;
            const email = document.getElementById('booking-email').value;
            const phone = document.getElementById('booking-phone').value;
            const date = document.getElementById('booking-date').value;
            const service = document.getElementById('booking-service').value;
            const notes = document.getElementById('booking-notes').value;
            const emailTo = document.getElementById('booking-email-to').value;
            
            // En una implementación real, aquí se enviarían los datos al servidor
            // Para este ejemplo, simulamos el envío de correo
            
            // Preparar los datos para EmailJS
            const templateParams = {
                to_email: emailTo,
                from_name: name,
                from_email: email,
                from_phone: phone,
                booking_date: date,
                service_type: service,
                notes: notes
            };
            
            // Abrir cliente de correo del usuario con los datos prellenados
            const subject = encodeURIComponent(`Nueva Reserva de Servicio - ${name}`);
            const body = encodeURIComponent(`
Nombre: ${name}
Email: ${email}
Teléfono: ${phone}
Fecha: ${date}
Servicio: ${service}
Notas: ${notes}
            `);
            
            // Crear enlace mailto
            const mailtoLink = `mailto:${emailTo}?subject=${subject}&body=${body}`;
            
            // Abrir cliente de correo
            window.open(mailtoLink, '_blank');
            
            // Mostrar mensaje de confirmación
            const modalBody = document.querySelector('#reservaModal .modal-body');
            modalBody.innerHTML = `
                <div class="alert alert-success">
                    <h4 class="alert-heading">¡Reserva Enviada!</h4>
                    <p>Gracias por tu reserva, ${name}.</p>
                    <p>Hemos enviado los detalles de tu reserva a ${emailTo}.</p>
                    <p>Te contactaremos a la brevedad para confirmar.</p>
                </div>
            `;
            
            // Cambiar botones del modal
            const modalFooter = document.querySelector('#reservaModal .modal-footer');
            modalFooter.innerHTML = `
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
            `;
            
            // Después de 5 segundos, cerrar el modal
            setTimeout(() => {
                const reservaModal = bootstrap.Modal.getInstance(document.getElementById('reservaModal'));
                if (reservaModal) {
                    reservaModal.hide();
                    
                    // Restaurar el formulario después de cerrar
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                }
            }, 5000);
        });
    }
}

// Sistema de testimonios
function initTestimonials() {
    const testimonialForm = document.getElementById('testimonialForm');
    if (!testimonialForm) return;
    
    // Sistema de calificación con estrellas
    const ratingStars = document.querySelectorAll('.rating-select i');
    let selectedRating = 0;
    
    ratingStars.forEach((star, index) => {
        star.addEventListener('click', function() {
            selectedRating = index + 1;
            
            // Actualizar visualización de estrellas
            ratingStars.forEach((s, i) => {
                if (i < selectedRating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
            
            // Actualizar campo oculto
            document.getElementById('rating').value = selectedRating;
        });
    });
    
    // Manejar envío del formulario de testimonios
    testimonialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const name = document.getElementById('reviewName').value;
        const comment = document.getElementById('reviewComment').value;
        const rating = document.getElementById('rating').value;
        
        // En una implementación real, aquí se enviarían los datos al servidor
        // Para este ejemplo, mostraremos un mensaje de confirmación
        document.getElementById('testimonialConfirmation').innerHTML = `
            <div class="alert alert-success mt-3">
                <h4 class="alert-heading">¡Gracias por tu opinión!</h4>
                <p>Hemos recibido tu comentario y calificación de ${rating} estrellas.</p>
                <p>Tu opinión es muy importante para nosotros.</p>
            </div>
        `;
        
        // Limpiar formulario
        testimonialForm.reset();
        
        // Resetear estrellas
        ratingStars.forEach(s => {
            s.classList.remove('fas');
            s.classList.add('far');
        });
        selectedRating = 0;
    });
}

// Formulario de contacto
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const message = document.getElementById('contactMessage').value;
        
        // En una implementación real, aquí se enviarían los datos al servidor
        // Para este ejemplo, mostraremos un mensaje de confirmación
        document.getElementById('contactConfirmation').innerHTML = `
            <div class="alert alert-success mt-3">
                <h4 class="alert-heading">¡Mensaje Enviado!</h4>
                <p>Gracias por contactarnos, ${name}.</p>
                <p>Te responderemos a la brevedad al correo ${email}.</p>
            </div>
        `;
        
        // Limpiar formulario
        contactForm.reset();
    });
}

// Botón flotante de WhatsApp
function initWhatsAppFloat() {
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (!whatsappFloat) return;
    
    // Añadir efecto de pulso
    setInterval(() => {
        whatsappFloat.classList.add('pulse');
        setTimeout(() => {
            whatsappFloat.classList.remove('pulse');
        }, 1000);
    }, 3000);
}

// Animación de scroll suave para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Ajuste para el header fijo
                behavior: 'smooth'
            });
        }
    });
});

// Validación de formularios
(function() {
    'use strict';
    
    // Fetch all forms we want to apply custom validation styles to
    const forms = document.querySelectorAll('.needs-validation');
    
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
})();