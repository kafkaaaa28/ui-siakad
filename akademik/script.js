// ===== TAB NAVIGATION =====
document.querySelectorAll('.academic-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const tabId = tab.getAttribute('data-tab');

    // Remove active class from all tabs
    document.querySelectorAll('.academic-tab').forEach((t) => {
      t.classList.remove('active');
    });

    // Add active class to clicked tab
    tab.classList.add('active');

    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach((content) => {
      content.classList.remove('active');
    });

    // Show selected tab content
    const content = document.getElementById(`${tabId}-content`);
    if (content) {
      content.classList.add('active');
    }
  });
});

// ===== FRS FUNCTIONALITY =====
// Course Selection
document.querySelectorAll('.course-checkbox input').forEach((checkbox) => {
  checkbox.addEventListener('change', function () {
    const courseCard = this.closest('.course-card');
    const courseCode = courseCard.getAttribute('data-course');
    const isWajib = courseCard.querySelector('.status-badge.success')?.textContent === 'Wajib';

    if (isWajib) {
      this.checked = true;
      showNotification('Mata kuliah wajib tidak dapat dibatalkan', 'warning');
      return;
    }

    if (this.checked) {
      courseCard.classList.add('selected');
      showNotification(`Mata kuliah ${courseCode} ditambahkan`, 'success');
    } else {
      courseCard.classList.remove('selected');
      showNotification(`Mata kuliah ${courseCode} dihapus`, 'info');
    }

    updateSKSCounter();
    updateFRSSummary();
  });
});

// Update SKS Counter
function updateSKSCounter() {
  const selectedCourses = document.querySelectorAll('.course-card.selected');
  let totalSKS = 0;

  selectedCourses.forEach((course) => {
    const sksText = course.querySelector('.detail-item:nth-child(1)').textContent;
    const sks = parseInt(sksText.match(/\d+/)[0]);
    totalSKS += sks;
  });

  const counter = document.querySelector('.counter-value');
  if (counter) {
    counter.textContent = totalSKS;

    // Change color based on SKS count
    if (totalSKS < 18) {
      counter.style.color = 'var(--warning)';
    } else if (totalSKS > 24) {
      counter.style.color = 'var(--danger)';
    } else {
      counter.style.color = 'var(--success)';
    }
  }
}

// Update FRS Summary
function updateFRSSummary() {
  const selectedCourses = document.querySelectorAll('.course-card.selected');
  const wajibCourses = document.querySelectorAll('.course-card.selected .status-badge.success');
  const pilihanCourses = selectedCourses.length - wajibCourses.length;

  // Calculate total SKS
  let totalSKS = 0;
  selectedCourses.forEach((course) => {
    const sksText = course.querySelector('.detail-item:nth-child(1)').textContent;
    const sks = parseInt(sksText.match(/\d+/)[0]);
    totalSKS += sks;
  });

  // Update summary values
  const summaryValues = document.querySelectorAll('.summary-value');
  if (summaryValues.length >= 6) {
    summaryValues[0].textContent = selectedCourses.length;
    summaryValues[1].textContent = totalSKS;
    summaryValues[2].textContent = wajibCourses.length;
    summaryValues[3].textContent = pilihanCourses;
  }
}

// Submit FRS
document.getElementById('submit-frs')?.addEventListener('click', function () {
  const selectedCourses = document.querySelectorAll('.course-card.selected');
  const totalSKS = parseInt(document.querySelector('.counter-value').textContent);

  if (selectedCourses.length === 0) {
    showNotification('Pilih minimal 1 mata kuliah', 'error');
    return;
  }

  if (totalSKS < 18) {
    if (!confirm(`Anda hanya memilih ${totalSKS} SKS (minimal 18 SKS). Yakin ingin submit?`)) {
      return;
    }
  }

  if (totalSKS > 24) {
    showNotification('Total SKS melebihi batas maksimal 24 SKS', 'error');
    return;
  }

  const originalText = this.innerHTML;
  const originalClass = this.className;

  this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
  this.disabled = true;

  // Simulate API call
  setTimeout(() => {
    this.innerHTML = '<i class="fas fa-check"></i> Berhasil Submit';
    this.className = 'action-btn success';

    showNotification('FRS berhasil disubmit! Menunggu validasi dosen wali.', 'success');

    // Update validation step
    const currentStep = document.querySelector('.step.current');
    if (currentStep) {
      currentStep.classList.remove('current');
      currentStep.classList.add('completed');

      const nextStep = currentStep.nextElementSibling;
      if (nextStep) {
        nextStep.classList.add('current');
      }
    }

    // Re-enable button after 3 seconds
    setTimeout(() => {
      this.innerHTML = originalText;
      this.disabled = false;
      this.className = originalClass;
    }, 3000);
  }, 2000);
});

// ===== TUGAS AKHIR FUNCTIONALITY =====
// Upload TA Document
document.getElementById('upload-ta')?.addEventListener('click', function () {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.pdf,.doc,.docx,.jpg,.png';
  fileInput.style.display = 'none';

  fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileSize = (file.size / 1024 / 1024).toFixed(2); // MB

      if (fileSize > 10) {
        showNotification('File terlalu besar (maksimal 10MB)', 'error');
        return;
      }

      showNotification(`Mengupload ${fileName}...`, 'info');

      // Simulate upload
      setTimeout(() => {
        showNotification(`${fileName} berhasil diupload!`, 'success');
      }, 1500);
    }
  });

  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
});

// Add Schedule
document.getElementById('add-schedule')?.addEventListener('click', function () {
  showModal(
    'Tambah Jadwal Bimbingan',
    `
        <div class="modal-form">
            <div class="form-group">
                <label>Tanggal Bimbingan</label>
                <input type="date" id="bimbingan-date" class="form-control" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
                <label>Waktu</label>
                <input type="time" id="bimbingan-time" class="form-control" value="10:00">
            </div>
            <div class="form-group">
                <label>Durasi (menit)</label>
                <select id="bimbingan-duration" class="form-control">
                    <option value="30">30 menit</option>
                    <option value="60" selected>60 menit</option>
                    <option value="90">90 menit</option>
                    <option value="120">120 menit</option>
                </select>
            </div>
            <div class="form-group">
                <label>Jenis Pertemuan</label>
                <select id="bimbingan-type" class="form-control">
                    <option value="online">Online (Zoom/Meet)</option>
                    <option value="offline">Offline (Bertemu langsung)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Agenda Bimbingan</label>
                <textarea id="bimbingan-agenda" class="form-control" rows="3" placeholder="Deskripsikan agenda bimbingan..."></textarea>
            </div>
            <div class="button-group">
                <button type="button" class="action-btn" onclick="closeModal()">Batal</button>
                <button type="button" class="action-btn primary" onclick="saveBimbinganSchedule()">Simpan Jadwal</button>
            </div>
        </div>
        `
  );
});

function saveBimbinganSchedule() {
  const date = document.getElementById('bimbingan-date').value;
  const time = document.getElementById('bimbingan-time').value;
  const duration = document.getElementById('bimbingan-duration').value;
  const type = document.getElementById('bimbingan-type').value;
  const agenda = document.getElementById('bimbingan-agenda').value;

  if (!date || !time || !agenda) {
    showNotification('Harap isi semua field yang diperlukan', 'error');
    return;
  }

  showNotification('Menyimpan jadwal bimbingan...', 'info');

  setTimeout(() => {
    closeModal();
    showNotification('Jadwal bimbingan berhasil ditambahkan!', 'success');
  }, 1500);
}

// ===== SKPI FUNCTIONALITY =====
// Preview SKPI
document.getElementById('preview-skpi')?.addEventListener('click', function () {
  showModal(
    'Preview SKPI',
    `
        <div class="skpi-preview">
            <div class="preview-header">
                <h3>SURAT KETERANGAN PENDAMPING IJAZAH</h3>
                <p>UNIVERSITAS CONTOH</p>
                <p class="preview-subtitle">Nomor: SKPI/2025/00123</p>
            </div>
            
            <div class="preview-content">
                <div class="section">
                    <h4>DATA MAHASISWA</h4>
                    <div class="data-grid">
                        <div class="data-item">
                            <span class="label">Nama Lengkap</span>
                            <span class="value">: Andi Suryanto</span>
                        </div>
                        <div class="data-item">
                            <span class="label">NIM</span>
                            <span class="value">: 23012345</span>
                        </div>
                        <div class="data-item">
                            <span class="label">Program Studi</span>
                            <span class="value">: Teknik Informatika (S1)</span>
                        </div>
                        <div class="data-item">
                            <span class="label">Tahun Lulus</span>
                            <span class="value">: 2025</span>
                        </div>
                        <div class="data-item">
                            <span class="label">IPK</span>
                            <span class="value">: 3.68</span>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h4>PENCAPAIAN AKADEMIK</h4>
                    <ul>
                        <li>Juara 2 Lomba Coding Nasional 2024</li>
                        <li>Publikasi Jurnal Internasional "Web Development Trends"</li>
                        <li>Asisten Laboratorium Komputer 2023-2024</li>
                        <li>Peserta Seminar Nasional IT 2024</li>
                    </ul>
                </div>
                
                <div class="section">
                    <h4>PENGALAMAN ORGANISASI</h4>
                    <ul>
                        <li>Ketua Himpunan Mahasiswa Jurusan Teknik Informatika (2023)</li>
                        <li>Koordinator Acara Seminar Nasional IT 2024</li>
                        <li>Anggota UKM Programming 2022-2024</li>
                    </ul>
                </div>
                
                <div class="section">
                    <h4>KOMPETENSI</h4>
                    <div class="competency-grid">
                        <div class="competency-item">
                            <strong>Web Development</strong>
                            <span>Advanced (React.js, Node.js, MongoDB)</span>
                        </div>
                        <div class="competency-item">
                            <strong>UI/UX Design</strong>
                            <span>Intermediate (Figma, Adobe XD)</span>
                        </div>
                        <div class="competency-item">
                            <strong>Database Management</strong>
                            <span>Intermediate (MySQL, PostgreSQL)</span>
                        </div>
                        <div class="competency-item">
                            <strong>Project Management</strong>
                            <span>Basic (Agile, Scrum)</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="preview-footer">
                <div class="signature">
                    <p>Diterbitkan di: Kota Contoh</p>
                    <p>Pada tanggal: 15 Februari 2025</p>
                    <div class="signature-space">
                        <p>Rektor Universitas Contoh</p>
                        <p class="signature-name">Prof. Dr. Ahmad Sanusi, M.Sc.</p>
                        <p>NIP. 196512312345678901</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="action-btn" onclick="closeModal()">
                <i class="fas fa-times"></i> Tutup
            </button>
            <button class="action-btn primary" onclick="downloadSKPI()">
                <i class="fas fa-download"></i> Download PDF
            </button>
            <button class="action-btn success" onclick="printSKPI()">
                <i class="fas fa-print"></i> Cetak
            </button>
        </div>
        `
  );
});

function downloadSKPI() {
  showNotification('Mempersiapkan file SKPI untuk download...', 'info');
  setTimeout(() => {
    showNotification('SKPI berhasil didownload!', 'success');
  }, 1500);
}

function printSKPI() {
  window.print();
  showNotification('Mempersiapkan dokumen untuk dicetak...', 'info');
}

// Upload Certificate
document.getElementById('upload-certificate')?.addEventListener('click', function () {
  showModal(
    'Upload Sertifikat',
    `
        <div class="modal-form">
            <div class="form-group">
                <label>Jenis Sertifikat</label>
                <select id="certificate-type" class="form-control">
                    <option value="">Pilih jenis sertifikat</option>
                    <option value="academic">Akademik</option>
                    <option value="organization">Organisasi</option>
                    <option value="competency">Kompetensi</option>
                    <option value="training">Pelatihan</option>
                    <option value="competition">Lomba/Kompetisi</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Nama Sertifikat</label>
                <input type="text" id="certificate-name" class="form-control" placeholder="Contoh: Sertifikat Juara Lomba Coding">
            </div>
            
            <div class="form-group">
                <label>Penerbit</label>
                <input type="text" id="certificate-issuer" class="form-control" placeholder="Contoh: Kementerian Pendidikan">
            </div>
            
            <div class="form-group">
                <label>Tanggal Diterbitkan</label>
                <input type="date" id="certificate-date" class="form-control">
            </div>
            
            <div class="form-group">
                <label>File Sertifikat</label>
                <div class="file-upload">
                    <input type="file" id="certificate-file" accept=".pdf,.jpg,.jpeg,.png">
                    <label for="certificate-file" class="file-label">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <span>Pilih file (PDF, JPG, PNG - maks. 5MB)</span>
                    </label>
                </div>
                <small class="file-info">Format yang didukung: PDF, JPG, PNG. Maksimal 5MB.</small>
            </div>
            
            <div class="button-group">
                <button type="button" class="action-btn" onclick="closeModal()">Batal</button>
                <button type="button" class="action-btn primary" onclick="uploadCertificate()">Upload</button>
            </div>
        </div>
        `
  );
});

function uploadCertificate() {
  const type = document.getElementById('certificate-type').value;
  const name = document.getElementById('certificate-name').value;
  const issuer = document.getElementById('certificate-issuer').value;
  const date = document.getElementById('certificate-date').value;
  const file = document.getElementById('certificate-file').files[0];

  if (!type || !name || !issuer || !date || !file) {
    showNotification('Harap isi semua field dan pilih file', 'error');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    // 5MB
    showNotification('File terlalu besar (maksimal 5MB)', 'error');
    return;
  }

  showNotification('Mengupload sertifikat...', 'info');

  setTimeout(() => {
    closeModal();
    showNotification('Sertifikat berhasil diupload!', 'success');

    // Update progress in UI
    const currentStep = document.querySelector('.track-step.current .step-content p');
    if (currentStep) {
      const currentText = currentStep.textContent;
      const match = currentText.match(/(\d+)\/(\d+)/);
      if (match) {
        const current = parseInt(match[1]);
        const total = parseInt(match[2]);
        if (current < total) {
          currentStep.textContent = `${current + 1}/${total} sertifikat terupload`;
        }
      }
    }
  }, 2000);
}

// ===== TK3 FUNCTIONALITY =====
// Continue Survey
document.getElementById('continue-survey')?.addEventListener('click', function () {
  const progressItems = document.querySelectorAll('.survey-section');
  let incompleteSection = null;

  progressItems.forEach((section) => {
    if (section.classList.contains('in-progress') || (section.classList.contains('pending') && !incompleteSection)) {
      incompleteSection = section;
    }
  });

  if (incompleteSection) {
    const sectionTitle = incompleteSection.querySelector('h4').textContent;
    showModal(
      `Lanjutkan Survey - ${sectionTitle}`,
      `
            <div class="survey-modal">
                <div class="survey-progress">
                    <div class="progress-step active">
                        <div class="step-number">1</div>
                        <div class="step-label">Data Diri</div>
                    </div>
                    <div class="progress-step active">
                        <div class="step-number">2</div>
                        <div class="step-label">Pendidikan</div>
                    </div>
                    <div class="progress-step active current">
                        <div class="step-number">3</div>
                        <div class="step-label">Pekerjaan</div>
                    </div>
                    <div class="progress-step">
                        <div class="step-number">4</div>
                        <div class="step-label">Kompetensi</div>
                    </div>
                    <div class="progress-step">
                        <div class="step-number">5</div>
                        <div class="step-label">Saran</div>
                    </div>
                </div>
                
                <div class="survey-form">
                    <h4>Bagian C: Informasi Pekerjaan</h4>
                    
                    <div class="form-group">
                        <label>Status Pekerjaan Saat Ini</label>
                        <select class="form-control">
                            <option value="">Pilih status pekerjaan</option>
                            <option value="working" selected>Sudah Bekerja</option>
                            <option value="studying">Melanjutkan Studi</option>
                            <option value="entrepreneur">Wirausaha</option>
                            <option value="searching">Sedang Mencari Pekerjaan</option>
                            <option value="other">Lainnya</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Nama Perusahaan/Institusi</label>
                        <input type="text" class="form-control" value="PT. Teknologi Digital Indonesia">
                    </div>
                    
                    <div class="form-group">
                        <label>Posisi/Jabatan</label>
                        <input type="text" class="form-control" value="Frontend Developer">
                    </div>
                    
                    <div class="form-group">
                        <label>Bidang Usaha</label>
                        <input type="text" class="form-control" value="Teknologi Informasi">
                    </div>
                    
                    <div class="form-group">
                        <label>Bulan/Tahun Mulai Bekerja</label>
                        <input type="text" class="form-control" value="Januari 2025">
                    </div>
                    
                    <div class="form-group">
                        <label>Rentang Gaji Pertama</label>
                        <select class="form-control">
                            <option value="">Pilih rentang gaji</option>
                            <option value="1-3">Rp 1 - 3 juta</option>
                            <option value="3-5">Rp 3 - 5 juta</option>
                            <option value="5-8">Rp 5 - 8 juta</option>
                            <option value="8-10" selected>Rp 8 - 10 juta</option>
                            <option value="10-15">Rp 10 - 15 juta</option>
                            <option value="15+">> Rp 15 juta</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Kesesuaian pekerjaan dengan bidang studi</label>
                        <div class="radio-group">
                            <label>
                                <input type="radio" name="relevance" value="very-relevant" checked>
                                <span>Sangat Sesuai</span>
                            </label>
                            <label>
                                <input type="radio" name="relevance" value="relevant">
                                <span>Sesuai</span>
                            </label>
                            <label>
                                <input type="radio" name="relevance" value="less-relevant">
                                <span>Kurang Sesuai</span>
                            </label>
                            <label>
                                <input type="radio" name="relevance" value="not-relevant">
                                <span>Tidak Sesuai</span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="survey-navigation">
                    <button type="button" class="action-btn" onclick="closeModal()">
                        <i class="fas fa-save"></i> Simpan & Keluar
                    </button>
                    <button type="button" class="action-btn primary" onclick="submitSurveySection()">
                        <i class="fas fa-arrow-right"></i> Lanjut ke Bagian D
                    </button>
                </div>
            </div>
            `
    );
  } else {
    showModal(
      'Survey Lengkap',
      `
            <div class="survey-complete">
                <div class="complete-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Survey Telah Selesai!</h3>
                <p>Terima kasih telah meluangkan waktu untuk mengisi survey tracer study. Data yang Anda berikan sangat berharga untuk pengembangan kampus.</p>
                <p class="complete-message">Anda dapat mendownload sertifikat partisipasi survey.</p>
                <div class="complete-actions">
                    <button class="action-btn" onclick="closeModal()">
                        <i class="fas fa-times"></i> Tutup
                    </button>
                    <button class="action-btn primary" onclick="downloadSurveyCertificate()">
                        <i class="fas fa-download"></i> Download Sertifikat
                    </button>
                </div>
            </div>
            `
    );
  }
});

function submitSurveySection() {
  showNotification('Menyimpan data survey...', 'info');

  setTimeout(() => {
    closeModal();
    showNotification('Data survey bagian pekerjaan berhasil disimpan!', 'success');

    // Update UI progress
    const inProgressSection = document.querySelector('.survey-section.in-progress');
    if (inProgressSection) {
      inProgressSection.classList.remove('in-progress');
      inProgressSection.classList.add('completed');

      const statusBadge = inProgressSection.querySelector('.status-badge');
      if (statusBadge) {
        statusBadge.textContent = '100%';
        statusBadge.className = 'status-badge success';
      }

      const button = inProgressSection.querySelector('.section-status .action-btn');
      if (button) {
        button.innerHTML = '<i class="fas fa-edit"></i>';
        button.classList.remove('primary');
      }

      // Activate next section
      const nextSection = inProgressSection.nextElementSibling;
      if (nextSection && nextSection.classList.contains('survey-section')) {
        nextSection.classList.remove('pending');
        nextSection.classList.add('in-progress');

        const nextButton = nextSection.querySelector('.section-status');
        if (nextButton) {
          nextButton.innerHTML = `
                        <span class="status-badge warning">50%</span>
                        <button class="action-btn small primary">
                            <i class="fas fa-play"></i> Lanjutkan
                        </button>
                    `;
        }
      }
    }
  }, 1500);
}

function downloadSurveyCertificate() {
  showNotification('Mempersiapkan sertifikat survey...', 'info');
  setTimeout(() => {
    showNotification('Sertifikat survey berhasil didownload!', 'success');
  }, 1500);
}

// Edit Employment
document.getElementById('edit-employment')?.addEventListener('click', function () {
  showModal(
    'Edit Informasi Pekerjaan',
    `
        <div class="modal-form">
            <div class="form-group">
                <label>Status Pekerjaan</label>
                <select id="edit-status" class="form-control">
                    <option value="working" selected>Sudah Bekerja</option>
                    <option value="studying">Melanjutkan Studi</option>
                    <option value="entrepreneur">Wirausaha</option>
                    <option value="searching">Sedang Mencari Pekerjaan</option>
                    <option value="other">Lainnya</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Nama Perusahaan</label>
                <input type="text" id="edit-company" class="form-control" value="PT. Teknologi Digital Indonesia">
            </div>
            
            <div class="form-group">
                <label>Posisi/Jabatan</label>
                <input type="text" id="edit-position" class="form-control" value="Frontend Developer">
            </div>
            
            <div class="form-group">
                <label>Bidang Usaha</label>
                <input type="text" id="edit-industry" class="form-control" value="Teknologi Informasi">
            </div>
            
            <div class="form-group">
                <label>Bulan/Tahun Mulai Bekerja</label>
                <input type="text" id="edit-start-date" class="form-control" value="Januari 2025">
            </div>
            
            <div class="form-group">
                <label>Gaji Pertama</label>
                <select id="edit-salary" class="form-control">
                    <option value="1-3">Rp 1 - 3 juta</option>
                    <option value="3-5">Rp 3 - 5 juta</option>
                    <option value="5-8">Rp 5 - 8 juta</option>
                    <option value="8-10" selected>Rp 8 - 10 juta</option>
                    <option value="10-15">Rp 10 - 15 juta</option>
                    <option value="15+">> Rp 15 juta</option>
                </select>
            </div>
            
            <div class="button-group">
                <button type="button" class="action-btn" onclick="closeModal()">Batal</button>
                <button type="button" class="action-btn primary" onclick="updateEmploymentInfo()">Simpan Perubahan</button>
            </div>
        </div>
        `
  );
});

function updateEmploymentInfo() {
  const status = document.getElementById('edit-status').value;
  const company = document.getElementById('edit-company').value;
  const position = document.getElementById('edit-position').value;
  const industry = document.getElementById('edit-industry').value;
  const startDate = document.getElementById('edit-start-date').value;
  const salary = document.getElementById('edit-salary').value;

  if (!company || !position || !industry || !startDate) {
    showNotification('Harap isi semua field yang diperlukan', 'error');
    return;
  }

  showNotification('Memperbarui informasi pekerjaan...', 'info');

  setTimeout(() => {
    closeModal();
    showNotification('Informasi pekerjaan berhasil diperbarui!', 'success');
  }, 1500);
}

// ===== BIMBINGAN AKADEMIK FUNCTIONALITY =====
// Request Meeting
document.getElementById('request-meeting')?.addEventListener('click', function () {
  showModal(
    'Minta Jadwal Bimbingan',
    `
        <div class="modal-form">
            <div class="form-group">
                <label>Jenis Bimbingan</label>
                <select id="meeting-type" class="form-control">
                    <option value="academic">Bimbingan Akademik</option>
                    <option value="thesis" selected>Bimbingan Tugas Akhir</option>
                    <option value="consultation">Konsultasi</option>
                    <option value="other">Lainnya</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Prioritas</label>
                <select id="meeting-priority" class="form-control">
                    <option value="normal">Normal</option>
                    <option value="urgent" selected>Penting/Mendesak</option>
                    <option value="routine">Rutin</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Tanggal yang Diminta</label>
                <input type="date" id="meeting-date" class="form-control" value="${new Date().toISOString().split('T')[0]}">
            </div>
            
            <div class="form-group">
                <label>Waktu yang Diminta</label>
                <div class="time-group">
                    <input type="time" id="meeting-time" class="form-control" value="10:00">
                    <span>s/d</span>
                    <input type="time" id="meeting-end-time" class="form-control" value="11:00">
                </div>
            </div>
            
            <div class="form-group">
                <label>Mode Pertemuan</label>
                <div class="radio-group">
                    <label>
                        <input type="radio" name="meeting-mode" value="online" checked>
                        <span><i class="fas fa-video"></i> Online</span>
                    </label>
                    <label>
                        <input type="radio" name="meeting-mode" value="offline">
                        <span><i class="fas fa-user"></i> Offline (Bertemu langsung)</span>
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label>Agenda/Topik Pembahasan</label>
                <textarea id="meeting-agenda" class="form-control" rows="4" placeholder="Deskripsikan agenda yang ingin dibahas..."></textarea>
            </div>
            
            <div class="form-group">
                <label>Dokumen Pendukung (opsional)</label>
                <div class="file-upload">
                    <input type="file" id="meeting-document" accept=".pdf,.doc,.docx,.jpg,.png">
                    <label for="meeting-document" class="file-label">
                        <i class="fas fa-paperclip"></i>
                        <span>Lampirkan dokumen</span>
                    </label>
                </div>
            </div>
            
            <div class="button-group">
                <button type="button" class="action-btn" onclick="closeModal()">Batal</button>
                <button type="button" class="action-btn primary" onclick="submitMeetingRequest()">
                    <i class="fas fa-paper-plane"></i> Kirim Permintaan
                </button>
            </div>
        </div>
        `
  );
});

function submitMeetingRequest() {
  const type = document.getElementById('meeting-type').value;
  const priority = document.getElementById('meeting-priority').value;
  const date = document.getElementById('meeting-date').value;
  const time = document.getElementById('meeting-time').value;
  const endTime = document.getElementById('meeting-end-time').value;
  const agenda = document.getElementById('meeting-agenda').value;
  const mode = document.querySelector('input[name="meeting-mode"]:checked').value;

  if (!date || !time || !endTime || !agenda) {
    showNotification('Harap isi semua field yang diperlukan', 'error');
    return;
  }

  showNotification('Mengirim permintaan jadwal bimbingan...', 'info');

  setTimeout(() => {
    closeModal();
    showNotification('Permintaan jadwal berhasil dikirim! Dosen akan mengkonfirmasi.', 'success');
  }, 2000);
}

// View All Meetings
document.getElementById('view-all-meetings')?.addEventListener('click', function () {
  showModal(
    'Semua Jadwal Bimbingan',
    `
        <div class="meetings-modal">
            <div class="meetings-filter">
                <select class="form-control">
                    <option>Semua Status</option>
                    <option>Mendatang</option>
                    <option>Selesai</option>
                    <option>Dibatalkan</option>
                </select>
                <select class="form-control">
                    <option>Semua Jenis</option>
                    <option>Bimbingan Tugas Akhir</option>
                    <option>Konsultasi Akademik</option>
                    <option>Lainnya</option>
                </select>
                <button class="action-btn small">
                    <i class="fas fa-filter"></i> Filter
                </button>
            </div>
            
            <div class="meetings-list-modal">
                <div class="meeting-item">
                    <div class="meeting-date">
                        <div class="date">22 JAN</div>
                        <div class="time">10:00</div>
                    </div>
                    <div class="meeting-details">
                        <h4>Bimbingan Tugas Akhir</h4>
                        <p>Review Bab III & IV</p>
                        <div class="meeting-info">
                            <span class="badge upcoming">Mendatang</span>
                            <span><i class="fas fa-video"></i> Online</span>
                            <span><i class="fas fa-user"></i> Prof. Sari Dewi</span>
                        </div>
                    </div>
                    <div class="meeting-actions">
                        <button class="action-btn small primary">
                            <i class="fas fa-video"></i> Join
                        </button>
                    </div>
                </div>
                
                <div class="meeting-item">
                    <div class="meeting-date">
                        <div class="date">15 JAN</div>
                        <div class="time">14:00</div>
                    </div>
                    <div class="meeting-details">
                        <h4>Bimbingan Tugas Akhir</h4>
                        <p>Review progress implementasi sistem</p>
                        <div class="meeting-info">
                            <span class="badge completed">Selesai</span>
                            <span><i class="fas fa-user"></i> Offline</span>
                            <span><i class="fas fa-user"></i> Prof. Sari Dewi</span>
                        </div>
                    </div>
                    <div class="meeting-actions">
                        <button class="action-btn small">
                            <i class="fas fa-file-alt"></i> Catatan
                        </button>
                    </div>
                </div>
                
                <div class="meeting-item">
                    <div class="meeting-date">
                        <div class="date">8 JAN</div>
                        <div class="time">10:00</div>
                    </div>
                    <div class="meeting-details">
                        <h4>Konsultasi Akademik</h4>
                        <p>Diskusi rencana studi semester depan</p>
                        <div class="meeting-info">
                            <span class="badge completed">Selesai</span>
                            <span><i class="fas fa-video"></i> Online</span>
                            <span><i class="fas fa-user"></i> Prof. Sari Dewi</span>
                        </div>
                    </div>
                    <div class="meeting-actions">
                        <button class="action-btn small">
                            <i class="fas fa-file-alt"></i> Catatan
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="action-btn" onclick="closeModal()">
                    <i class="fas fa-times"></i> Tutup
                </button>
            </div>
        </div>
        `
  );
});

// ===== UTILITY FUNCTIONS =====
// Notification System
function showNotification(message, type = 'info') {
  // Remove existing notifications
  document.querySelectorAll('.notification').forEach((notif) => notif.remove());

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' || type === 'danger' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

// Modal System
function showModal(title, content) {
  // Remove existing modal
  const existingModal = document.querySelector('.modal-overlay');
  if (existingModal) {
    existingModal.remove();
  }

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;

  document.body.appendChild(modalOverlay);

  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';

  // Close modal on backdrop click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close modal on escape key
  const closeOnEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', closeOnEscape);
    }
  };
  document.addEventListener('keydown', closeOnEscape);
}

function closeModal() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
      if (modal.parentElement) {
        modal.remove();
      }
      document.body.style.overflow = '';
    }, 300);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
  // Initialize SKS counter
  updateSKSCounter();
  updateFRSSummary();

  // Set initial active tab
  const firstTab = document.querySelector('.academic-tab.active');
  if (firstTab) {
    const tabId = firstTab.getAttribute('data-tab');
    const content = document.getElementById(`${tabId}-content`);
    if (content) {
      content.classList.add('active');
    }
  }

  // Add loading animation to progress circles
  const progressCircles = document.querySelectorAll('.progress-circle');
  progressCircles.forEach((circle) => {
    const progress = circle.getAttribute('data-progress');
    const fill = circle.querySelector('.progress-fill');
    if (fill && progress) {
      const circumference = 2 * Math.PI * 28;
      const offset = circumference - (progress / 100) * circumference;
      fill.style.strokeDasharray = circumference;
      fill.style.strokeDashoffset = offset;
    }
  });

  // Show welcome notification
  setTimeout(() => {
    showNotification('Selamat datang di Portal Akademik & Perkuliahan!', 'info');
  }, 1000);
});

// Export functions for global use
window.showNotification = showNotification;
window.showModal = showModal;
window.closeModal = closeModal;
window.updateSKSCounter = updateSKSCounter;
window.updateFRSSummary = updateFRSSummary;
