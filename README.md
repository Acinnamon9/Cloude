# ☁️ Cloud Storage - Local File Manager

A modern, client-side cloud storage application that stores files locally in your browser. Built with pure HTML, CSS, and JavaScript - no backend required!

## 📋 Features

- **Local File Storage**: All files are stored locally in your browser using IndexedDB
- **Smart Categorization**: Files are automatically organized into categories:
  - 🖼️ **Pictures**: Image files (jpg, png, gif, etc.)
  - 🎥 **Videos**: Video files (mp4, webm, etc.)
  - 📄 **Files**: Regular documents and files
  - 💾 **Large Files**: Files larger than 10MB
- **Modern UI**: Clean, responsive design with smooth animations
- **Multiple Views**: Switch between grid and list view
- **File Preview**: Preview images and videos directly in the browser
- **Search Functionality**: Quickly find files by name
- **Storage Statistics**: Monitor total files and storage usage
- **File Management**: Upload, preview, download, and delete files

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- No server or installation required!

### Installation

1. Download or clone this repository
2. Open `index.html` in your web browser
3. That's it! Start uploading files

## 📖 How to Use

### Uploading Files

1. Click the **"📤 Upload Files"** button
2. Select one or multiple files from your computer
3. Files will be automatically categorized and stored

### Viewing Files

- **All Files**: View all uploaded files
- **By Category**: Click on any category in the sidebar to filter files
- **Search**: Use the search box to find specific files by name

### File Actions

- **Preview**: Click on any file card to preview it
  - Images and videos will display in a modal
  - Other files will show download option
- **Delete**: Hover over a file card and click the 🗑️ delete button
- **View Toggle**: Switch between grid (⊞) and list (☰) views using the toolbar buttons

### Storage Information

The sidebar displays:
- Total number of files stored
- Total storage space used

## 🗂️ Data Storage

All data is stored locally in your browser using **IndexedDB**:
- **Database Name**: `man`
- **Storage Location**: Browser's local storage
- **Persistence**: Data persists even after closing the browser
- **Privacy**: All files remain on your device - nothing is uploaded to any server

## 🛠️ Technology Stack

- **HTML5**: Structure and semantic markup
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript (ES6+)**: File handling and IndexedDB operations
- **IndexedDB API**: Local database storage
- **File API**: File reading and manipulation

## 📁 Project Structure

```
.
├── index.html      # Main HTML file
├── styles.css      # All styling
├── app.js          # Application logic
└── README.md       # This file
```

## 🎨 Features in Detail

### Automatic File Categorization

Files are automatically categorized based on:
- **File Type**: Images and videos are detected by MIME type
- **File Size**: Files over 10MB are categorized as "Large Files"
- **Default**: Other files go into the "Files" category

### Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

### Browser Compatibility

Works best with:
- ✅ Chrome/Edge (Chromium) - Full support
- ✅ Firefox - Full support
- ✅ Safari - Full support
- ⚠️ Older browsers may have limited IndexedDB support

## 🔒 Privacy & Security

- **100% Local**: All files are stored on your device
- **No Internet Required**: Works completely offline
- **No Data Collection**: No analytics, no tracking, no external services
- **Browser-Based**: Uses your browser's built-in storage capabilities

## 📝 Notes

- **Storage Limits**: Browser storage limits vary (typically 50-100MB, but can be much more)
- **Browser Data**: Clearing browser data will delete stored files
- **Backup**: Consider exporting important files regularly
- **Large Files**: Very large files may take time to upload/process

## 🐛 Troubleshooting

### Files not uploading?
- Check browser console for errors
- Ensure browser supports IndexedDB
- Try refreshing the page

### Files not displaying?
- Check if files are filtered by category
- Clear search box if active
- Refresh the page

### Storage full?
- Delete unused files
- Clear old files to free up space
- Browser storage limits may apply

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Feel free to fork, modify, and use this project for your needs!

## 📧 Support

For issues or questions, please check the browser console for error messages.

---

**Enjoy your local cloud storage!** ☁️✨

