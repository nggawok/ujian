
(function(){
  const key = 'cbt_history';
  const hist = JSON.parse(localStorage.getItem(key)||'[]');
  const root = document.getElementById('history');
  if(hist.length===0){ root.innerHTML = '<p>Belum ada hasil tersimpan di perangkat ini.</p>'; return; }

  const table = document.createElement('table');
  table.style.width='100%';
  table.style.borderCollapse='collapse';
  table.innerHTML = `
    <thead>
      <tr>
        <th style="text-align:left;border-bottom:1px solid #1f2a4a;padding:8px">Waktu</th>
        <th style="text-align:left;border-bottom:1px solid #1f2a4a;padding:8px">Nama</th>
        <th style="text-align:left;border-bottom:1px solid #1f2a4a;padding:8px">ID</th>
        <th style="text-align:right;border-bottom:1px solid #1f2a4a;padding:8px">Skor</th>
        <th style="text-align:right;border-bottom:1px solid #1f2a4a;padding:8px">%</th>
        <th style="text-align:center;border-bottom:1px solid #1f2a4a;padding:8px">Detail</th>
      </tr>
    </thead>
    <tbody></tbody>`;
  const tbody = table.querySelector('tbody');

  hist.forEach((h, i)=>{
    const tr = document.createElement('tr');
    const when = new Date(h.time).toLocaleString();
    tr.innerHTML = `
      <td style="padding:8px;border-bottom:1px solid #1f2a4a">${when}</td>
      <td style="padding:8px;border-bottom:1px solid #1f2a4a">${h.nama}</td>
      <td style="padding:8px;border-bottom:1px solid #1f2a4a">${h.idp}</td>
      <td style="padding:8px;border-bottom:1px solid #1f2a4a;text-align:right">${h.correct}/${h.total}</td>
      <td style="padding:8px;border-bottom:1px solid #1f2a4a;text-align:right">${h.percent}%</td>
      <td style="padding:8px;border-bottom:1px solid #1f2a4a;text-align:center">
        <button class="btn secondary" data-i="${i}">Lihat</button>
      </td>`;
    tbody.appendChild(tr);
  });

  root.innerHTML='';
  root.appendChild(table);

  root.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-i]');
    if(!btn) return;
    const i = parseInt(btn.getAttribute('data-i'),10);
    const h = hist[i];
    const detail = h.detail.map((d,idx)=>{
      const sel = d.selected!=null ? d.options[d.selected] : '(tidak dijawab)';
      return `Soal ${idx+1}: ${d.q}
Jawaban Anda: ${sel}
Kunci: ${d.options[d.correct]}
Benar: ${d.isCorrect?'Ya':'Tidak'}
`;
    }).join('
');
    alert(`${h.examTitle}
${h.nama} (${h.idp})
Skor: ${h.correct}/${h.total} (${h.percent}%)

${detail}`);
  });

  document.getElementById('downloadCsv').addEventListener('click', ()=>{
    const rows = [
      ['time','examTitle','nama','idp','correct','total','percent']
    ];
    hist.forEach(h=>{
      rows.push([h.time, h.examTitle, h.nama, h.idp, h.correct, h.total, h.percent]);
    });
    const csv = rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('
');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'cbt-history.csv'; a.click();
    URL.revokeObjectURL(url);
  });
})();
