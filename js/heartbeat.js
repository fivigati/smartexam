// =====================================================
// KIRIM HEARTBEAT KE SERVER
// =====================================================

function kirimHeartbeat(payload) {

    fetch(scriptURL, {

        method: 'POST',

        body: JSON.stringify(payload)

    })

    .then(res => res.json())

    .then(res => {

        // Hindari spam closing
        if (window.isForceClosing) return;

        // =====================================================
        // MULTI DEVICE DETECTED
        // =====================================================

        if (
            !res.success &&
            res.message
        ) {

            showSecurityModal({

                title:
                    "Akses Ditolak",

                subtitle:
                    "Akun terdeteksi aktif di perangkat lain.",

                message:
                    "Sesi ujian ini akan ditutup demi menjaga keamanan sistem.",

                icon:
                    "fa-mobile-screen"

            });

            return;
        }

        // =====================================================
        // AUTO KICKED
        // =====================================================

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
            'Heartbeat Error:',
            err
        );

    });
}


// =====================================================
// START HEARTBEAT
// =====================================================

function startHeartbeat() {

    // =====================================================
    // KIRIM STATUS AWAL
    // =====================================================

    kirimHeartbeat({

        action: 'recordHeartbeat',

        npsn: sessionData.npsn,

        nisn: sessionData.nisn,

        subject: sessionData.subject,

        session_status: 'ONLINE',

        fullscreen_status: 'FULLSCREEN',

        browser_info:
            navigator.userAgent,

        device_info:
            `${navigator.platform} | ${navigator.vendor}`,

        ip_address:
            sessionData.userIP

    });


    // =====================================================
    // INTERVAL HEARTBEAT
    // =====================================================

    sessionData.heartbeatInterval = setInterval(() => {

        if (!isExamActive) {
            
            clearInterval(
                sessionData
                .heartbeatInterval
            );
            return;
        }

        // =====================================================
        // DETEKSI DEVICE IOS
        // =====================================================

        const isIOS =
            /iPhone|iPad|iPod/i
            .test(navigator.userAgent);

        // =====================================================
        // CEK VISIBILITY
        // =====================================================

        const isVisible =
            !document.hidden;

        // =====================================================
        // CEK FULLSCREEN
        // =====================================================

        const isFullscreen =
            !!document.fullscreenElement ||
            !!document.webkitFullscreenElement;

        // =====================================================
        // DEFAULT STATUS
        // =====================================================

        let st = "ONLINE";

        // =====================================================
        // PINDAH TAB / APP
        // =====================================================

        if (!isVisible) {

            st = "AWAY";

        }

        // =====================================================
        // KELUAR FULLSCREEN
        // =====================================================

        else if (
            !isIOS &&
            !isFullscreen
        ) {

            st = "AWAY";

        }

        // =====================================================
        // IOS TETAP ONLINE SELAMA VISIBLE
        // =====================================================

        else {

            st = "ONLINE";

        }


        // =====================================================
        // KIRIM HEARTBEAT
        // =====================================================

        kirimHeartbeat({

            action: 'recordHeartbeat',

            npsn: sessionData.npsn,

            nisn: sessionData.nisn,

            subject: sessionData.subject,

            session_status: st,

            fullscreen_status:
                isFullscreen
                ? 'FULLSCREEN'
                : 'NOT_FULLSCREEN',

            browser_info:
                navigator.userAgent,

            device_info:
                `${navigator.platform} | ${navigator.vendor}`,

            ip_address:
                sessionData.userIP

        });

    }, 30000);
}
