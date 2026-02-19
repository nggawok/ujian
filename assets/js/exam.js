
(async function(){
  const cfg = await CBT.loadConfig();
  const id = JSON.parse(localStorage.getItem('cbt_identity')||'null');
  const overrides = JSON.parse(sessionStorage.getItem('cbt_overrides')||'{}');
  if(!id){
    alert('Identitas tidak ditemukan. Kembali ke beranda.');
    location.href = 'index.html';
    return;
  }

  const examTitle = cfg.examTitle || 'Ujian CBT';
  document.getElementById('examHeader').textContent = `${examTitle} — ${id.nama} (${id.idp})`;

  // Load questions
  let questions = await CBT.loadQuestions();
  if(overrides.shuffleQuestions ?? cfg.shuffleQuestions){
    questions = CBT.shuffle(questions);
  }
  const maxQ = Math.min(overrides.maxQuestions || cfg.maxQuestions || questions.length, questions.length);
  questions = questions.slice(0, maxQ);

  if(cfg.shuffleOptions){
    questions = questions.map(q=>{
      const idx = q.answer;
      const pairs = q.options.map((opt,i)=>({opt,i}));
      const shuffled = CBT.shuffle(pairs);
      const newOptions = shuffled.map(p=>p.opt);
      const newAnswer = shuffled.findIndex(p=>p.i===idx);
      return {...q, options:newOptions, answer:newAnswer};
    });
  }

  let idx = 0;
  const answers = new Array(questions.length).fill(null);

  const qArea = document.getElementById('questionArea');
  const meta = document.getElementById('meta');
  const progress = document.getElementById('progressBar');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');

  function render(){
    meta.textContent = `Soal ${idx+1} dari ${questions.length}`;
    progress.style.width = `${((idx+1)/questions.length)*100}%`;
    const q = questions[idx];
    const selected = answers[idx];
    qArea.innerHTML = `
      <div>
        <h3>${q.question}</h3>
        <div class="grid" style="margin-top:12px">
          ${q.options.map((opt,i)=>`
            <label class="option ${selected===i?'selected':''}">
              <input type="radio" name="opt" value="${i}" ${selected===i?'checked':''} /> ${opt}
            </label>
          `).join('')}
        </div>
      </div>`;

    qArea.querySelectorAll('input[name="opt"]').forEach(inp=>{
      inp.addEventListener('change', (e)=>{
        answers[idx] = parseInt(e.target.value,10);
      });
    });

    prevBtn.disabled = idx===0;
    nextBtn.disabled = idx===questions.length-1;
  }

  prevBtn.addEventListener('click', ()=>{ if(idx>0){ idx--; render(); } });
  nextBtn.addEventListener('click', ()=>{ if(idx<questions.length-1){ idx++; render(); } });

  document.addEventListener('keydown', (e)=>{
    if(e.altKey && e.key==='ArrowRight'){ e.preventDefault(); if(idx<questions.length-1){ idx++; render(); } }
    if(e.altKey && e.key==='ArrowLeft'){ e.preventDefault(); if(idx>0){ idx--; render(); } }
  });

  // Timer
  const totalSec = (cfg.durationMinutes||15)*60; let remain = totalSec;
  const timerEl = document.getElementById('timer');
  timerEl.textContent = CBT.formatTime(remain);
  const t = setInterval(()=>{
    remain--; timerEl.textContent = CBT.formatTime(remain);
    if(remain<=0){ clearInterval(t); doSubmit(true); }
  }, 1000);

  function score(){
    let correct = 0; const detail = [];
    questions.forEach((q,i)=>{
      const isCorrect = answers[i]===q.answer;
      if(isCorrect) correct++;
      detail.push({
        id:q.id, q:q.question, selected: answers[i], correct: q.answer,
        options:q.options, isCorrect
      });
    });
    return {correct, total:questions.length, detail};
  }

  function saveAttempt(result){
    const key = 'cbt_history';
    const hist = JSON.parse(localStorage.getItem(key)||'[]');
    hist.push(result);
    localStorage.setItem(key, JSON.stringify(hist));
  }

  function showReview(result){
    qArea.innerHTML = '';
    const h = document.createElement('div');
    const percent = Math.round((result.correct/result.total)*100);
    h.innerHTML = `<h2>Skor Anda: ${result.correct}/${result.total} (${percent}%)</h2>`;
    if(true) h.innerHTML += `<p class="small">Tinjauan soal ditampilkan di bawah ini.</p>`;
    qArea.appendChild(h);

    if(true){
      result.detail.forEach((d, i)=>{
        const wrap = document.createElement('div');
        wrap.style.marginTop = '12px';
        wrap.innerHTML = `
          <div class="card" style="padding:12px">
            <div class="small">Soal ${i+1}</div>
            <div style="margin:6px 0 8px 0">${d.q}</div>
            <div class="grid">
              ${d.options.map((opt,idx)=>{
                const cls = idx===d.correct ? 'correct' : (idx===d.selected && idx!==d.correct ? 'incorrect':'' );
                const mark = idx===d.correct ? '✓' : (idx===d.selected && idx!==d.correct ? '✗' : '');
                return `<div class="option ${cls}">${mark} ${opt}</div>`
              }).join('')}
            </div>
          </div>`;
        qArea.appendChild(wrap);
      });
    }

    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    submitBtn.textContent = 'Lihat Riwayat';
    submitBtn.onclick = ()=> location.href = 'results.html';
  }

  function doSubmit(auto=false){
    const r = score();
    const now = new Date().toISOString();
    const payload = {
      examTitle, nama:id.nama, idp:id.idp, time: now,
      correct:r.correct, total:r.total, percent: Math.round((r.correct/r.total)*100),
      detail: r.detail
    };
    saveAttempt(payload);
    clearInterval(t);
    showReview(r);
  }

  document.getElementById('submitBtn').addEventListener('click', ()=>{
    if(confirm('Kumpulkan jawaban sekarang?')) doSubmit(false);
  });

  render();
})();
