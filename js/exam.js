// =====================================================
// START EXAM
// =====================================================

function startExam() {
    const input = document.getElementById('tokenInput').value.toUpperCase().trim();

    if (input === correctToken.toUpperCase()) {
        showNotif('Token valid! Membuka soal...', 'success');

        setTimeout(async () => {
            const duration = parseInt(document.getElementById('studentSection').dataset.duration);

            document.getElementById('examWrapper').classList.replace('hidden', 'flex');
            document.getElementById('examIframe').src = examLink;

            isExamActive = true;
            await enterFullscreen();
            aktifkanWakeLock();

            // =====================================================
            // MANAJEMEN HEMAT SERVER BERDASARKAN PAKET SEKOLAH
            // =====================================================
            if (sessionData.heartbeat_enabled) {
                // Jika paket PREMIUM: Aktifkan siklus interval 15-detik berkala
                startHeartbeat();
            } else {
                // Jika paket HEMAT: CUKUP TEMBAK 1 KALI SAAT MASUK (Gatekeeper Beraksi)
                kirimHeartbeat({
                    action: 'recordHeartbeat',
                    npsn: sessionData.npsn,
                    nisn: sessionData.nisn,
                    exam_id: sessionData.exam_id,
                    session_status: 'ONLINE',
                    fullscreen_status: 'FULL',
                    browser_info: navigator.userAgent,
                    device_info: `${navigator.platform} | ${navigator.vendor}`,
                    ip_address: sessionData.userIP
                });
            }

            startTimer(duration * 60);
        }, 1000);

    } else {
        showNotif('Token ujian salah!', 'error');
    }
}


// =====================================================
// START TIMER
// =====================================================

function startTimer(seconds) {

    clearInterval(timerInterval);

    let time = seconds;

    const display =
        document.getElementById(
            'examTimer'
        );

    timerInterval = setInterval(() => {

        // =====================================================
        // FORMAT TIMER
        // =====================================================

        let h =
            Math.floor(time / 3600);

        let m =
            Math.floor((time % 3600) / 60);

        let s =
            time % 60;

        display.innerText =
            `${String(h).padStart(2,'0')}:` +
            `${String(m).padStart(2,'0')}:` +
            `${String(s).padStart(2,'0')}`;

        // =====================================================
        // ATUR TOMBOL KELUAR
        // =====================================================

        const remainingMinutes =
            time / 60;

        const closeBtn =
            document.getElementById(
                'btnCloseExam'
            );

        if (closeBtn) {

            // =====================================================
            // IZINKAN KELUAR
            // =====================================================

            if (
                sessionData.minExitMinutes === 0 ||
                remainingMinutes <=
                sessionData.minExitMinutes
            ){

                closeBtn.disabled = false;

                closeBtn.classList.remove(
                    'opacity-50',
                    'cursor-not-allowed'
                );

            }

            // =====================================================
            // BLOKIR TOMBOL KELUAR
            // =====================================================

            else {

                closeBtn.disabled = true;

                closeBtn.classList.add(
                    'opacity-50',
                    'cursor-not-allowed'
                );
            }
        }

        // =====================================================
        // WAKTU HABIS
        // =====================================================

        if (time-- <= 0) {

            clearInterval(timerInterval);

            tampilkanModalWaktuHabis();
        }

    }, 1000);
}


// =====================================================
// ZOOM EXAM
// =====================================================

function zoomExam(type) {

    const iframe =
        document.getElementById(
            'examIframe'
        );

    // zoom in
    if (
        type === 'in' &&
        currentZoom < 150
    ) {

        currentZoom += 10;
    }

    // zoom out
    else if (
        type === 'out' &&
        currentZoom > 70
    ) {

        currentZoom -= 10;
    }

    const scale =
        currentZoom / 100;

    // =====================================================
    // TERAPKAN SCALE
    // =====================================================

    iframe.style.transform =
        `scale(${scale})`;

    // =====================================================
    // SESUAIKAN UKURAN
    // =====================================================

    iframe.style.width =
        (100 / scale) + "%";

    iframe.style.height =
        (100 / scale) + "%";
}


// =====================================================
// REFRESH EXAM
// =====================================================

function refreshExam() {

    const iframe =
        document.getElementById(
            'examIframe'
        );

    const url = iframe.src;

    iframe.src = '';

    setTimeout(() => {

        iframe.src = url;

    }, 50);
}


// =====================================================
// STOP ALARM
// =====================================================

function stopAlarm() {

    const audio =
        document.getElementById(
            'alarmAudio'
        );

    audio.pause();

    audio.currentTime = 0;
}


// =====================================================
// MODAL WAKTU HABIS
// =====================================================

function tampilkanModalWaktuHabis() {

    let countdown = 5;

    // tampilkan modal
    document.getElementById(
        'timeUpModal'
    ).classList.replace(
        'hidden',
        'flex'
    );

    const countdownText =
        document.getElementById(
            'timeUpCountdown'
        );

    countdownText.innerText =
        countdown;

    // =====================================================
    // COUNTDOWN
    // =====================================================

    const interval = setInterval(() => {

        countdown--;

        countdownText.innerText =
            countdown;

        // =====================================================
        // SELESAI
        // =====================================================

        if (countdown <= 0) {

            clearInterval(interval);

            // hide modal
            document.getElementById(
                'timeUpModal'
            ).classList.replace(
                'flex',
                'hidden'
            );

            // reset session
            resetExamSession();
        }

    }, 1000);
}
// =====================================================
// CREATE SESSION
// =====================================================

async function createSession() {

    try {

        const res = await fetch(scriptURL, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                action: 'createSession',

                npsn: sessionData.npsn,

                nisn: sessionData.nisn,

                subject: sessionData.subject,

                browser_info:
                    navigator.userAgent,

                device_info:
                    `${navigator.platform} | ${navigator.vendor}`,

                ip_address:
                    sessionData.userIP
            })
        });

        if (!res.ok) {

            throw new Error(
                'Server Error'
            );
        }

        return await res.json();

    } catch (err) {

        console.log(
            'Create Session Error:',
            err
        );

        return {
            success: false
        };
    }
}
