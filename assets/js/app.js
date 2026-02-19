
window.CBT = {
  async loadConfig(){
    const res = await fetch('cbt-config.json');
    if(!res.ok) throw new Error('Gagal memuat konfigurasi');
    return await res.json();
  },
  async loadQuestions(){
    const res = await fetch('data/questions.json');
    if(!res.ok) throw new Error('Gagal memuat bank soal');
    return await res.json();
  },
  shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  },
  formatTime(sec){
    const m = Math.floor(sec/60).toString().padStart(2,'0');
    const s = Math.floor(sec%60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }
};
