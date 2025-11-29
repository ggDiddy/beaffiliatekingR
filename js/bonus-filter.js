
/* ========================================
   Be Affiliate King - Bonus Filter & Sort
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== Bonus Category Filter =====
    const categoryButtons = document.querySelectorAll('.category-btn');
    const bonusTableRows = document.querySelectorAll('.bonus-table tbody tr');
    
    if (categoryButtons.length > 0 && bonusTableRows.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Update active button
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter table rows
                bonusTableRows.forEach(row => {
                    if (category === 'all') {
                        row.style.display = '';
                    } else {
                        const rowCategories = row.getAttribute('data-category');
                        if (rowCategories && rowCategories.includes(category)) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    }
                });
            });
        });
    }
    
    // ===== Casino Comparison Filter =====
    const filterInputs = document.querySelectorAll('[data-filter-type]');
    const casinoCards = document.querySelectorAll('[data-casino-info]');
    
    if (filterInputs.length > 0 && casinoCards.length > 0) {
        filterInputs.forEach(input => {
            input.addEventListener('change', applyFilters);
        });
    }
    
    function applyFilters() {
        const filters = {
            minBonus: document.querySelector('[data-filter-type="min-bonus"]')?.value || 0,
            maxWagering: document.querySelector('[data-filter-type="max-wagering"]')?.value || 999,
            paymentMethod: document.querySelector('[data-filter-type="payment-method"]')?.value || 'all',
            minRating: document.querySelector('[data-filter-type="min-rating"]')?.value || 0
        };
        
        casinoCards.forEach(card => {
            const casinoData = JSON.parse(card.getAttribute('data-casino-info'));
            
            let shouldShow = true;
            
            // Check bonus amount
            if (casinoData.bonusAmount < parseInt(filters.minBonus)) {
                shouldShow = false;
            }
            
            // Check wagering requirement
            if (casinoData.wagering > parseInt(filters.maxWagering)) {
                shouldShow = false;
            }
            
            // Check payment method
            if (filters.paymentMethod !== 'all' && !casinoData.paymentMethods.includes(filters.paymentMethod)) {
                shouldShow = false;
            }
            
            // Check rating
            if (casinoData.rating < parseFloat(filters.minRating)) {
                shouldShow = false;
            }
            
            // Show/hide card
            card.style.display = shouldShow ? '' : 'none';
        });
    }
    
    // ===== Table Sorting =====
    const sortableHeaders = document.querySelectorAll('[data-sort]');
    
    if (sortableHeaders.length > 0) {
        sortableHeaders.forEach(header => {
            header.style.cursor = 'pointer';
            header.style.userSelect = 'none';
            
            // Add sort icon
            const sortIcon = document.createElement('span');
            sortIcon.innerHTML = ' ⇅';
            sortIcon.style.opacity = '0.5';
            header.appendChild(sortIcon);
            
            header.addEventListener('click', function() {
                const column = this.getAttribute('data-sort');
                const order = this.getAttribute('data-order') || 'asc';
                const newOrder = order === 'asc' ? 'desc' : 'asc';
                
                // Update all headers
                sortableHeaders.forEach(h => {
                    h.setAttribute('data-order', '');
                    const icon = h.querySelector('span');
                    if (icon) icon.style.opacity = '0.5';
                });
                
                this.setAttribute('data-order', newOrder);
                sortIcon.innerHTML = newOrder === 'asc' ? ' ↑' : ' ↓';
                sortIcon.style.opacity = '1';
                
                sortTable(column, newOrder);
            });
        });
    }
    
    function sortTable(column, order) {
        const table = document.querySelector('.bonus-table tbody');
        if (!table) return;
        
        const rows = Array.from(table.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
            let aValue, bValue;
            
            switch(column) {
                case 'casino':
                    aValue = a.querySelector('.table-casino span').textContent;
                    bValue = b.querySelector('.table-casino span').textContent;
                    break;
                case 'bonus':
                    aValue = parseInt(a.querySelector('.table-bonus strong').textContent.replace(/[^0-9]/g, ''));
                    bValue = parseInt(b.querySelector('.table-bonus strong').textContent.replace(/[^0-9]/g, ''));
                    break;
                case 'wagering':
                    aValue = parseInt(a.querySelector('.badge').textContent.replace(/[^0-9]/g, ''));
                    bValue = parseInt(b.querySelector('.badge').textContent.replace(/[^0-9]/g, ''));
                    break;
                case 'rating':
                    aValue = parseFloat(a.querySelector('.table-rating span:last-child').textContent);
                    bValue = parseFloat(b.querySelector('.table-rating span:last-child').textContent);
                    break;
                default:
                    return 0;
            }
            
            if (typeof aValue === 'string') {
                return order === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            } else {
                return order === 'asc' 
                    ? aValue - bValue
                    : bValue - aValue;
            }
        });
        
        // Re-append rows in sorted order
        rows.forEach(row => table.appendChild(row));
    }
    
    // ===== Search Functionality =====
    const searchInput = document.querySelector('[data-search="casino"]');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const searchTerm = this.value.toLowerCase().trim();
            const searchableItems = document.querySelectorAll('[data-searchable]');
            
            searchableItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm) || searchTerm === '') {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        }, 300));
    }
    
    // ===== Filter Chips (Show Active Filters) =====
    function createFilterChip(label, value) {
        const chip = document.createElement('div');
        chip.className = 'filter-chip';
        chip.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #6ECBDE;
            color: white;
            padding: 6px 12px;
            border-radius: 50px;
            font-size: 0.875rem;
            margin: 4px;
        `;
        chip.innerHTML = `
            <span>${label}: ${value}</span>
            <button style="background:none;border:none;color:white;cursor:pointer;font-size:1.2rem;">×</button>
        `;
        
        chip.querySelector('button').addEventListener('click', function() {
            chip.remove();
            // Reset corresponding filter
        });
        
        return chip;
    }
    
    // ===== Advanced Filter Toggle =====
    const advancedFilterToggle = document.querySelector('[data-toggle="advanced-filters"]');
    const advancedFilters = document.querySelector('.advanced-filters');
    
    if (advancedFilterToggle && advancedFilters) {
        advancedFilterToggle.addEventListener('click', function() {
            advancedFilters.style.display = advancedFilters.style.display === 'none' ? 'block' : 'none';
            this.textContent = advancedFilters.style.display === 'none' 
                ? '+ Show Advanced Filters' 
                : '- Hide Advanced Filters';
        });
    }
});

// Utility: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
