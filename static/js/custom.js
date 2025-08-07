// 自定义JavaScript - Dream主题增强功能

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {

    // 添加平滑滚动效果
    addSmoothScrolling();

    // 添加代码复制功能
    addCodeCopyButton();

    // 添加图片懒加载
    enableImageLazyLoad();

    // 注释掉卡片悬停效果，让CSS完全控制
    // enhanceCardHover();

    // 添加返回顶部按钮
    addBackToTopButton();

    // 代码块滚动优化
    optimizeCodeScrolling();

    // 添加阅读进度条
    addReadingProgress();

    // 添加文章摘要截断功能
    truncatePostExcerpts();

    // 添加代码块滚动优化
    optimizeCodeScrolling();
});

// 平滑滚动效果
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 代码复制功能
function addCodeCopyButton() {
    document.querySelectorAll('pre').forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.textContent = '复制';
        button.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background: #10b981;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0;
        `;

        // 添加相对定位到父容器
        block.style.position = 'relative';
        block.appendChild(button);

        // 鼠标悬停显示按钮
        block.addEventListener('mouseenter', () => {
            button.style.opacity = '1';
        });

        block.addEventListener('mouseleave', () => {
            button.style.opacity = '0';
        });

        // 复制功能
        button.addEventListener('click', () => {
            const code = block.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                button.textContent = '已复制!';
                button.style.background = '#16a34a';
                setTimeout(() => {
                    button.textContent = '复制';
                    button.style.background = '#10b981';
                }, 2000);
            });
        });
    });
}

// 图片懒加载
function enableImageLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// 增强卡片悬停效果
function enhanceCardHover() {
    document.querySelectorAll('.dream-post-summary-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            // 只设置位移，让CSS处理透明度和模糊效果
            this.style.transform = 'translateY(-5px)';
            // 移除可能冲突的样式设置
            this.style.background = '';
            this.style.backdropFilter = '';
            this.style.webkitBackdropFilter = '';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            // 移除可能冲突的样式设置
            this.style.background = '';
            this.style.backdropFilter = '';
            this.style.webkitBackdropFilter = '';
        });
    });
}

// 返回顶部按钮
function addBackToTopButton() {
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(backToTopButton);

    // 滚动时显示/隐藏按钮
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.transform = 'scale(1)';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.transform = 'scale(0.8)';
        }
    });

    // 点击返回顶部
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 悬停效果
    backToTopButton.addEventListener('mouseenter', () => {
        backToTopButton.style.transform = 'scale(1.1)';
    });

    backToTopButton.addEventListener('mouseleave', () => {
        backToTopButton.style.transform = 'scale(1)';
    });
}

// 阅读进度条
function addReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        z-index: 9999;
        transition: width 0.3s ease;
    `;

    document.body.appendChild(progressBar);

    // 计算阅读进度
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// 主题切换动画增强
function enhanceThemeToggle() {
    const themeToggle = document.querySelector('[data-theme-toggle]');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        });
    }
}

// 添加打字机效果（可选）
function addTypewriterEffect(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function typeWriter() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }

    typeWriter();
}

// 文章摘要截断功能 - 智能处理代码和图片
function truncatePostExcerpts() {
    // 首先移除所有摘要中的媒体元素和代码块
    document.querySelectorAll('.dream-post-summary-content, .dream-post-summary-excerpt').forEach(container => {
        // 移除图片、代码块、表格等
        container.querySelectorAll('img, pre, code, blockquote, table, iframe, video, audio, svg, .highlight, .highlighter-rouge').forEach(element => {
            element.remove();
        });

        // 移除代码相关的类
        container.querySelectorAll('[class*="language-"], [class*="highlight"]').forEach(element => {
            element.remove();
        });
    });

    // 然后处理文本截断
    document.querySelectorAll('.dream-post-summary-content, .dream-post-summary-excerpt').forEach(element => {
        if (element.classList.contains('dream-processed')) {
            return;
        }
        element.classList.add('dream-processed');

        // 获取纯文本内容
        let textContent = '';
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            textContent += node.textContent;
        }

        // 如果纯文本内容过长，进行截断
        if (textContent.length > 150) {
            const truncatedText = textContent.substring(0, 150).trim() + '...';
            // 清空原内容并设置截断后的文本
            element.innerHTML = `<p>${truncatedText}</p>`;
            element.classList.add('dream-truncated-content');
        }
    });

    // 特殊处理可能的HTML内容
    document.querySelectorAll('.dream-post-summary-card').forEach(card => {
        const contentElements = card.querySelectorAll('p, div:not(.dream-post-meta):not(.dream-post-summary-meta)');
        contentElements.forEach(el => {
            // 移除所有非文本元素
            el.querySelectorAll('img, pre, code, blockquote, table').forEach(media => media.remove());

            // 如果元素文本过长，截断
            if (el.textContent.length > 100) {
                el.textContent = el.textContent.substring(0, 100).trim() + '...';
            }
        });
    });
}

// 代码块滚动优化
function optimizeCodeScrolling() {
    document.querySelectorAll('pre').forEach(pre => {
        const code = pre.querySelector('code');
        if (!code) return;

        // 强制设置代码块样式以确保可滚动
        pre.style.overflow = 'auto';
        pre.style.maxWidth = '900px';
        pre.style.width = '100%';

        // 检查是否需要水平滚动
        setTimeout(() => { // 延迟检查，确保渲染完成
            console.log(`Code block scroll check: scrollWidth=${code.scrollWidth}, clientWidth=${code.clientWidth}`);
            if (code.scrollWidth > code.clientWidth) {
                pre.classList.add('scrollable-code');
                console.log('Added scrollable-code class to pre element');

                // 动态滚动检测
                let scrollTimeout;
                code.addEventListener('scroll', () => {
                    pre.classList.add('scrolling');
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(() => {
                        pre.classList.remove('scrolling');
                    }, 1000);
                });

                // 鼠标悬停效果
                pre.addEventListener('mouseenter', () => {
                    pre.classList.add('hover-active');
                });

                pre.addEventListener('mouseleave', () => {
                    pre.classList.remove('hover-active');
                });

                // 拖拽滚动支持
                let isDown = false;
                let startX;
                let scrollLeft;

                code.addEventListener('mousedown', (e) => {
                    if (e.button !== 0) return; // 只响应左键
                    isDown = true;
                    code.style.cursor = 'grabbing';
                    startX = e.pageX - code.offsetLeft;
                    scrollLeft = code.scrollLeft;
                });

                code.addEventListener('mouseleave', () => {
                    isDown = false;
                    code.style.cursor = '';
                });

                code.addEventListener('mouseup', () => {
                    isDown = false;
                    code.style.cursor = '';
                });

                code.addEventListener('mousemove', (e) => {
                    if (!isDown) return;
                    e.preventDefault();
                    const x = e.pageX - code.offsetLeft;
                    const walk = (x - startX) * 2;
                    code.scrollLeft = scrollLeft - walk;
                });
            } else {
                console.log('Code block does not need scrolling');
            }
        }, 100);
    });
}// 控制台彩蛋 - 绿色主题
console.log('%c欢迎来到cai6的技术博客! 🎉', 'color: #10b981; font-size: 20px; font-weight: bold;');
console.log('%c如果你对代码感兴趣，欢迎访问我的GitHub: https://github.com/pengcai6', 'color: #16a34a; font-size: 14px;');
