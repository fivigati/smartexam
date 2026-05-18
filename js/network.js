// =====================================================
// NETWORK STATE
// =====================================================

window.isOffline = false;


// =====================================================
// OFFLINE DETECTED
// =====================================================

window.addEventListener('offline', () => {

    window.isOffline = true;

    const banner =
        document.getElementById(
            'offlineBanner'
        );

    if (banner) {

        banner.classList.remove(
            'hidden'
        );
    }

    console.log(
        'Internet Offline'
    );

});


// =====================================================
// ONLINE AGAIN
// =====================================================

window.addEventListener('online', () => {

    window.isOffline = false;

    const banner =
        document.getElementById(
            'offlineBanner'
        );

    if (banner) {

        banner.classList.add(
            'hidden'
        );
    }

    showNotif(
        'Koneksi kembali normal',
        'success'
    );

    console.log(
        'Internet Online'
    );

});
