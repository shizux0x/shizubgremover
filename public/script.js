// Configuration
const API_URL = '/api/remove-background';

// DOM Elements
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const uploadSection = document.getElementById('upload-section');
const previewSection = document.getElementById('preview-section');
const originalPreview = document.getElementById('original-preview');
const processedPreview = document.getElementById('processed-preview');
const processedContainer = document.getElementById('processed-container');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const processBtn = document.getElementById('process-btn');
const downloadBtn = document.getElementById('download-btn');
const resetBtn = document.getElementById('reset-btn');
const copyBtn = document.getElementById('copy-btn');
const shareBtn = document.getElementById('share-btn');
const historySection = document.getElementById('history-section');
const historyList = document.getElementById('history-list');

// Dark mode toggle logic
const darkToggle = document.getElementById('dark-toggle');
const darkIcon = document.getElementById('dark-icon');
const darkTooltip = document.getElementById('dark-tooltip');
function setDarkMode(on) {
  if(on) {
    document.documentElement.classList.add('dark');
    darkIcon.classList.remove('fa-moon', 'moon');
    darkIcon.classList.add('fa-sun', 'sun');
    if (darkTooltip) darkTooltip.textContent = 'Switch to light mode';
    darkToggle.setAttribute('aria-pressed', 'true');
    localStorage.setItem('shizu-dark', '1');
  } else {
    document.documentElement.classList.remove('dark');
    darkIcon.classList.remove('fa-sun', 'sun');
    darkIcon.classList.add('fa-moon', 'moon');
    if (darkTooltip) darkTooltip.textContent = 'Switch to dark mode';
    darkToggle.setAttribute('aria-pressed', 'false');
    localStorage.setItem('shizu-dark', '0');
  }
}
if(localStorage.getItem('shizu-dark') === '1' || (localStorage.getItem('shizu-dark') === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  setDarkMode(true);
} else {
  setDarkMode(false);
}
darkToggle.addEventListener('click', () => {
  setDarkMode(!document.documentElement.classList.contains('dark'));
});
darkToggle.addEventListener('keydown', (e) => {
  if(e.key === 'Enter' || e.key === ' ') {
    setDarkMode(!document.documentElement.classList.contains('dark'));
  }
});

// State
let selectedFile = null;
let processedImageUrl = null;
let history = [];

// Event Listeners
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
processBtn.addEventListener('click', processImage);
downloadBtn.addEventListener('click', downloadImage);
resetBtn.addEventListener('click', resetApp);
if (copyBtn) copyBtn.addEventListener('click', copyImageUrl);
if (shareBtn) shareBtn.addEventListener('click', shareImage);

// Drag and Drop Handlers
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('border-indigo-400', 'bg-indigo-50');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('border-indigo-400', 'bg-indigo-50');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

// File Selection Handler
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// File Processing
function handleFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file.');
        return;
    }
    // Validate file size (12MB limit)
    if (file.size > 12 * 1024 * 1024) {
        showError('File size must be less than 12MB.');
        return;
    }
    selectedFile = file;
    displayOriginalImage(file);
    showPreviewSection();
    hideError();
}

// Display Original Image
function displayOriginalImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        originalPreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Show Preview Section
function showPreviewSection() {
    uploadSection.classList.add('hidden');
    previewSection.classList.remove('hidden');
    downloadBtn.classList.add('hidden');
    processedPreview.classList.add('hidden');
    if (copyBtn) copyBtn.classList.add('hidden');
    if (shareBtn) shareBtn.classList.add('hidden');
    hideError();
}

// Process Image with Backend API
async function processImage() {
    if (!selectedFile) {
        showError('Please select an image first.');
        return;
    }
    showLoading();
    hideError();
    try {
        const formData = new FormData();
        formData.append('image', selectedFile);
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();
        processedImageUrl = URL.createObjectURL(blob);
        displayProcessedImage(processedImageUrl);
        showDownloadButton();
        addToHistory(processedImageUrl);
        if (copyBtn) copyBtn.classList.remove('hidden');
        if (shareBtn) shareBtn.classList.remove('hidden');
        updateShareButtonVisibility();
    } catch (error) {
        console.error('Error processing image:', error);
        showError(error.message || 'Failed to process image. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display Processed Image
function displayProcessedImage(imageUrl) {
    processedPreview.src = imageUrl;
    processedPreview.classList.remove('hidden');
    processedPreview.style.opacity = '0';
    processedPreview.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => {
        processedPreview.style.opacity = '1';
    }, 100);
    processedImageUrl = imageUrl;
    downloadBtn.classList.remove('hidden');
    copyBtn.classList.remove('hidden');
    updateShareButtonVisibility();
}

// Download Image
function downloadImage() {
    if (!processedImageUrl) {
        showError('No processed image available for download.');
        return;
    }
    const link = document.createElement('a');
    link.href = processedImageUrl;
    link.download = `background-removed-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Copy to Clipboard
function copyImageUrl() {
    if (!processedImageUrl) return;
    navigator.clipboard.writeText(processedImageUrl).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy mr-2"></i>Copy URL';
        }, 1200);
    });
}

// Share Image
async function shareImage() {
    if (!processedImageUrl) return;
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Shizu BG Remover',
                text: 'Check out this image with the background removed!',
                url: processedImageUrl
            });
        } catch (err) {
            // User cancelled or error
        }
    } else {
        // Fallback: copy to clipboard and show a tooltip/modal
        try {
            await navigator.clipboard.writeText(processedImageUrl);
            showToast('Image URL copied! Share it anywhere.');
        } catch (err) {
            alert('Sharing is not supported on this device. Please copy the image URL manually.');
        }
    }
}

// Reset Application
function resetApp() {
    selectedFile = null;
    processedImageUrl = null;
    uploadSection.classList.remove('hidden');
    previewSection.classList.add('hidden');
    fileInput.value = '';
    originalPreview.src = '';
    processedPreview.src = '';
    downloadBtn.classList.add('hidden');
    processedPreview.classList.add('hidden');
    if (copyBtn) copyBtn.classList.add('hidden');
    if (shareBtn) shareBtn.classList.add('hidden');
    hideError();
    hideLoading();
    updateShareButtonVisibility();
}

// Loading State Handlers
function showLoading() {
    loading.classList.remove('hidden');
    processBtn.disabled = true;
    processBtn.classList.add('opacity-50', 'cursor-not-allowed');
}
function hideLoading() {
    loading.classList.add('hidden');
    processBtn.disabled = false;
    processBtn.classList.remove('opacity-50', 'cursor-not-allowed');
}

// Error State Handlers
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    processedPreview.classList.add('hidden');
}
function hideError() {
    errorMessage.classList.add('hidden');
}

// Show Download Button
function showDownloadButton() {
    downloadBtn.classList.remove('hidden');
    downloadBtn.style.transform = 'translateY(20px)';
    downloadBtn.style.opacity = '0';
    downloadBtn.style.transition = 'all 0.3s ease-out';
    setTimeout(() => {
        downloadBtn.style.transform = 'translateY(0)';
        downloadBtn.style.opacity = '1';
    }, 100);
}

// History Feature
function addToHistory(imageUrl) {
    if (!imageUrl) return;
    history.unshift(imageUrl);
    if (history.length > 3) history = history.slice(0, 3);
    renderHistory();
}
function renderHistory() {
    if (!historySection || !historyList) return;
    if (history.length === 0) {
        historySection.classList.add('hidden');
        return;
    }
    historySection.classList.remove('hidden');
    historyList.innerHTML = '';
    history.forEach((url, idx) => {
        const div = document.createElement('div');
        div.className = 'rounded-lg overflow-hidden shadow-md bg-slate-100 dark:bg-slate-800 w-20 h-20 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform';
        div.title = 'Click to view';
        const img = document.createElement('img');
        img.src = url;
        img.alt = `History ${idx+1}`;
        img.className = 'w-full h-full object-contain';
        div.appendChild(img);
        div.onclick = () => {
            processedPreview.src = url;
            processedPreview.classList.remove('hidden');
            processedImageUrl = url;
            showDownloadButton();
            if (copyBtn) copyBtn.classList.remove('hidden');
            if (shareBtn) shareBtn.classList.remove('hidden');
        };
        historyList.appendChild(div);
    });
}
// Testimonial carousel logic is in index.html

// Add smooth animations for upload area
uploadArea.addEventListener('dragenter', (e) => {
    e.preventDefault();
    uploadArea.classList.add('scale-105', 'shadow-lg');
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    if (!uploadArea.contains(e.relatedTarget)) {
        uploadArea.classList.remove('scale-105', 'shadow-lg', 'border-indigo-400', 'bg-indigo-50');
    }
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('Background Remover App initialized');
    console.log('Make sure to set your REMOVE_BG_API_KEY in the .env file');
});

// Only show share button if sharing is possible or fallback is available
function updateShareButtonVisibility() {
    if (!shareBtn) return;
    if (processedImageUrl && (navigator.share || navigator.clipboard)) {
        shareBtn.classList.remove('hidden');
    } else {
        shareBtn.classList.add('hidden');
    }
}

// Call updateShareButtonVisibility() after processing image
function showProcessedImage(url) {
    processedImageUrl = url;
    processedPreview.src = url;
    processedPreview.classList.remove('hidden');
    downloadBtn.classList.remove('hidden');
    copyBtn.classList.remove('hidden');
    updateShareButtonVisibility();
    // ... existing code ...
}

// Call updateShareButtonVisibility() in reset/clear logic
function resetUI() {
    // ... existing code ...
    updateShareButtonVisibility();
    // ... existing code ...
}

// Call updateShareButtonVisibility() in reset/clear logic
function showToast(message) {
    // ... existing code ...
} 