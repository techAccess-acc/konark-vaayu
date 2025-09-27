

const urlParams = new URLSearchParams(window.location.search);


const process = (frm) => {
    const formData = {
        'first_name': $(frm).find('input[name="userName"]')?.val() ?? '',
        'phone_no': $(frm).find('input[name="userMobile"]')?.val() ?? '',
        'comment': $(frm).find('textarea[name="userComment"]')?.val() ?? '',
        'source': 'microsite',
    }

    const searchParams = new URLSearchParams(window.location.search);
    formData['date'] = new Date();
    formData['utm_source'] = searchParams.get('utm_source') ?? ''
    formData['utm_medium'] = searchParams.get('utm_medium') ?? ''
    formData['utm_campaign'] = searchParams.get('utm_campaign') ?? 'marketing'
    formData['utm_term'] = searchParams.get('utm_term') ?? ''
    formData['utm_adgroup'] = searchParams.get('utm_adgroup') ?? ''
    formData['placement'] = searchParams.get('placement') ?? ''
    formData['keyword'] = searchParams.get('keyword') ?? ''
    formData['device'] = searchParams.get('device') ?? ''
    formData['device_model'] = searchParams.get('device_model') ?? ''
    formData['referer'] = window.location.href
    formData['request_url'] = window.location.href
    formData['ip_address'] = '' // Will be populated by IP capture
    formData['source'] = "microsite"

    const enquireName = $(frm).find('input[name="enquireName"]')?.val()
    let path = `${location.origin}/thank-you.html`
    if (enquireName === "Download Now Sticky" || enquireName === "Download Brochure" || enquireName === "Brochure Request") {
        path = `${path}?download=brochure`
    }
  

    let project_name = "konark vaayu"

    formData['comment'] = `Enquiry coming from ${enquireName ?? ""} button for project ${project_name}. User message: ${formData.comment || 'No additional message'}`

    const queryString = Object.keys(formData)
    .filter(key => formData[key]) // Exclude empty values
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(formData[key])}`)
    .join("&");

    let data = {url:window.location.href, formData: queryString}
    
    
    googlesheet(queryString);
    
    // Capture IP address and send to Zapier (with timeout)
    Promise.race([
        captureIPAddress(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('IP capture timeout')), 5000))
    ]).then(ip => {
        formData['ip_address'] = ip;
        sendToZapier(formData, path, formData.phone_no);
    }).catch(() => {
        // If IP capture fails or times out, send without IP
        sendToZapier(formData, path, formData.phone_no);
    });

}

setTimeout(() => {
    $('#enquiryForm, #formModal').submit(function(event) {
        // Disable submit button and show loading state
        $("button[type='submit'], input[type='submit'], .submit_box").prop("disabled", true).html("🔄 Processing...");
        event.preventDefault(); // Prevent default form submission
        const formRef = this
        process(formRef)
    });

}, 500);



function micrositeInit(){
    return;
}


function googlesheet(queryString){
    
    let webhookUrl = "https://script.google.com/macros/s/AKfycbwwUGkUs6k7ta1L6vUaln-zaIzeOyWB4lBrNZQxrVyDv7nohRG0EbwmoyTLPF1Vjtt8/exec?gid=0&"+queryString

    const googleSheetSettings = {
    "url": webhookUrl,
    "method": "GET"
};
    
$.ajax(googleSheetSettings).done((response) => {
    // Google Sheets submission successful
}).fail((jqXHR, textStatus, errorThrown) => {
    // Google Sheets submission failed
});
}

function sendToZapier(formData, redirectPath, phoneNo){
    const zapierWebhookUrl = "https://hooks.zapier.com/hooks/catch/24330276/umscjmr/";
    
    // Prepare data for Zapier - include all tracking parameters
    const zapierData = {
        first_name: formData.first_name || '',
        phone_no: formData.phone_no || '',
        comment: formData.comment || '',
        source: formData.source || 'microsite',
        project: formData.project || '',
        project_name: 'konark vaayu',
        page_url: formData.referer || window.location.href,
        date: formData.date || new Date().toISOString(),
        // IP Address
        ip_address: formData.ip_address || '',
        // UTM Parameters
        utm_source: formData.utm_source || '',
        utm_medium: formData.utm_medium || '',
        utm_campaign: formData.utm_campaign || 'marketing',
        utm_term: formData.utm_term || '',
        utm_adgroup: formData.utm_adgroup || '',
        // Additional tracking parameters
        placement: formData.placement || '',
        keyword: formData.keyword || '',
        device: formData.device || '',
        device_model: formData.device_model || '',
        request_url: formData.request_url || window.location.href,
        // Browser and system info
        browser: formData.browser || '',
        os: formData.os || '',
        screen_resolution: formData.screen_resolution || '',
        user_agent: formData.user_agent || navigator.userAgent
    };
    

    // Try form data first (CORS-friendly)
    const zapierSettings = {
        "url": zapierWebhookUrl,
        "method": "POST",
        "timeout": 15000, // 15 seconds timeout
        "data": zapierData, // Send as form data instead of JSON
        "dataType": "json"
    };
    
    $.ajax(zapierSettings).done((response, textStatus, jqXHR) => {
        // Store success status for verification
        localStorage.setItem("zapierSuccess", "true");
        localStorage.setItem("zapierResponse", JSON.stringify(response));
        
        // Clear form and redirect
        $('input[name="enquireName"]').val("");
        localStorage.setItem("enquiry", phoneNo);
        window.location.href = redirectPath;
        
    }).fail((jqXHR, textStatus, errorThrown) => {
        // Store error status for debugging
        localStorage.setItem("zapierSuccess", "false");
        localStorage.setItem("zapierError", textStatus + " - " + jqXHR.responseText);
        
        // Re-enable submit button and reset text
        $("button[type='submit'], input[type='submit'], .submit_box").prop("disabled", false).html("Submit");
        
        // Stay on same page - no redirect
    });
}

function captureIPAddress() {
    return new Promise((resolve, reject) => {
        // Try multiple IP capture services for better reliability
        const ipServices = [
            'https://api.ipify.org?format=json',
            'https://ipapi.co/json/',
            'https://api.ipgeolocation.io/ipgeo?apiKey=free'
        ];
        
        let currentService = 0;
        
        function tryNextService() {
            if (currentService >= ipServices.length) {
                reject(new Error('All IP services failed'));
                return;
            }
            
            fetch(ipServices[currentService])
                .then(response => response.json())
                .then(data => {
                    // Different services return IP in different fields
                    const ip = data.ip || data.query || data.ipAddress;
                    if (ip) {
                        resolve(ip);
                    } else {
                        currentService++;
                        tryNextService();
                    }
                })
                .catch(() => {
                    currentService++;
                    tryNextService();
                });
        }
        
        tryNextService();
    });
}

function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    const width = window.innerWidth;
    let browserName = "Unknown";
    let fullVersion = "Unknown";
    let device = "Desktop"
  
    if (userAgent.includes("Edg")) {
      browserName = "Microsoft Edge";
      fullVersion = userAgent.match(/Edg\/([\d.]+)/)?.[1];
    } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
      browserName = "Opera";
      fullVersion = userAgent.match(/(Opera|OPR)\/([\d.]+)/)?.[2];
    } else if (userAgent.includes("Chrome")) {
      browserName = "Chrome";
      fullVersion = userAgent.match(/Chrome\/([\d.]+)/)?.[1];
    } else if (userAgent.includes("Safari")) {
      browserName = "Safari";
      fullVersion = userAgent.match(/Version\/([\d.]+)/)?.[1];
    } else if (userAgent.includes("Firefox")) {
      browserName = "Firefox";
      fullVersion = userAgent.match(/Firefox\/([\d.]+)/)?.[1];
    } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
      browserName = "Internet Explorer";
      fullVersion = userAgent.match(/(MSIE |rv:)([\d.]+)/)?.[2];
    }
  
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/.test(userAgent)) {
        device = "Mobile";
      }
    
      if (/ipad|tablet|playbook|silk/.test(userAgent) || (width >= 768 && width <= 1024)) {
        device = "Tablet";
      }
    

    return {
      browser: browserName,
      version: fullVersion || "Unknown",
      os: getOS(),
      device: device
    };
  }
  function getOS() {
    const platform = navigator.platform.toLowerCase();
    const userAgent = navigator.userAgent.toLowerCase();
    if (platform.includes("win")) return "Windows";
    if (platform.includes("mac")) return "macOS";
    if (platform.includes("linux")) return "Linux";
    if (/android/.test(userAgent)) return "Android";
    if (/iphone|ipad|ipod/.test(userAgent)) return "iOS";
    return "Unknown";
  }