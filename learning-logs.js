let logs = [];
let currentIndex = 0;

// Fetch the list of logs
fetch(`learning-logs/logs.json`)
  .then(res => res.json())
  .then(data => {
    logs = data;
    renderPostList();
  });

// Render list of posts
function renderPostList() {
    const logList = document.getElementById('log-list');
    logList.innerHTML = '';

    logs.forEach((log, index) => {
        fetch(`learning-logs/${log.file}`)
            .then(res => res.text())
            .then(markdown => {
                const cleanMarkdown = removeFrontMatter(markdown);
                const preview = generatePreview(cleanMarkdown);

                const card = document.createElement('div');
                card.className = 'post-card';
                card.innerHTML = `
                    <h2>${log.title}</h2>
                    <div class="post-preview">
                        <p><strong>Category:</strong> ${log.category}</p>
                        <p><strong>Date:</strong> ${log.date}</p>
                        <p>${preview}</p>
                        <button class="read-more-button" data-index="${index}">Read More</button>
                    </div>
                    `;
                
                card.addEventListener('click', () => {
                    loadPost(index);
                });

                logList.appendChild(card);
            });
        });
    }

// Lod full post
function loadPost(index) {
    const post = logs[index];
    fetch(`learning-logs/${post.file}`)
        .then(res => res.text())
        .then(markdown => {
            const cleanMarkdown = removeFrontMatter(markdown);
            const html = marked.parse(cleanMarkdown);
            document.getElementById('post-content').innerHTML = `
                <h2>${post.title}</h2>
                <p><strong>Category:</strong> ${post.category} | <strong>Date:</strong> ${post.date}</p>
                <div>${html}</div>
            `;
            currentIndex = index;
            document.getElementById('post-list-view').style.display = 'none';
            document.getElementById('single-post-view').style.display = 'block';
        });
}

// Remove front matter (--metadata--- section)
function removeFrontMatter(markdown) {
    return markdown.replace(/^---[\s\S]+?---/, '').trim();
}

// Generate preview from clean markdown
function generatePreview(markdown) {
    const words = markdown.split(/\s+/).slice(0, 50).join(' ');
    return words + '...';
}

// Button: Back to List
document.getElementById('back-to-list').addEventListener('click', () => {
    document.getElementById('post-list-view').style.display = 'block';
    document.getElementById('single-post-view').style.display = 'none';
});

// Button: Previous Post
document.getElementById('prev-post').addEventListener('click', () => {
    if (currentIndex > 0) {
        loadPost(currentIndex - 1);
    }
});

// Button: Next Post
document.getElementById('next-post').addEventListener('click', () => {
    if (currentIndex < logs.length - 1) {
        loadPost(currentIndex + 1);
    }
});

// Theme toggle
const toggleButton = document.getElementById('theme-toggle');

toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // Update button text
    if (document.body.classList.contains('dark-mode')) {
        toggleButton.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        toggleButton.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    }
});

// On page load, check saved theme
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        toggleButton.textContent = 'Light Mode';
    }
});

function updateButtons() {
  document.getElementById('prev-btn').disabled = currentIndex === 0;
  document.getElementById('next-btn').disabled = currentIndex === logs.length - 1;
}

document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentIndex > 0) {
    fadeOutAndShow(currentIndex - 1);
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  if (currentIndex < logs.length - 1) {
    fadeOutAndShow(currentIndex + 1);
  }
});

function fadeOutAndShow(newIndex) {
    const container = document.getElementById('log-container');
    container.classList.add('fade-out');

    setTimeout(() => {
        currentIndex = newIndex;
        showLog(currentIndex);
        container.classList.remove('fade-out');
    }, 500);
}


  