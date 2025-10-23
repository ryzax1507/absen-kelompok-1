
// Data siswa
const students = [
    "Agustina Novita", "Alun Pratama Putra", "Alwi Fahri", "April Yanti", "Dwi Aliyah Anggraeny", "Dirga Raditya Rusli", "Fahrisal Basri",
    "Fajar Ramadan", "Muh. Taufiqurahman", "Haidir Ilham", "Muhammad Resky",
    "Imam Malik", "Kasmiah", "Nur Ardiansyah", "Nur Jihan Fauzi Alfadila",
    "Muhammad Hilmi Royhan", "Muhammad Rheyhan Ahmad", "Marsyah Hikmayani Nur", "Muhammad Abdillah",
    "Nur Awaliyah Zahra", "Nur Insyani", "Nurannisa Amanda", "Nurul Fitri Ramadani",
    "Nurul Khaerana", "Nur Afifah", "Nursal Sabila Febrianti", "Putri Reski Kirana",
    "Rasya Aditiya", "Rahmat Hidayat", "Riska Tahir", "Saripuddin",
    "Suci Ramadhani", "Zaskia Apriliana Noer"
];

// Status kehadiran untuk setiap siswa
let attendanceData = {};
let allAttendanceRecords = [];
let mergedAttendanceRecords = [];
let currentPage = 1;
const recordsPerPage = 5;

// Inisialisasi data kehadiran
students.forEach(student => {
    attendanceData[student] = 'alpha';
});

// Load existing data from localStorage
function loadExistingData() {
    const stored = localStorage.getItem('attendanceRecords');
    if (stored) {
        allAttendanceRecords = JSON.parse(stored);
    }
    
    const mergedStored = localStorage.getItem('mergedAttendanceRecords');
    if (mergedStored) {
        mergedAttendanceRecords = JSON.parse(mergedStored);
    }
    
    console.log(`Loaded ${allAttendanceRecords.length} attendance records and ${mergedAttendanceRecords.length} merged records from localStorage`);
}

// Save data to localStorage
function saveToStorage() {
    localStorage.setItem('attendanceRecords', JSON.stringify(allAttendanceRecords));
    localStorage.setItem('mergedAttendanceRecords', JSON.stringify(mergedAttendanceRecords));
    console.log('Data saved to localStorage');
}

// Update tanggal dan waktu
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Makassar'
    };
    document.getElementById('currentDateTime').textContent = now.toLocaleDateString('id-ID', options);
}

// Generate student cards
function generateStudentCards() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    students.forEach((student, index) => {
        const card = document.createElement('div');
        card.className = 'attendance-card bg-gray-50 rounded-xl p-4 border border-gray-200';
        
        card.innerHTML = `
            <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                    ${index + 1}
                </div>
                <div class="flex-1">
                    <div class="font-semibold text-gray-800">${student}</div>
                    <div class="text-sm text-gray-500">Siswa Kelas</div>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <button class="status-btn px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-green-100 text-green-700 hover:bg-green-200" 
                        onclick="setAttendance('${student}', 'hadir')" data-status="hadir">
                    ✅ Hadir
                </button>
                <button class="status-btn px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-red-100 text-red-700 hover:bg-red-200" 
                        onclick="setAttendance('${student}', 'sakit')" data-status="sakit">
                    🤒 Sakit
                </button>
                <button class="status-btn px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-yellow-100 text-yellow-700 hover:bg-yellow-200" 
                        onclick="setAttendance('${student}', 'izin')" data-status="izin">
                    📝 Izin
                </button>
                <button class="status-btn px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200" 
                        onclick="setAttendance('${student}', 'alpha')" data-status="alpha">
                    ❌ Alpha
                </button>
            </div>
        `;
        
        studentList.appendChild(card);
    });
    
    updateStatistics();
}

// Set attendance status
function setAttendance(student, status) {
    attendanceData[student] = status;
    
    const card = event.target.closest('.attendance-card');
    const buttons = card.querySelectorAll('.status-btn');
    
    buttons.forEach(btn => {
        btn.classList.remove('ring-2', 'ring-offset-2');
        if (btn.dataset.status === 'hadir') {
            btn.classList.remove('bg-green-500', 'text-white');
            btn.classList.add('bg-green-100', 'text-green-700');
        } else if (btn.dataset.status === 'sakit') {
            btn.classList.remove('bg-red-500', 'text-white');
            btn.classList.add('bg-red-100', 'text-red-700');
        } else if (btn.dataset.status === 'izin') {
            btn.classList.remove('bg-yellow-500', 'text-white');
            btn.classList.add('bg-yellow-100', 'text-yellow-700');
        } else if (btn.dataset.status === 'alpha') {
            btn.classList.remove('bg-gray-500', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-700');
        }
    });
    
    const selectedBtn = card.querySelector(`[data-status="${status}"]`);
    selectedBtn.classList.add('ring-2', 'ring-offset-2');
    
    if (status === 'hadir') {
        selectedBtn.classList.remove('bg-green-100', 'text-green-700');
        selectedBtn.classList.add('bg-green-500', 'text-white', 'ring-green-300');
    } else if (status === 'sakit') {
        selectedBtn.classList.remove('bg-red-100', 'text-red-700');
        selectedBtn.classList.add('bg-red-500', 'text-white', 'ring-red-300');
    } else if (status === 'izin') {
        selectedBtn.classList.remove('bg-yellow-100', 'text-yellow-700');
        selectedBtn.classList.add('bg-yellow-500', 'text-white', 'ring-yellow-300');
    } else if (status === 'alpha') {
        selectedBtn.classList.remove('bg-gray-100', 'text-gray-700');
        selectedBtn.classList.add('bg-gray-500', 'text-white', 'ring-gray-300');
    }
    
    updateStatistics();
}

// Update statistics
function updateStatistics() {
    const stats = {
        hadir: 0,
        sakit: 0,
        izin: 0,
        alpha: 0
    };
    
    Object.values(attendanceData).forEach(status => {
        stats[status]++;
    });
    
    document.getElementById('presentCount').textContent = stats.hadir;
    document.getElementById('sickCount').textContent = stats.sakit;
    document.getElementById('permitCount').textContent = stats.izin;
    document.getElementById('absentCount').textContent = stats.alpha;
}

// Function to mark all students with specific status
function markAllStudents(status) {
    students.forEach(student => {
        attendanceData[student] = status;
    });
    
    const cards = document.querySelectorAll('.attendance-card');
    cards.forEach(card => {
        const buttons = card.querySelectorAll('.status-btn');
        buttons.forEach(btn => {
            btn.classList.remove('ring-2', 'ring-offset-2', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-gray-500', 'text-white');
            
            if (btn.dataset.status === status) {
                if (status === 'hadir') {
                    btn.classList.add('bg-green-500', 'text-white', 'ring-2', 'ring-offset-2', 'ring-green-300');
                } else if (status === 'sakit') {
                    btn.classList.add('bg-red-500', 'text-white', 'ring-2', 'ring-offset-2', 'ring-red-300');
                } else if (status === 'izin') {
                    btn.classList.add('bg-yellow-500', 'text-white', 'ring-2', 'ring-offset-2', 'ring-yellow-300');
                } else if (status === 'alpha') {
                    btn.classList.add('bg-gray-500', 'text-white', 'ring-2', 'ring-offset-2', 'ring-gray-300');
                }
            } else {
                if (btn.dataset.status === 'hadir') {
                    btn.classList.add('bg-green-100', 'text-green-700');
                } else if (btn.dataset.status === 'sakit') {
                    btn.classList.add('bg-red-100', 'text-red-700');
                } else if (btn.dataset.status === 'izin') {
                    btn.classList.add('bg-yellow-100', 'text-yellow-700');
                } else if (btn.dataset.status === 'alpha') {
                    btn.classList.add('bg-gray-100', 'text-gray-700');
                }
            }
        });
    });
    
    updateStatistics();
}

// Save attendance to browser
function saveAttendanceToBrowser() {
    try {
        const now = new Date();
        const dateTime = now.toLocaleDateString('id-ID') + ' ' + now.toLocaleTimeString('id-ID');
        
        // Create record
        const record = {
            'Tanggal dan Waktu': dateTime,
            ...attendanceData
        };
        
        // Validate record
        if (!record['Tanggal dan Waktu']) {
            throw new Error('Tanggal dan waktu tidak valid');
        }
        
        // Check if attendanceData has valid data
        const hasValidData = students.some(student => attendanceData[student]);
        if (!hasValidData) {
            throw new Error('Data kehadiran tidak valid');
        }
        
        // Save to localStorage with error handling
        allAttendanceRecords.push(record);
        
        try {
            localStorage.setItem('attendanceRecords', JSON.stringify(allAttendanceRecords));
            localStorage.setItem('mergedAttendanceRecords', JSON.stringify(mergedAttendanceRecords));
        } catch (storageError) {
            // Remove the record if storage fails
            allAttendanceRecords.pop();
            throw new Error('Gagal menyimpan ke localStorage. Mungkin storage penuh.');
        }
        
        displayDataList();
        updateSourceDataSelect();
        
        return true;
    } catch (error) {
        console.error('Error in saveAttendanceToBrowser:', error);
        throw error;
    }
}

// Export to Excel
function exportToExcel() {
    try {
        const now = new Date();
        const dateTime = now.toLocaleDateString('id-ID') + ' ' + now.toLocaleTimeString('id-ID');
        
        // Create record
        const record = {
            'Tanggal dan Waktu': dateTime,
            ...attendanceData
        };
        
        // Validate record
        if (!record['Tanggal dan Waktu']) {
            throw new Error('Tanggal dan waktu tidak valid');
        }
        
        // Check if attendanceData has valid data
        const hasValidData = students.some(student => attendanceData[student]);
        if (!hasValidData) {
            throw new Error('Data kehadiran tidak valid');
        }
        
        // Save to localStorage with error handling
        allAttendanceRecords.push(record);
        
        try {
            localStorage.setItem('attendanceRecords', JSON.stringify(allAttendanceRecords));
            localStorage.setItem('mergedAttendanceRecords', JSON.stringify(mergedAttendanceRecords));
        } catch (storageError) {
            // Remove the record if storage fails
            allAttendanceRecords.pop();
            throw new Error('Gagal menyimpan ke localStorage. Mungkin storage penuh.');
        }
        
        displayDataList();
        updateSourceDataSelect();
        
        // Create workbook with error handling
        if (!window.XLSX) {
            throw new Error('Library Excel tidak tersedia');
        }
        
        // Create simple format: Data 1, Data 2, etc with Tanggal/Nama/Keterangan
        const simpleData = [];
        
        allAttendanceRecords.forEach((record, dataIndex) => {
            const recordDate = record['Tanggal dan Waktu'];
            
            // Add header for each data set
            simpleData.push({
                'Tanggal': `=== DATA ${dataIndex + 1} ===`,
                'Nama': '',
                'Keterangan': ''
            });
            
            // Add each student's attendance for this data set
            students.forEach(student => {
                simpleData.push({
                    'Tanggal': recordDate,
                    'Nama': student,
                    'Keterangan': record[student] || 'alpha'
                });
            });
            
            // Add empty row between data sets
            if (dataIndex < allAttendanceRecords.length - 1) {
                simpleData.push({
                    'Tanggal': '',
                    'Nama': '',
                    'Keterangan': ''
                });
            }
        });
        
        const ws = XLSX.utils.json_to_sheet(simpleData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Absensi");
        
        // Download with error handling
        const filename = `Absensi_Terhubung_${now.toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, filename);
        
        return true;
    } catch (error) {
        console.error('Error in exportToExcel:', error);
        throw error;
    }
}

// Download all data
function downloadAllData() {
    if (allAttendanceRecords.length === 0) {
        alert('Tidak ada data absensi yang tersimpan');
        return;
    }
    
    // Create simple format: Data 1, Data 2, etc with Tanggal/Nama/Keterangan
    const simpleData = [];
    
    allAttendanceRecords.forEach((record, dataIndex) => {
        const recordDate = record['Tanggal dan Waktu'];
        
        // Add header for each data set
        simpleData.push({
            'Tanggal': `=== DATA ${dataIndex + 1} ===`,
            'Nama': '',
            'Keterangan': ''
        });
        
        // Add each student's attendance for this data set
        students.forEach(student => {
            simpleData.push({
                'Tanggal': recordDate,
                'Nama': student,
                'Keterangan': record[student] || 'alpha'
            });
        });
        
        // Add empty row between data sets
        if (dataIndex < allAttendanceRecords.length - 1) {
            simpleData.push({
                'Tanggal': '',
                'Nama': '',
                'Keterangan': ''
            });
        }
    });
    
    const ws = XLSX.utils.json_to_sheet(simpleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Semua Absensi");
    
    const filename = `Semua_Absensi_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
}

// Simple merge strategy - current data takes priority
function applyMergeStrategy(currentStatus, sourceStatus) {
    return currentStatus !== 'alpha' ? currentStatus : sourceStatus;
}

// Event Listeners
document.getElementById('markAllPresent').addEventListener('click', function() {
    markAllStudents('hadir');
    
    this.classList.add('pulse-animation');
    setTimeout(() => {
        this.classList.remove('pulse-animation');
    }, 2000);
});

document.getElementById('markAllSick').addEventListener('click', function() {
    markAllStudents('sakit');
    
    this.classList.add('pulse-animation');
    setTimeout(() => {
        this.classList.remove('pulse-animation');
    }, 2000);
});

document.getElementById('markAllPermit').addEventListener('click', function() {
    markAllStudents('izin');
    
    this.classList.add('pulse-animation');
    setTimeout(() => {
        this.classList.remove('pulse-animation');
    }, 2000);
});

document.getElementById('markAllAbsent').addEventListener('click', function() {
    markAllStudents('alpha');
    
    this.classList.add('pulse-animation');
    setTimeout(() => {
        this.classList.remove('pulse-animation');
    }, 2000);
});

// Save attendance to browser
document.getElementById('saveAttendance').addEventListener('click', function() {
    this.innerHTML = '⏳ Menyimpan...';
    this.disabled = true;
    
    try {
        saveAttendanceToBrowser();
        
        // Show success message
        const successMsg = document.getElementById('successMessage');
        const successContent = successMsg.querySelector('div:last-child');
        successContent.innerHTML = `
            <div class="font-bold">Berhasil!</div>
            <div class="text-sm">Data absensi tersimpan di browser</div>
        `;
        successMsg.classList.remove('hidden');
        
        setTimeout(() => {
            successMsg.classList.add('hidden');
        }, 3000);
    } catch (error) {
        console.error('Error:', error);
        let errorMessage = 'Terjadi kesalahan saat menyimpan data.';
        
        if (error.message.includes('localStorage')) {
            errorMessage = 'Storage browser penuh. Silakan hapus beberapa data lama.';
        } else if (error.message.includes('tidak valid')) {
            errorMessage = error.message;
        } else {
            errorMessage = 'Terjadi kesalahan tidak terduga. Silakan refresh halaman dan coba lagi.';
        }
        
        alert(errorMessage);
    } finally {
        this.innerHTML = '💾 Simpan ke Browser';
        this.disabled = false;
    }
});

// Submit attendance
document.getElementById('submitAttendance').addEventListener('click', function() {
    this.innerHTML = '⏳ Membuat Excel...';
    this.disabled = true;
    
    try {
        exportToExcel();
        
        const successMsg = document.getElementById('successMessage');
        const successContent = successMsg.querySelector('div:last-child');
        successContent.innerHTML = `
            <div class="font-bold">Berhasil!</div>
            <div class="text-sm">File Excel telah didownload</div>
        `;
        successMsg.classList.remove('hidden');
        
        setTimeout(() => {
            successMsg.classList.add('hidden');
        }, 5000);
    } catch (error) {
        console.error('Error:', error);
        let errorMessage = 'Terjadi kesalahan saat membuat Excel.';
        
        if (error.message.includes('Library Excel')) {
            errorMessage = 'Library Excel tidak dapat dimuat. Silakan refresh halaman.';
        } else if (error.message.includes('localStorage')) {
            errorMessage = 'Storage browser penuh. Silakan hapus beberapa data lama.';
        } else if (error.message.includes('tidak valid')) {
            errorMessage = error.message;
        } else {
            errorMessage = 'Terjadi kesalahan saat membuat file Excel. Silakan coba lagi.';
        }
        
        alert(errorMessage);
    } finally {
        this.innerHTML = '📤 Download Excel Absensi';
        this.disabled = false;
    }
});