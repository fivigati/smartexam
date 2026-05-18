// =====================================================
// WAKE LOCK
// =====================================================
async function aktifkanWakeLock() {
      if ('wakeLock' in navigator) {
            try {sessionData.wakeLock =
                  await navigator.wakeLock.request('screen');
                 console.log("WakeLock aktif");} 
            catch (err) {console.log("WakeLock gagal:", err);}
            } 
      else {console.log("WakeLock tidak didukung");}
}

// =====================================================
// AUTO RE-ACTIVATE WAKE LOCK
// =====================================================
document.addEventListener("visibilitychange", async () => {
    if (sessionData.wakeLock !== null &&document.visibilityState === "visible") {
          try {sessionData.wakeLock =
                await navigator.wakeLock.request('screen');
               console.log("WakeLock aktif kembali");} 
          catch (err) {console.log("WakeLock reaktif gagal:", err);}
    }
});

// =====================================================
// FULLSCREEN
// =====================================================

async function enterFullscreen() {
      try {const el = document.documentElement;
           if (el.requestFullscreen) {await el.requestFullscreen();} 
           else if (el.webkitRequestFullscreen) {await el.webkitRequestFullscreen();}
      return true;
          } catch (err) {
            console.log("Fullscreen gagal:", err);
            return false;}
}

document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {aktifkanWakeLock();}
});
