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
      element.style.display = (sectionId === id) ? 'block' : 'none';
      if (sectionId === id && element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}

// Sayfa yüklendiğinde ilk maddeyi göster
document.addEventListener('DOMContentLoaded', function() {
  toggleVisibility('ip-conflict');
});