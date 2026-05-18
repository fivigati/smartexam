// --- Update Logic Login (Auto-save & Session Data) ---
    async function handleLogin(e) {
        e.preventDefault();
        const id = document.getElementById('studentId').value;
        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Memverifikasi...';
        
        try {
            const res = await fetch(scriptURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'verifyStudent',
                    nisn: id
                })
            });
            const r = await res.json();
            if(r.success) {
                // Auto-save ID
                const remember = document.getElementById('rememberId').checked;

                if (remember) {
                localStorage.setItem('smartExam_id', id);
                } else {
                localStorage.removeItem('smartExam_id');
                }
                
    // Simpan Session Data
sessionData.nisn = id;
sessionData.npsn = r.student.school_npsn;
sessionData.subject = r.exam.subject;
sessionData.exit_token =
    r.exam.exit ||
    r.exam.exit_token ||
    "";
    // Config sekolah
sessionData.minExitMinutes =
    r.config.min_exit_minutes || 10;

                document.getElementById('loginSection').classList.add('hidden');
                document.getElementById('studentSection').classList.remove('hidden');
                document.getElementById('studentName').innerText = r.student.full_name;
                document.getElementById('studentClass').innerText = r.student.class_name;
                document.getElementById('studentSchool').innerText = r.school.school_name;
                document.getElementById('studentSection').dataset.duration = r.exam.duration || 90;
                renderExam(r.exam);
                showNotif('Identitas terverifikasi', 'success');
            } else {
                showNotif(r.message || 'ID tidak ditemukan', 'error');
            }
        } catch (err) { showNotif('Gagal terhubung ke server', 'error'); } 
        finally { btn.disabled = false; btn.innerHTML = 'Verifikasi ID'; }
    }

    function renderExam(exam) {
        const container = document.getElementById('examContainer');
        if(exam && exam.status === 'ACTIVE') {
            correctToken = (exam.token || "").toString().trim();
            examLink = exam.link;
            container.innerHTML = `
                <div class="bg-white rounded-[2rem] shadow-sm p-5 border border-slate-100 fade-in text-center">
                    <div class="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black mb-4 border border-emerald-100 uppercase tracking-widest">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Ujian Aktif
                    </div>
                    <h3 class="text-sm font-extrabold text-slate-800 mb-1">${exam.subject}</h3>
                    <div class="flex justify-center gap-3 text-[10px] font-bold text-slate-400 mb-5">
                        <span><i class="far fa-clock mr-1 text-indigo-400"></i> ${exam.start_time} - ${exam.end_time}</span>
                        <span><i class="fas fa-hourglass-half mr-1 text-indigo-400"></i> ${exam.duration || 0} Menit</span>
                    </div>
                    <div class="mb-4 text-left">
                        <label class="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1 tracking-widest">Token Ujian</label>
                        <input type="text" id="tokenInput" placeholder="••••••" class="block w-full px-4 py-3 text-center text-lg tracking-[0.3em] text-indigo-600 rounded-2xl font-black uppercase bg-[#F8FAFF] border border-[#EDF2FF] focus:bg-white focus:border-indigo-500 outline-none transition-all">
                    </div>
                    <button onclick="startExam()" class="btn-gradient w-full py-3.5 text-white font-bold rounded-2xl text-sm">Mulai Ujian</button>
                </div>`;
        } else {
            container.innerHTML = `<div class="bg-slate-50/50 border border-dashed border-slate-200 rounded-[2rem] p-8 text-center fade-in"><i class="fas fa-calendar-times text-slate-200 text-3xl mb-3"></i><div class="text-xs font-bold text-slate-400 uppercase tracking-widest">Tidak Ada Jadwal Aktif</div></div>`;
        }
    }
