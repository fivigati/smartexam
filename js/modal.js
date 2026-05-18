function closeExam() {
    document.getElementById('modalExit').classList.replace('hidden', 'flex');
    document.getElementById('exitTokenInput').value = "";
    document.getElementById('exitErrorMsg').classList.add('hidden');
    setTimeout(() => document.getElementById('exitTokenInput').focus(), 300);
}
function tutupModalExit() {

    document.getElementById('modalExit')
        .classList.replace('flex', 'hidden');

    // reset step
    document.getElementById('stepToken')
        .classList.add('hidden');

    document.getElementById('stepConfirmation')
        .classList.remove('hidden');

    // reset input
    document.getElementById('exitTokenInput').value = "";

    document.getElementById('exitErrorMsg')
        .classList.add('hidden');
}
function goToTokenStep() {
    document.getElementById('stepConfirmation').classList.add('hidden');
    document.getElementById('stepToken').classList.remove('hidden');
    setTimeout(() => document.getElementById('exitTokenInput').focus(), 300);
}
function konfirmasiKeluar() {

    const inputUser = document.getElementById('exitTokenInput').value.trim().toUpperCase();
    const tokenSistem = String(sessionData.exit_token || "").trim().toUpperCase();

    if (inputUser === tokenSistem && tokenSistem !== "") {
    // kirim status DONE
    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify({
            action: 'recordHeartbeat',
            npsn: sessionData.npsn,
            nisn: sessionData.nisn,
            subject: sessionData.subject,
            session_status: 'DONE',
            fullscreen_status: 'FULL',
            browser_info: navigator.userAgent,
            device_info: `${navigator.platform} | ${navigator.vendor}`,
            ip_address: sessionData.userIP
        }),
        mode: 'no-cors'
    });

    // beri jeda agar request terkirim
    setTimeout(() => {
   
        // Matikan sistem ujian
        isExamActive = false;

        // Stop heartbeat
        if (sessionData.heartbeatInterval) {
            clearInterval(sessionData.heartbeatInterval);
        }

        // Stop timer
        clearInterval(timerInterval);

        // Stop alarm
        stopAlarm();

        // Keluar fullscreen
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }

        // Kosongkan iframe
        document.getElementById('examIframe').src = "about:blank";

        // Tutup modal
        tutupModalExit();

        // Sembunyikan wrapper ujian
        document.getElementById('examWrapper').classList.replace('flex', 'hidden');

        // Tampilkan halaman login lagi
        document.getElementById('loginSection').classList.remove('hidden');
        document.getElementById('studentSection').classList.add('hidden');
        // CEK REMEMBER ID
        const remember = document.getElementById('rememberId').checked;

        if (!remember) {
        localStorage.removeItem('smartExam_id');
        document.getElementById('studentId').value = "";
        }
        // Reset zoom
        currentZoom = 100;

        // Reset timer visual
        document.getElementById('examTimer').innerText = "00:00:00";

       }, 300);

    } else {

        document.getElementById('exitErrorMsg').classList.remove('hidden');
        document.getElementById('exitTokenInput').value = "";
        document.getElementById('exitTokenInput').focus();

        const modalContent = document.querySelector('#modalExit > div');
        modalContent.classList.add('animate-pulse');

        setTimeout(() => {
            modalContent.classList.remove('animate-pulse');
        }, 500);
    }
}
