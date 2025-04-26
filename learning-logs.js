fetch('learning-logs/logs.json')
  .then(res => res.json())
  .then(logs => {
    const container = document.getElementById('log-container');
    logs.forEach(log => {
      fetch(`learning-logs/${log.file}`)
        .then(res => res.text())
        .then(markdown => {
          const html = marked.parse(markdown);
          const entry = document.createElement('div');
          entry.className = 'log-entry';
          entry.innerHTML = `
            <h2>${log.title}</h2>
            <p><strong>Category:</strong> ${log.category} | <strong>Date:</strong> ${log.date}</p>
            <p><strong>Tags:</strong> ${log.tags.join(', ')}</p>
            <div>${html}</div>
            <hr>
          `;
          container.appendChild(entry);
        });
    });
  });

  