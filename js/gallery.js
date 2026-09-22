/**
 * Reusable Gallery Component for Banu's Marriage Bio-Data & Portfolio
 * Supports: Grid rendering, Category filtering, Lightbox modal with zoom & navigation,
 * and Live Client-Side Photo Uploader for previewing additional real photos.
 */

class ReusableGallery {
  constructor(options = {}) {
    this.containerId = options.containerId || 'gallery-grid';
    this.lightboxId = options.lightboxId || 'lightbox-modal';
    this.activeCategory = 'all';
    this.currentIndex = 0;
    
    // Strict adherence: Default photos ONLY from the authentic uploaded photos
    this.photos = [
      {
        id: 'photo-1',
        src: 'assets/images/photo-1.jpg?v=20260922_2225',
        title: 'Portrait in Green Silk',
        category: 'portrait',
        categoryLabel: 'Grace & Poise',
        description: 'Traditional portrait in emerald green saree with golden embroidery'
      },
      {
        id: 'photo-2',
        src: 'assets/images/photo-2.jpg?v=20260922_2225',
        title: 'Festive Ethnic Elegance',
        category: 'traditional',
        categoryLabel: 'Traditional Attire',
        description: 'Full-length traditional attire featuring rich zari borders and classic jewelry'
      },
      {
        id: 'photo-3',
        src: 'assets/images/photo-3.jpg?v=20260922_2225',
        title: 'Coastal Serenity',
        category: 'outdoor',
        categoryLabel: 'Outdoor & Casual',
        description: 'Radiant seaside moment in embellished peacock teal gown'
      }
    ];

    // Load any user-added photos stored in localStorage
    this.loadPersistedPhotos();

    this.init();
  }

  init() {
    this.container = document.getElementById(this.containerId);
    this.lightbox = document.getElementById(this.lightboxId);

    if (!this.container) return;

    this.render();
    this.setupLightboxEvents();
    this.setupFilterEvents();
    this.setupUploaderEvents();
  }

  loadPersistedPhotos() {
    try {
      const saved = localStorage.getItem('banu_custom_photos');
      if (saved) {
        const customPhotos = JSON.parse(saved);
        if (Array.isArray(customPhotos)) {
          this.photos = [...this.photos, ...customPhotos];
        }
      }
    } catch (e) {
      console.warn('Could not load custom photos from localStorage', e);
    }
  }

  savePersistedPhotos(customList) {
    try {
      localStorage.setItem('banu_custom_photos', JSON.stringify(customList));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }

  getFilteredPhotos() {
    if (this.activeCategory === 'all') {
      return this.photos;
    }
    return this.photos.filter(p => p.category === this.activeCategory);
  }

  render() {
    if (!this.container) return;
    
    const visiblePhotos = this.getFilteredPhotos();
    this.container.innerHTML = '';

    if (visiblePhotos.length === 0) {
      this.container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <p>No photos found in this category.</p>
        </div>
      `;
      return;
    }

    visiblePhotos.forEach((photo, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'gallery-item';
      itemEl.setAttribute('data-category', photo.category);
      itemEl.setAttribute('data-index', index);

      itemEl.innerHTML = `
        <img src="${photo.src}" alt="${photo.title}" loading="lazy" onerror="if (!this.dataset.retried) { this.dataset.retried = '1'; this.src = this.src.includes('.jpeg') ? this.src.replace('.jpeg', '.jpg') : this.src.replace('.jpg', '.jpeg'); }">
        <div class="gallery-overlay">
          <span class="gallery-category-tag">${photo.categoryLabel || photo.category}</span>
          <h4 class="gallery-photo-title">${photo.title}</h4>
          <p class="gallery-photo-desc">${photo.description || ''}</p>
        </div>
        <div class="gallery-zoom-icon" title="View Full Photo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
      `;

      itemEl.addEventListener('click', () => {
        this.openLightbox(index);
      });

      this.container.appendChild(itemEl);
    });
  }

  setupFilterEvents() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.activeCategory = e.currentTarget.getAttribute('data-filter') || 'all';
        this.render();
      });
    });
  }

  setupLightboxEvents() {
    if (!this.lightbox) return;

    const closeBtn = this.lightbox.querySelector('.lightbox-close-btn');
    const prevBtn = this.lightbox.querySelector('.lightbox-prev');
    const nextBtn = this.lightbox.querySelector('.lightbox-next');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeLightbox());
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prevPhoto();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.nextPhoto();
      });
    }

    // Backdrop click close
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.prevPhoto();
      if (e.key === 'ArrowRight') this.nextPhoto();
    });
  }

  openLightbox(index) {
    const visiblePhotos = this.getFilteredPhotos();
    if (!visiblePhotos[index]) return;

    this.currentIndex = index;
    const photo = visiblePhotos[index];

    const imgEl = this.lightbox.querySelector('.lightbox-img');
    const titleEl = this.lightbox.querySelector('.lightbox-caption-title');
    const descEl = this.lightbox.querySelector('.lightbox-caption-desc');

    if (imgEl) {
      imgEl.src = photo.src;
      imgEl.onerror = function() {
        if (!this.dataset.retried) {
          this.dataset.retried = '1';
          this.src = this.src.includes('.jpeg') ? this.src.replace('.jpeg', '.jpg') : this.src.replace('.jpg', '.jpeg');
        }
      };
    }
    if (titleEl) titleEl.textContent = photo.title;
    if (descEl) descEl.textContent = photo.description || '';

    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  nextPhoto() {
    const visiblePhotos = this.getFilteredPhotos();
    this.currentIndex = (this.currentIndex + 1) % visiblePhotos.length;
    this.openLightbox(this.currentIndex);
  }

  prevPhoto() {
    const visiblePhotos = this.getFilteredPhotos();
    this.currentIndex = (this.currentIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
    this.openLightbox(this.currentIndex);
  }

  /**
   * Client-side interactive photo uploader / manager
   * Allows the user to select their real photos right in the browser,
   * adds them into memory / localStorage, and renders them instantly.
   */
  setupUploaderEvents() {
    const openModalBtn = document.getElementById('open-add-photo-btn');
    const modal = document.getElementById('add-photo-modal');
    const closeBtn = document.getElementById('close-add-photo-modal');
    const dropzone = document.getElementById('photo-dropzone');
    const fileInput = document.getElementById('photo-file-input');
    const submitBtn = document.getElementById('submit-new-photo');

    if (!openModalBtn || !modal) return;

    openModalBtn.addEventListener('click', () => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
          this.handleSelectedFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
          this.handleSelectedFile(fileInput.files[0]);
        }
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const titleInput = document.getElementById('new-photo-title');
        const catSelect = document.getElementById('new-photo-category');
        const descInput = document.getElementById('new-photo-desc');

        if (!this.tempPhotoSrc) {
          alert('Please select or drop an image file first.');
          return;
        }

        const newPhoto = {
          id: 'custom-' + Date.now(),
          src: this.tempPhotoSrc,
          title: (titleInput && titleInput.value.trim()) || 'Banu S',
          category: (catSelect && catSelect.value) || 'portrait',
          categoryLabel: (catSelect && catSelect.options[catSelect.selectedIndex].text) || 'Special Moment',
          description: (descInput && descInput.value.trim()) || 'Photograph of Banu S'
        };

        this.photos.push(newPhoto);
        this.render();

        // Save custom photos
        const customPhotos = this.photos.filter(p => p.id.startsWith('custom-'));
        this.savePersistedPhotos(customPhotos);

        closeModal();

        // Reset
        this.tempPhotoSrc = null;
        if (titleInput) titleInput.value = '';
        if (descInput) descInput.value = '';
        if (dropzone) {
          dropzone.innerHTML = `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 0.5rem; color: var(--gold-primary);">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <p style="font-weight: 600; color: var(--gold-light);">Click to browse or drag & drop photo here</p>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Supports JPG, PNG, WebP</span>
          `;
        }
      });
    }
  }

  handleSelectedFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.tempPhotoSrc = e.target.result;
      const dropzone = document.getElementById('photo-dropzone');
      if (dropzone) {
        dropzone.innerHTML = `
          <img src="${this.tempPhotoSrc}" style="max-height: 140px; border-radius: 8px; margin-bottom: 0.5rem; border: 1px solid var(--gold-primary);">
          <p style="font-size: 0.85rem; color: var(--gold-light); font-weight: 600;">Selected: ${file.name}</p>
          <span style="font-size: 0.72rem; color: var(--emerald-accent);">Ready to add to Gallery</span>
        `;
      }
    };
    reader.readAsDataURL(file);
  }
}

// Global accessor
window.ReusableGallery = ReusableGallery;
