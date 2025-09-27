class ResourceLoader{loadCSS(e){return new Promise((r,a)=>{let o=document.createElement("link");o.rel="stylesheet",o.type="text/css",o.href=e,o.onload=()=>r(`CSS loaded from ${e}`),o.onerror=r=>a(`Failed to load CSS from ${e}: ${r}`),document.head.appendChild(o)})}loadJS(e){return new Promise((r,a)=>{let o=document.createElement("script");o.src=e,o.type="text/javascript",o.onload=()=>r(`JavaScript loaded from ${e}`),o.onerror=r=>a(`Failed to load JavaScript from ${e}: ${r}`),document.body.appendChild(o)})}}



document.addEventListener("DOMContentLoaded", function () {
    let isThanksPage = false;
    let lpSliderCount = document.querySelectorAll('#mainSlider .glide__slide').length;

    if (!isThanksPage) {
        let lpSliderSettings = {
            type: 'carousel',
            startAt: 0,
            perView: 1,
            gap: 0,
            autoplay: lpSliderCount > 1 ? 5000 : false,
            hoverpause: false,
        };

        if (document.getElementById("mainSlider")) {
            new Glide('#mainSlider', lpSliderSettings).mount();
        }
    }
 // Lightbox
    const lightbox = GLightbox({
        selector: '.glightbox',
        loop: true
    });
    


        // Amenities Slider
        if(document.getElementsByClassName('amenities-slider').length > 0){
            new Glide('.amenities-slider', {
                type: 'carousel',
                startAt: 0,
                perView: 3,
                gap: 50,
                autoplay: 3000,
                hoverpause: true,
                breakpoints: {
                    800: {
                        perView: 2
                    },
                    600: {
                        perView: 1
                    }
                }
            }).mount();
        }
        if(document.getElementsByClassName('amenities-slider-icon').length > 0){
            new Glide('.amenities-slider-icon', {
                type: 'carousel',
                startAt: 0,
                perView: 4,
                gap: 30,
                autoplay: 3000,
                hoverpause: true,
                breakpoints: {
                    800: {
                        perView: 2
                    },
                    600: {
                        perView: 1
                    }
                }
            }).mount();
        }


        // Enquiry Popup
    const enqPopupHighNormal = document.querySelector('#enq-popup-pj-highlights-normal');
    const enqPopupHighBrochure = document.querySelector('#enq-popup-pj-highlights-brochure');
    const enqPopups = document.querySelectorAll('[data-bs-target="#enqPopup"]');
    var formName = document.querySelector('#enqPopup #form-name');
    const enqPopupTitle = document.querySelector('#enqPopup #enqPopupTitle');
    const enqPopupSumit = document.querySelector('#enqPopup #enqPopupSumit');
    const enqPopupForm = document.querySelector('#enqPopup .enq-form');
    enqPopups.forEach(enqPopup => {
        enqPopup.addEventListener('click', function(event) {
            var formNameValue = this.getAttribute('data-form-name');
            $('#formModal input[name="enquireName"]').val(formNameValue)
            if (formNameValue && formNameValue.trim() !== '') {
                formName.value = formNameValue;
            } else {
                formName.value = 'Enquiry Now';
            }

            if (this.getAttribute('data-brochure-popup') === 'yes') {
                enqPopupHighNormal.classList.add('d-none');
                enqPopupHighBrochure.classList.remove('d-none');
            } else {
                enqPopupHighBrochure.classList.add('d-none');
                enqPopupHighNormal.classList.remove('d-none');
            }

            if (enqPopup.dataset.formtitle) {
                enqPopupTitle.innerHTML = enqPopup.dataset.formtitle;
                enqPopupSumit.innerHTML = enqPopup.dataset.formbtn;
            } else {
                enqPopupTitle.textContent = 'Enquiry Now';
                enqPopupSumit.textContent = 'Submit';
            }

            const enqNameValue = this.getAttribute('data-form-enq-name');
            let existingInput = enqPopupForm.querySelector('input[name="form-enq-name"]');

            if (enqNameValue) {
                if (!existingInput) {
                    existingInput = document.createElement('input');
                    existingInput.type = 'hidden';
                    existingInput.name = 'form-enq-name';
                    enqPopupForm.appendChild(existingInput);
                }
                existingInput.value = enqNameValue;
            } else if (existingInput) {
                existingInput.remove();
            }
        });
    });
        
    
    // Read More
    
    document.querySelector('.more').addEventListener('click', function() {
        var moreText = document.querySelector('.more-cont');
        var btnText = document.querySelector('.more');

        if (moreText.style.display === "none" || moreText.style.display === "") {
        moreText.style.display = "block";
        btnText.innerHTML = "Read less";
        } else {
        moreText.style.display = "none";
        btnText.innerHTML = "Read more";
        }
    });


});
// const loadFavicon = e => {
//     if(document.getElementById('favicon')){
//         const favicon = document.getElementById("favicon");
//         favicon.href = "https://s3.ap-south-1.amazonaws.com/microsites.images/microsite/images/favicons/favicon-" + e + ".png";
//     }
// }


window.addEventListener("load", (event) => {
   

    // Lazyload
    lazySizes.init();


    const loader = new ResourceLoader();
    setTimeout(() =>{
        loadTelInput(countryCode)
    }, 100);
    
    // Assets Load
    setTimeout(() =>{

        // Favicon
        // loadFavicon('pp');

        // Intl Tel Input
        // loader.loadCSS('')
        // .then((message) => console.log())
        // .catch((error) => console.error(error));
        // loader.loadJS('')
        // .then((message) => loadTelInput(countryCode))
        // .catch((error) => console.error(error));

        // Google Font
        // loader.loadCSS('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap')
        // .then((message) => loadBaseFont())
        // .catch((error) => console.error(error));

        // Remix Icon Font
        loader.loadCSS('https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.min.css')
        .then((message) => console.log())
        .catch((error) => console.error(error));

        // GTranslate
        window.gtranslateSettings = {"default_language":"en","languages":["en","ar"],"wrapper_selector":".gtranslate_wrapper","flag_size":24,"alt_flags":{"en":"usa"}}
        loader.loadJS('https://cdn.gtranslate.net/widgets/latest/popup.js')
        .then((message) => console.log())
        .catch((error) => console.error(error));

        setTimeout(()=>{
            if (window.gtranslate && window.gtranslate.setLang) {
              window.gtranslate.setLang('ar'); // Switch language to Arabic
            }
        }, 1000);

    }, 100);


    // Active Form Sumbit Buttons
    setTimeout(() =>{
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
          const submitButton = form.querySelector('button[type="submit"]');
          if (submitButton) { submitButton.removeAttribute('disabled'); }
        });
    }, 100);

});
const countryCode = 'in';
function loadTelInput(countryCode) {
    const phoneInputs = document.querySelectorAll('input[name="userMobile"]');
    phoneInputs.forEach(input => {
        const iti = intlTelInput(input, {
            initialCountry: countryCode,
            separateDialCode: true
        });

        const isoCodeInput = document.createElement('input');
        isoCodeInput.type = 'hidden';
        isoCodeInput.name = `${input.name}_iso_code`;
        isoCodeInput.id = `${input.id}_iso_code`;
        
        const dialCodeInput = document.createElement('input');
        dialCodeInput.type = 'hidden';
        dialCodeInput.name = `${input.name}_dial_code`;
        dialCodeInput.id = `${input.id}_dial_code`;

        input.parentElement.appendChild(isoCodeInput);
        input.parentElement.appendChild(dialCodeInput);

        input.addEventListener('input', () => {
            const countryData = iti.getSelectedCountryData();
            isoCodeInput.value = countryData.iso2;
            dialCodeInput.value = countryData.dialCode;
        });

        const countryData = iti.getSelectedCountryData();
        isoCodeInput.value = countryData.iso2;
        dialCodeInput.value = countryData.dialCode;
    });
}
document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

