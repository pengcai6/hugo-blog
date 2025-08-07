# HugoMods 内容加密使用说明

## 概述

HugoMods encrypt 模块已经成功集成到你的Hugo博客中，现在你可以使用加密功能来保护敏感内容。

## 配置信息

**Hugo配置** (`hugo.toml`):
- 模块已导入：`github.com/hugomods/encrypt`
- 默认密码：`cai6blog2025`
- 存储方式：`session` (会话存储)

**主题集成**:
- CSS导入：已添加到 `layouts/_default/baseof.html`
- JS导入：已添加到 `layouts/_default/baseof.html`

## 使用方法

### 1. 使用默认密码加密原始内容

```markdown
{{< encrypt >}}
这里是需要加密的内容
{{< /encrypt >}}
```

### 2. 使用默认密码加密Markdown内容

```markdown
{{% encrypt %}}
**这里是需要加密的Markdown内容**

- 支持列表
- 支持**加粗**
- 支持代码块

```javascript
console.log("支持代码高亮");
```
{{% /encrypt %}}
```

### 3. 使用自定义密码加密

```markdown
{{% encrypt 你的自定义密码 %}}
这里是使用自定义密码加密的内容
{{% /encrypt %}}
```

## 构建和加密流程

1. **编写内容**：在Markdown文件中使用上述shortcode语法
2. **构建站点**：运行 `hugo` 命令生成静态文件
3. **加密处理**：运行 `~/go/bin/encrypt` 对生成的内容进行加密
4. **部署**：将加密后的public目录内容部署到服务器

## 完整命令流程

```bash
# 1. 构建Hugo站点
hugo

# 2. 加密内容
~/go/bin/encrypt

# 3. 本地测试（注意：hugo server无法测试加密功能）
# 需要使用静态文件服务器，如：
python3 -m http.server 8080 -d public
```

## 注意事项

1. **测试限制**：`hugo server` 不支持加密功能测试，因为encrypt工具需要在构建完成后运行
2. **密码管理**：默认密码设置在hugo.toml中，可以通过参数修改
3. **存储方式**：当前使用session存储，用户输入的密码会在会话结束后清除
4. **生产环境**：确保在部署前运行encrypt工具

## 测试结果

✅ CSS样式正确加载 (`/css/encrypt.css`)
✅ JavaScript功能正确加载 (`/js/encrypt.js`)  
✅ 加密界面正确显示（锁图标 + 密码输入框）
✅ 解密按钮正确显示（蓝色"解锁"按钮）
✅ 多种加密方式支持（原始内容、Markdown、自定义密码）
✅ 密码数据正确存储（data-password属性）
✅ 响应式设计支持（深色/浅色主题适配）

## 按钮样式说明

解密按钮已通过自定义CSS美化：
- **浅色模式**：蓝色按钮，悬停效果
- **深色模式**：紫色按钮，适配Dracula主题
- **交互效果**：点击和悬停动画
- **按钮文本**：显示"解锁"文字

## 示例文章

查看 `content/posts/2025/测试加密功能.md` 了解完整的使用示例。
