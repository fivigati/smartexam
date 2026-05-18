// =====================================================
// SECURITY CONFIG
// =====================================================

// Cooldown violation agar tidak spam
let lastViolationTime = 0;
const violationCooldown = 3000;

// =====================================================
// DETEKSI PINDAH TAB
// =====================================================

document.addEventListener("visibilitychange", () => {

if (
    isExamActive &&
    document.hidden &&
    document.visibilityState === "hidden"
) {

    triggerViolation("PINDAH TAB");

} else if (!document.hidden) {

    stopAlarm();
}

});

// =====================================================
// DETEKSI KELUAR FULLSCREEN
// =====================================================

document.addEventListener("fullscreenchange", () => {

setTimeout(() => {

    if (
        isExamActive &&
        !window.isForceClosing &&
        !document.fullscreenElement &&
        !isIOS &&
        document.visibilityState === "visible"
    ) {

        triggerViolation(
            "KELUAR FULLSCREEN"
        );

        // tampilkan lockscreen
        document.getElementById(
            'lockScreen'
        ).classList.remove('hidden');

        document.getElementById(
            'lockScreen'
        ).classList.add('flex');
    }

}, 300);

});

// =====================================================
// KIRIM PELANGGARAN
// =====================================================

function triggerViolation(type) {

// Cooldown agar tidak spam
const now = Date.now();

if (
    now - lastViolationTime <
    violationCooldown
) {
    return;
}

lastViolationTime = now;

// Alarm
document.getElementById(
    'alarmAudio'
).play();

// Kirim violation
fetch(scriptURL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({

        action: 'logViolation',

        npsn: sessionData.npsn,

        nisn: sessionData.nisn,

        subject: sessionData.subject,

        type: type,

        device_info:
            `${navigator.platform} | ${navigator.vendor}`,

        ip_address: sessionData.userIP

    })

})
.then(res => res.json())

.then(res => {

    // Jika langsung kicked
    if (res.kicked) {

        showSecurityModal({

            title:
                "Ujian Dihentikan",

            subtitle:
                "Batas pelanggaran telah tercapai.",

            message:
                "Akun ujian Anda dinonaktifkan sementara oleh sistem.",

            icon:
                "fa-ban"

        });
    }
})

.catch(err => {

    console.log(
        'Violation Error:',
        err
    );

});

}

// =====================================================
// KEMBALI KE FULLSCREEN
// =====================================================

async function kembaliKeFullscreen() {

const success =
    await enterFullscreen();

if (success) {

    // aktifkan ulang wake lock
    aktifkanWakeLock();

    // tutup lockscreen
    document.getElementById(
        'lockScreen'
    ).classList.add('hidden');

    document.getElementById(
        'lockScreen'
    ).classList.remove('flex');

    // stop alarm
    stopAlarm();
}

}

// =====================================================
// SECURITY MODAL UNIVERSAL
// =====================================================

function showSecurityModal({

title = "Keamanan Sistem",

subtitle =
    "Aktivitas tidak valid terdeteksi.",

message =
    "Sesi ujian akan ditutup otomatis.",

icon = "fa-shield-halved"

}) {

// Hindari trigger berulang
if (window.isForceClosing) return;

window.isForceClosing = true;

// Set icon
const iconEl =
    document.getElementById(
        'securityModalIcon'
    );

iconEl.className =
    `fas ${icon} text-white text-4xl`;

// Set title
document.getElementById(
    'securityModalTitle'
).innerText = title;

// Set subtitle
document.getElementById(
    'securityModalSubtitle'
).innerText = subtitle;

// Set message
document.getElementById(
    'securityModalMessage'
).innerText = message;

// Tampilkan modal
const modal =
    document.getElementById(
        'securityModal'
    );

modal.classList.remove('hidden');

modal.classList.add('flex');

// Delay sebelum reset
setTimeout(() => {

    // Reset session
    resetExamSession();

    // Hide modal
    modal.classList.remove('flex');

    modal.classList.add('hidden');

    // Reset state closing
    window.isForceClosing = false;

}, 5000);

}

// =====================================================
// RESET SESSION UNIVERSAL
// =====================================================

function resetExamSession() {

// Matikan mode ujian
isExamActive = false;

// Stop heartbeat
if (sessionData.heartbeatInterval) {

    clearInterval(
        sessionData.heartbeatInterval
    );
}

// Stop timer
if (timerInterval) {

    clearInterval(timerInterval);
}

// Stop alarm
stopAlarm();

// Lepas wake lock
if (sessionData.wakeLock) {

    sessionData.wakeLock
        .release()
        .catch(() => {});
}

// Keluar fullscreen
if (document.fullscreenElement) {

    document
        .exitFullscreen()
        .catch(() => {});
}

// Reset iframe
document.getElementById(
    'examIframe'
).src = "about:blank";

// Hide wrapper ujian
document.getElementById(
    'examWrapper'
).classList.replace(
    'flex',
    'hidden'
);

// Hide student section
document.getElementById(
    'studentSection'
).classList.add('hidden');

// Show login
document.getElementById(
    'loginSection'
).classList.remove('hidden');

// Reset timer visual
document.getElementById(
    'examTimer'
).innerText = "00:00:00";

// Reset token ujian
const tokenInput =
    document.getElementById(
        'tokenInput'
    );

if (tokenInput) {

    tokenInput.value = "";
}

// Reset token keluar
const exitInput =
    document.getElementById(
        'exitTokenInput'
    );

if (exitInput) {

    exitInput.value = "";
}

// Reset zoom
currentZoom = 100;

// Reset state
correctToken = "";
examLink = "";

sessionData.subject = "";
sessionData.exit_token = "";

// Hide modal exit
tutupModalExit();

// Hapus ID jika remember OFF
const remember =
    document.getElementById(
        'rememberId'
    ).checked;

if (!remember) {

    localStorage.removeItem(
        'smartExam_id'
    );

    document.getElementById(
        'studentId'
    ).value = "";
}
}
