/* Additional scripts for only thankyou.html */

        document.addEventListener('DOMContentLoaded', function() {
            const now = new Date();
            document.getElementById('copyright-year').textContent = now.getFullYear();
            document.getElementById('last-modified').textContent = document.lastModified;
            
            const hamburgerMenu = document.getElementById('hamburger-menu');
            const navLinks = document.querySelector('.nav-links');
            
            hamburgerMenu.addEventListener('click', function() {
                navLinks.classList.toggle('show');
                this.textContent = navLinks.classList.contains('show') ? '✕' : '☰';
            });
            
            const urlParams = new URLSearchParams(window.location.search);
            const summaryContainer = document.getElementById('application-summary');
            
            function formatMembershipLevel(level) {
                const levels = {
                    'np': 'NP Membership (Non-Profit)',
                    'bronze': 'Bronze Membership',
                    'silver': 'Silver Membership',
                    'gold': 'Gold Membership'
                };
                return levels[level] || level;
            }
            
            function formatTimestamp(timestamp) {
                const date = new Date(timestamp);
                return date.toLocaleString();
            }
            
            const details = [
                { label: 'First Name', value: urlParams.get('first-name') },
                { label: 'Last Name', value: urlParams.get('last-name') },
                { label: 'Email', value: urlParams.get('email') },
                { label: 'Mobile Phone', value: urlParams.get('phone') },
                { label: 'Organization', value: urlParams.get('organization') },
                { label: 'Membership Level', value: formatMembershipLevel(urlParams.get('membership-level')) },
                { label: 'Application Date', value: formatTimestamp(urlParams.get('timestamp')) }
            ];
            
            details.forEach(detail => {
                if (detail.value) {
                    const detailItem = document.createElement('div');
                    detailItem.className = 'detail-item';
                    
                    const labelSpan = document.createElement('span');
                    labelSpan.className = 'detail-label';
                    labelSpan.textContent = detail.label + ':';
                    
                    const valueSpan = document.createElement('span');
                    valueSpan.className = 'detail-value';
                    valueSpan.textContent = detail.value;
                    
                    detailItem.appendChild(labelSpan);
                    detailItem.appendChild(valueSpan);
                    summaryContainer.appendChild(detailItem);
                }
            });
        });