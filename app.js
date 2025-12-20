// Database configuration - "man" database
const DB_NAME = 'man';
const DB_VERSION = 1;
const STORE_NAME = 'files';

// File size thresholds
const LARGE_FILE_THRESHOLD = 10 * 1024 * 1024; // 10MB

// Global variables
let db = null;
let currentCategory = 'all';
let currentView = 'grid';
let allFiles = [];
let filteredFiles = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeDB();
    setupEventListeners();
});

// Initialize IndexedDB
function initializeDB() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
        console.error('Database failed to open');
        alert('Failed to initialize database. Please check browser compatibility.');
    };

    request.onsuccess = () => {
        db = request.result;
        loadFiles();
        updateStorageInfo();
    };

    request.onupgradeneeded = (event) => {
        const database = event.target.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
            const objectStore = database.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('category', 'category', { unique: false });
            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('date', 'date', { unique: false });
        }
    };
}

// Setup event listeners
function setupEventListeners() {
    // Upload button
    document.getElementById('uploadBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });

    // File input change
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);

    // Category selection
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentCategory = item.dataset.category;
            filterFiles();
        });
    });

    // Search input
    document.getElementById('searchInput').addEventListener('input', (e) => {
        filterFiles(e.target.value);
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            renderFiles();
        });
    });

    // Modal close
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('previewModal').addEventListener('click', (e) => {
        if (e.target.id === 'previewModal') {
            closeModal();
        }
    });
}

// Handle file upload
function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    files.forEach(file => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const fileData = {
                name: file.name,
                type: file.type,
                size: file.size,
                category: categorizeFile(file),
                data: e.target.result,
                date: new Date().toISOString()
            };

            saveFile(fileData);
        };

        reader.readAsDataURL(file);
    });

    // Reset input
    event.target.value = '';
}

// Categorize file
function categorizeFile(file) {
    const type = file.type.toLowerCase();
    const size = file.size;

    if (type.startsWith('image/')) {
        return 'picture';
    } else if (type.startsWith('video/')) {
        return 'video';
    } else if (size >= LARGE_FILE_THRESHOLD) {
        return 'large';
    } else {
        return 'file';
    }
}

// Save file to IndexedDB
function saveFile(fileData) {
    if (!db) {
        setTimeout(() => saveFile(fileData), 100);
        return;
    }

    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.add(fileData);

    request.onsuccess = () => {
        loadFiles();
        updateStorageInfo();
    };

    request.onerror = () => {
        console.error('Error saving file');
        alert('Failed to save file. Please try again.');
    };
}

// Load all files from IndexedDB
function loadFiles() {
    if (!db) {
        setTimeout(loadFiles, 100);
        return;
    }

    const transaction = db.transaction([STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.getAll();

    request.onsuccess = () => {
        allFiles = request.result;
        filterFiles();
    };

    request.onerror = () => {
        console.error('Error loading files');
    };
}

// Filter files by category and search
function filterFiles(searchTerm = '') {
    filteredFiles = allFiles.filter(file => {
        // Category filter
        const categoryMatch = currentCategory === 'all' || file.category === currentCategory;
        
        // Search filter
        const searchMatch = !searchTerm || 
            file.name.toLowerCase().includes(searchTerm.toLowerCase());

        return categoryMatch && searchMatch;
    });

    renderFiles();
}

// Render files to the DOM
function renderFiles() {
    const container = document.getElementById('filesContainer');
    
    if (filteredFiles.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📂</div>
                <h2>No files found</h2>
                <p>Try uploading files or changing the filter.</p>
            </div>
        `;
        return;
    }

    container.className = `files-container ${currentView}-view`;
    container.innerHTML = filteredFiles.map(file => createFileCard(file)).join('');

    // Add event listeners to file cards
    container.querySelectorAll('.file-card').forEach((card, index) => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('action-btn')) {
                previewFile(filteredFiles[index]);
            }
        });
    });

    // Add delete button listeners
    container.querySelectorAll('.delete-btn').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteFile(filteredFiles[index].id);
        });
    });
}

// Create file card HTML
function createFileCard(file) {
    const icon = getFileIcon(file);
    const size = formatFileSize(file.size);
    const date = new Date(file.date).toLocaleDateString();

    if (currentView === 'list') {
        return `
            <div class="file-card list-item">
                <div class="file-icon">${icon}</div>
                <div class="file-info">
                    <div class="file-name">${escapeHtml(file.name)}</div>
                    <div class="file-size">${size} • ${date} • ${file.category}</div>
                </div>
                <div class="file-actions">
                    <button class="action-btn delete-btn" title="Delete">🗑️</button>
                </div>
            </div>
        `;
    }

    return `
        <div class="file-card">
            <div class="file-actions">
                <button class="action-btn delete-btn" title="Delete">🗑️</button>
            </div>
            <div class="file-icon">${icon}</div>
            <div class="file-info">
                <div class="file-name">${escapeHtml(file.name)}</div>
                <div class="file-size">${size}</div>
            </div>
        </div>
    `;
}

// Get file icon based on category
function getFileIcon(file) {
    const icons = {
        picture: '🖼️',
        video: '🎥',
        file: '📄',
        large: '💾'
    };
    return icons[file.category] || '📄';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Preview file in modal
function previewFile(file) {
    const modal = document.getElementById('previewModal');
    const modalBody = document.getElementById('modalBody');
    
    let content = '';

    if (file.category === 'picture') {
        content = `<img src="${file.data}" alt="${escapeHtml(file.name)}">`;
    } else if (file.category === 'video') {
        content = `<video controls><source src="${file.data}" type="${file.type}"></video>`;
    } else {
        // For other files, show download option
        content = `
            <div style="text-align: center; padding: 40px;">
                <div style="font-size: 4em; margin-bottom: 20px;">${getFileIcon(file)}</div>
                <h2>${escapeHtml(file.name)}</h2>
                <p style="color: var(--text-secondary); margin: 20px 0;">${formatFileSize(file.size)}</p>
                <a href="${file.data}" download="${file.name}" class="btn btn-primary" style="display: inline-block; text-decoration: none; margin-top: 20px;">
                    📥 Download File
                </a>
            </div>
        `;
    }

    modalBody.innerHTML = `
        <h2 style="margin-bottom: 20px;">${escapeHtml(file.name)}</h2>
        ${content}
        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid var(--border-color);">
            <p><strong>Category:</strong> ${file.category}</p>
            <p><strong>Size:</strong> ${formatFileSize(file.size)}</p>
            <p><strong>Date:</strong> ${new Date(file.date).toLocaleString()}</p>
        </div>
    `;

    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('previewModal').style.display = 'none';
}

// Delete file
function deleteFile(fileId) {
    if (!confirm('Are you sure you want to delete this file?')) {
        return;
    }

    if (!db) {
        alert('Database not initialized');
        return;
    }

    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.delete(fileId);

    request.onsuccess = () => {
        loadFiles();
        updateStorageInfo();
    };

    request.onerror = () => {
        alert('Failed to delete file');
    };
}

// Update storage information
function updateStorageInfo() {
    if (!db) {
        setTimeout(updateStorageInfo, 100);
        return;
    }

    const transaction = db.transaction([STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.getAll();

    request.onsuccess = () => {
        const files = request.result;
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        
        document.getElementById('totalFiles').textContent = files.length;
        document.getElementById('storageUsed').textContent = formatFileSize(totalSize);
    };
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

