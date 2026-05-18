const scriptURL = 'https://script.google.com/macros/s/AKfycbyYSA1eH6tWAtu2C248XJ4qo86USUgBXHBUQLOD1N3jeJRIyq3JACUmqgUr9k84A78gEw/exec';
    window.correctToken = "";
    window.examLink = "";
    window.currentZoom = 100;
    window.timerInterval = null;
    window.isExamActive = false;
    window.isForceClosing = false;
    
    // --- State Baru untuk Security ---
    window.sessionData = {
    npsn: "",
    nisn: "",
    exam_id: "",
    exit_token: "",
    userIP: "0.0.0.0",
    wakeLock: null,
    minExitMinutes: 10
};
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
