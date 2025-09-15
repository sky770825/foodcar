// 楊梅美食餐車報班系統 JavaScript

// 頁面載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化動畫效果
    initAnimations();
    
    // 初始化模態框
    initModals();
    
    // 初始化快速操作按鈕
    initQuickActions();
    
    // 初始化滾動效果
    initScrollEffects();
});

// 初始化動畫效果
function initAnimations() {
    // 為所有功能卡片添加淡入動畫
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// 初始化模態框
function initModals() {
    // 點擊模態框外部關閉
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // ESC 鍵關閉模態框
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="block"]');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}

// 初始化快速操作按鈕
function initQuickActions() {
    // 為所有快速按鈕添加點擊效果
    const quickBtns = document.querySelectorAll('.quick-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 添加點擊動畫
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// 初始化滾動效果
function initScrollEffects() {
    // 滾動時添加視差效果
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');
        
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// 顯示排程模態框
function showScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // 防止背景滾動
        
        // 添加顯示動畫
        setTimeout(() => {
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);
    }
}

// 顯示繳費模態框
function showPaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);
    }
}

// 顯示聯絡資訊模態框
function showContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);
    }
}

// 顯示群組版規模態框
function showRulesModal() {
    const modal = document.getElementById('rulesModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);
    }
}

// 顯示下載素材模態框
function showDownloadModal() {
    const modal = document.getElementById('downloadModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);
    }
}

// 關閉模態框
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        
        // 添加關閉動畫
        modalContent.style.transform = 'scale(0.8)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // 恢復背景滾動
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }, 300);
    }
}

// 平滑滾動到指定元素
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 複製文字到剪貼板
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('已複製到剪貼板！', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// 備用複製方法
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('已複製到剪貼板！', 'success');
    } catch (err) {
        showNotification('複製失敗，請手動複製', 'error');
    }
    
    document.body.removeChild(textArea);
}

// 顯示通知
function showNotification(message, type = 'info') {
    // 移除現有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 創建新通知
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 添加樣式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // 3秒後自動移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 檢查表單是否已填寫
function checkFormCompletion() {
    // 這裡可以添加表單驗證邏輯
    const requiredFields = document.querySelectorAll('[required]');
    let allFilled = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            allFilled = false;
            field.style.borderColor = '#dc3545';
        } else {
            field.style.borderColor = '#28a745';
        }
    });
    
    return allFilled;
}

// 格式化日期
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    return new Date(date).toLocaleDateString('zh-TW', options);
}

// 獲取當前月份
function getCurrentMonth() {
    const now = new Date();
    return now.getMonth() + 1;
}

// 獲取當前年份
function getCurrentYear() {
    return new Date().getFullYear();
}

// 檢查是否為營業時間
function isBusinessHours() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // 假設營業時間為週一到週五 9:00-18:00
    return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}

// 顯示營業時間提醒
function showBusinessHoursAlert() {
    if (!isBusinessHours()) {
        showNotification('目前非營業時間，我們會在營業時間內盡快回覆您！', 'info');
    }
}

// 添加載入動畫
function showLoading(element) {
    if (element) {
        element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 載入中...';
        element.disabled = true;
    }
}

// 移除載入動畫
function hideLoading(element, originalText) {
    if (element) {
        element.innerHTML = originalText;
        element.disabled = false;
    }
}

// 驗證電子郵件格式
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 驗證手機號碼格式
function validatePhone(phone) {
    const re = /^09\d{8}$/;
    return re.test(phone);
}

// 顯示錯誤訊息
function showError(message) {
    showNotification(message, 'error');
}

// 顯示成功訊息
function showSuccess(message) {
    showNotification(message, 'success');
}

// 顯示資訊訊息
function showInfo(message) {
    showNotification(message, 'info');
}

// 添加 CSS 動畫樣式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style);

// 頁面載入完成後顯示歡迎訊息
window.addEventListener('load', function() {
    setTimeout(() => {
        showInfo('歡迎使用楊梅美食餐車報班系統！');
    }, 1000);
});

// 添加鍵盤快捷鍵支援
document.addEventListener('keydown', function(event) {
    // Ctrl + 1: 查看排程
    if (event.ctrlKey && event.key === '1') {
        event.preventDefault();
        showScheduleModal();
    }
    
    // Ctrl + 2: 查看繳費資訊
    if (event.ctrlKey && event.key === '2') {
        event.preventDefault();
        showPaymentModal();
    }
    
    // Ctrl + 3: 查看聯絡資訊
    if (event.ctrlKey && event.key === '3') {
        event.preventDefault();
        showContactModal();
    }
});

// 添加觸控手勢支援（移動設備）
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchend', function(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }
    
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // 左滑手勢：關閉模態框
    if (Math.abs(diffX) > Math.abs(diffY) && diffX > 50) {
        const openModal = document.querySelector('.modal[style*="block"]');
        if (openModal) {
            closeModal(openModal.id);
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
});

// 下載圖片功能
function downloadImage(imageType) {
    // 實際的圖片URL
    const imageUrls = {
        'qr-poster': 'https://res.cloudinary.com/diiyszovx/image/upload/v1757929018/S__4653076_vzto17.jpg'
    };
    
    const imageUrl = imageUrls[imageType];
    if (imageUrl) {
        // 創建臨時連結下載
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `四維商圈餐車QR_Code海報_${new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showSuccess('海報下載已開始！');
    } else {
        showError('下載連結不存在');
    }
}

// 導出函數供外部使用
window.MeimeiFoodTruck = {
    showScheduleModal,
    showPaymentModal,
    showContactModal,
    showRulesModal,
    showDownloadModal,
    closeModal,
    downloadImage,
    copyToClipboard,
    showNotification,
    showError,
    showSuccess,
    showInfo,
    validateEmail,
    validatePhone,
    formatDate,
    getCurrentMonth,
    getCurrentYear,
    isBusinessHours
};
