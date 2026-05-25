function kirimHeartbeat(payload) {
    fetch(scriptURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(res => {
        if (window.isForceClosing) return;

        // DETEKSI BLOKIRAN GATEKEEPER MULTI-DEVICE
        if (!res.success) {
            showSecurityModal({
                title: "Akses Ditolak",
                subtitle: "Akun terdeteksi aktif di perangkat lain.",
                message: res.message || "Sesi ujian ini dikunci demi menjaga keamanan sistem.",
                icon: "fa-mobile-screen"
            });
            return;
        }

        // DETEKSI OTOMATIS JIKA KENA BAN / AUTO-KICK
        if (res.kicked) {
            showSecurityModal({
                title: "Ujian Dihentikan",
                subtitle: "Batas pelanggaran telah tercapai.",
                message: "Akun ujian Anda dinonaktifkan sementara oleh sistem.",
                icon: "fa-ban"
            });
        }
    })
    .catch(err => {
        console.log('Heartbeat Error:', err);
    });
}

function startHeartbeat() {
    // Kirim ketukan inisialisasi awal
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

    // Jalankan Interval Pengawasan Real-Time
    sessionData.heartbeatInterval = setInterval(() => {
        if (!isExamActive) return;

        // Pengaman ekstra: Jika di tengah jalan config heartbeat mati, bersihkan interval
        if (!sessionData.heartbeat_enabled) {
            clearInterval(sessionData.heartbeatInterval);
            return;
        }

        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const isVisible = !document.hidden;
        const isFullscreen = !!document.fullscreenElement || !!document.webkitFullscreenElement;

        let st = "ONLINE";
        if (!isVisible || (!isIOS && !isFullscreen)) {
            st = "AWAY";
        }

        kirimHeartbeat({
            action: 'recordHeartbeat',
            npsn: sessionData.npsn,
            nisn: sessionData.nisn,
            exam_id: sessionData.exam_id,
            session_status: st,
            fullscreen_status: isFullscreen ? 'FULL' : 'WINDOWED',
            browser_info: navigator.userAgent,
            device_info: `${navigator.platform} | ${navigator.vendor}`,
            ip_address: sessionData.userIP
        });
    }, 15000);
}
