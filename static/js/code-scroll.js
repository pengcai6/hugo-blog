// 代码块滚动优化 - 动态检测和提示
document.addEventListener('DOMContentLoaded', function () {
    const codeBlocks = document.querySelectorAll('pre');

    codeBlocks.forEach(function (pre) {
        // 检查代码块是否可以滚动
        function checkScrollable() {
            const isScrollable = pre.scrollWidth > pre.clientWidth;

            if (isScrollable) {
                pre.classList.add('scrollable-code');

                // 添加滚动事件监听
                pre.addEventListener('scroll', function () {
                    const scrollLeft = pre.scrollLeft;
                    const maxScroll = pre.scrollWidth - pre.clientWidth;
                    const scrollPercentage = scrollLeft / maxScroll;

                    // 根据滚动位置调整提示文字
                    if (scrollPercentage > 0.9) {
                        pre.classList.add('scrolled-end');
                    } else {
                        pre.classList.remove('scrolled-end');
                    }
                });
            } else {
                pre.classList.remove('scrollable-code');
            }
        }

        // 初始检查
        checkScrollable();

        // 窗口大小改变时重新检查
        window.addEventListener('resize', checkScrollable);

        // 鼠标悬停效果
        pre.addEventListener('mouseenter', function () {
            if (pre.classList.contains('scrollable-code')) {
                pre.style.cursor = 'grab';
            }
        });

        pre.addEventListener('mouseleave', function () {
            pre.style.cursor = 'default';
        });

        // 拖拽滚动支持
        let isMouseDown = false;
        let startX;
        let scrollLeftStart;

        pre.addEventListener('mousedown', function (e) {
            if (!pre.classList.contains('scrollable-code')) return;

            isMouseDown = true;
            startX = e.pageX - pre.offsetLeft;
            scrollLeftStart = pre.scrollLeft;
            pre.style.cursor = 'grabbing';
            e.preventDefault();
        });

        pre.addEventListener('mousemove', function (e) {
            if (!isMouseDown || !pre.classList.contains('scrollable-code')) return;

            e.preventDefault();
            const x = e.pageX - pre.offsetLeft;
            const walk = (x - startX) * 2; // 滚动速度
            pre.scrollLeft = scrollLeftStart - walk;
        });

        pre.addEventListener('mouseup', function () {
            isMouseDown = false;
            pre.style.cursor = 'grab';
        });

        pre.addEventListener('mouseleave', function () {
            isMouseDown = false;
            pre.style.cursor = 'default';
        });
    });
});
