    // --- Inisialisasi: Auto-Save ID & Fetch IP ---
    window.onload = () => {

    const savedId = localStorage.getItem('smartExam_id');

    if (savedId) {
        document.getElementById('studentId').value = savedId;
        document.getElementById('rememberId').checked = true;
    }

    fetchIP();
};

    async function fetchIP() {
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            sessionData.userIP = data.ip;
        } catch (e) { console.log("Gagal ambil IP"); }
    }
