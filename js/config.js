const scriptURL = 'https://script.google.com/macros/s/AKfycbz4NLt_x5yzbgZEE82uIqW3VS9Sv3yuNVeyqJ53SUpLuShTVucRmZLLo4B8HL0jaXrpug/exec';
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
