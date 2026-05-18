const scriptURL = 'https://script.google.com/macros/s/AKfycbyppJyo4jYIpsa4GFrG7QKD8TrK6S7DRiAxLWVY3mtzUUOAQOEIk3hZRwEu9QLx1Bm7eQ/exec';
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
