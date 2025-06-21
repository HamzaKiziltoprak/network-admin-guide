function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('hidden');
}

function toggleVisibility(id) {
  const allSections = [
    'ip-conflict',
    'Inter_vlan_communication_problem',
    'dhcp-issue',
    'dhcp-spoofing',
    'default-gateway-issue',
    'nat-issue',
    'eigrp-issue',
    'switch-loop',
    'gre-issue',
    'etherChannel-issue'
  ];

  // Tüm butonlardan active sınıfını kaldır
  document.querySelectorAll('.sidebar button').forEach(btn => {
    btn.classList.remove('active');
  });

  // Seçilen butona active sınıfını ekle
  const activeButton = document.getElementById(id + '-btn');
  if (activeButton) {
    activeButton.classList.add('active');
  }

  allSections.forEach(sectionId => {
    const element = document.getElementById(sectionId);
    if (element) {
      if (sectionId === id) {
        element.style.display = 'block';
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // İçerik görünür olduğunda animasyonları ve geliştirmeleri başlat
        setTimeout(() => {
          initializeImageZoom();
          addCopyButtons();
          createLayerBadges(element);
          initializeImageCaptions();
        }, 100);
      } else {
        element.style.display = 'none';
      }
    }
  });
  
  // Mobil görünümde sidebar'ı kapat
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.add('hidden');
  }
}

// Görüntülere tıklama ile yakınlaştırma işlevi
function initializeImageZoom() {
  document.querySelectorAll('.problem-details img').forEach(img => {
    // Zaten dinleyici eklenmiş olan görüntüleri atla
    if (img.getAttribute('data-zoom-enabled')) return;
    
    img.setAttribute('data-zoom-enabled', 'true');
    
    img.addEventListener('click', function() {
      // Overlay ekle
      let overlay = document.getElementById('zoom-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'zoom-overlay';
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', function() {
          document.querySelectorAll('.zoomed').forEach(img => {
            img.classList.remove('zoomed');
          });
          overlay.classList.remove('active');
          document.body.style.overflow = 'auto';
        });
      }
      
      // Yakınlaştırma durumunu değiştir
      if (this.classList.contains('zoomed')) {
        this.classList.remove('zoomed');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
      } else {
        this.classList.add('zoomed');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
}

// Kod bloklarına kopyalama butonu ekle
function addCopyButtons() {
  document.querySelectorAll('pre').forEach(block => {
    // Zaten buton eklenmiş blokları atla
    if (block.querySelector('.copy-button')) return;
    
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Kopyala';
    
    button.addEventListener('click', function() {
      const code = block.querySelector('code') || block;
      const text = code.textContent;
      
      navigator.clipboard.writeText(text).then(() => {
        const feedback = document.createElement('div');
        feedback.className = 'copy-feedback';
        feedback.textContent = 'Kopyalandı!';
        block.appendChild(feedback);
        
        setTimeout(() => {
          if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
          }
        }, 2000);
      });
    });
    
    block.appendChild(button);
  });
}

// OSI katman işaretlerini oluştur
function createLayerBadges(container) {
  const layerMentions = {
    'Physical Layer': 'l1',
    'Data Link Layer': 'l2', 
    'Network Layer': 'l3',
    'Transport Layer': 'l4',
    'Session Layer': 'l5',
    'Presentation Layer': 'l6',
    'Application Layer': 'l7'
  };
  
  const h2Element = container.querySelector('h2');
  if (!h2Element) return;
  
  // Zaten işaretleri eklenmiş başlıkları atla
  if (h2Element.querySelector('.layer-badge')) return;
  
  const title = h2Element.textContent;
  
  // Başlığa OSI katman işaretleri ekle
  Object.keys(layerMentions).forEach(layer => {
    if (title.includes(layer)) {
      const badge = document.createElement('span');
      badge.className = `layer-badge ${layerMentions[layer]}`;
      badge.textContent = layer.replace(' Layer', '');
      h2Element.insertBefore(badge, h2Element.firstChild);
    }
  });
  
  // Layer 3 için özel durum
  if (title.includes('L3') || title.includes('Network')) {
    const badge = document.createElement('span');
    badge.className = 'layer-badge l3';
    badge.textContent = 'Network';
    h2Element.insertBefore(badge, h2Element.firstChild);
  }
  
  // Layer 2 için özel durum
  if (title.includes('L2') || title.includes('Data Link')) {
    const badge = document.createElement('span');
    badge.className = 'layer-badge l2';
    badge.textContent = 'Data Link';
    h2Element.insertBefore(badge, h2Element.firstChild);
  }
}

// Görüntüler için altyazılar oluştur
function initializeImageCaptions() {
  document.querySelectorAll('.problem-details img').forEach(img => {
    // Zaten container içinde olan görüntüleri atla
    if (img.parentNode.classList.contains('image-container') || 
        img.parentNode.classList.contains('image-grid-item')) return;
    
    const alt = img.getAttribute('alt');
    if (!alt) return;
    
    // Görüntü için container oluştur
    const container = document.createElement('div');
    container.className = 'image-container';
    
    // Görüntünün üst öğesini bul ve container'ı onun yerine ekle
    const parent = img.parentNode;
    parent.insertBefore(container, img);
    container.appendChild(img);
    
    // Alt yazıyı container'a ekle
    const caption = document.createElement('div');
    caption.className = 'image-caption';
    caption.textContent = alt;
    container.appendChild(caption);
  });
}

// Tab butonlarını çalıştır
function initializeTabs() {
  document.querySelectorAll('.tab-container').forEach(container => {
    const tabs = container.querySelectorAll('.tab-btn');
    const contents = container.querySelectorAll('.tab-content');
    
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        // Aktif sekmeyi değiştir
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // İçeriği göster/gizle
        contents.forEach(content => content.classList.remove('active'));
        contents[index].classList.add('active');
      });
    });
  });
}

// Progress barını güncelle
function updateProgressBars() {
  document.querySelectorAll('.solution-steps .step').forEach(step => {
    const progress = step.getAttribute('data-progress');
    if (progress) {
      const container = step.closest('.tab-content');
      if (container) {
        const progressBar = container.querySelector('.progress-bar .progress-value');
        if (progressBar) {
          progressBar.style.width = progress + '%';
        }
      }
    }
    
    // Adım elementi görünür olduğunda animasyon ekle
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          step.classList.add('animate-in');
          observer.unobserve(step);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(step);
  });
}

// Sayfa yüklendiğinde ilk maddeyi göster ve iyileştirmeleri başlat
document.addEventListener('DOMContentLoaded', function() {
  toggleVisibility('ip-conflict');
  
  // Overlay elementini ekle
  const overlay = document.createElement('div');
  overlay.id = 'zoom-overlay';
  overlay.className = 'overlay';
  document.body.appendChild(overlay);
  
  // Tab sistemini başlat
  initializeTabs();
  
  // Progress barını güncelle
  updateProgressBars();
  
  // Pencere yeniden boyutlandırıldığında responsive davranışları güncelle
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && document.getElementById('sidebar').classList.contains('hidden')) {
      document.getElementById('sidebar').classList.remove('hidden');
    }
  });
  
  // Toggle visibility fonksiyonu çağrıldıktan sonra
  const originalToggleVisibility = window.toggleVisibility;
  window.toggleVisibility = function(id) {
    originalToggleVisibility(id);
    
    // Sekmeleri ve ilerleme çubuğunu başlat
    setTimeout(() => {
      initializeTabs();
      updateProgressBars();
    }, 200);
  };
});