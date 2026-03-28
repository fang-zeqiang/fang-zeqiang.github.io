# House Quest - 家务成就系统

## 🎮 在线访问

**访问地址**: https://zeqiang.fun/house-quest/

> 注意：如果首次访问出现 404，请等待 2-3 分钟让 GitHub Pages 完成同步。

---

## ✨ 功能特性

### 已实现功能

1. **首页 Dashboard**
   - 双方积分排行榜（轻竞争）
   - 连续完成天数 (Streak)
   - 今日待办任务数
   - 本周积分统计
   - 最近解锁成就展示

2. **家务清单模块**
   - 添加新任务
   - 任务状态管理（待办/进行中/已完成）
   - 滑动完成/删除（移动端友好）
   - 任务分类筛选

3. **积分机制**
   - 基础积分（每个任务 10 分）
   - 拖延奖励：每天额外 +5 分
   - 实时显示当前任务价值
   - 积分增长动画

4. **成就系统**
   - 🧼 技能型：头发清洁者、排水守护者
   - 🔥 连击型：7天连胜、14天稳定输出
   - 🏆 逆转型：延迟杀手、家务清零大师
   - 全屏解锁动画 + 震动反馈

5. **角色管理**
   - 两个固定角色（可自定义名称）
   - 点击编辑角色名
   - 切换当前操作角色

### 设计特点

- 📱 移动端优先，单手操作
- 🎨 Anthropic 风格：极简、大字体、柔和渐变
- ✨ 玻璃拟态卡片设计
- 🎭 流畅的 Framer Motion 动画
- 💾 LocalStorage 本地数据持久化

---

## 🛠 技术栈

- React 19 + TypeScript
- Vite 构建工具
- Tailwind CSS v4
- Framer Motion 动画库
- Lucide React 图标

---

## 📁 项目结构

```
house-quest/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx      # 首页仪表盘
│   │   ├── ChoreList.tsx      # 任务列表
│   │   ├── ChoreCard.tsx      # 任务卡片
│   │   ├── AchievementPopup.tsx   # 成就弹窗
│   │   ├── AchievementsView.tsx   # 成就列表页
│   │   └── UserSelector.tsx   # 角色选择器
│   ├── hooks/
│   │   ├── useLocalStorage.ts # 本地存储 Hook
│   │   └── useAchievements.ts # 成就检测 Hook
│   ├── types/
│   │   └── index.ts           # TypeScript 类型定义
│   ├── App.tsx                # 主应用组件
│   └── index.css              # 全局样式
├── dist/                      # 构建输出
└── index.html
```

---

## 🚀 本地开发

```bash
# 进入项目目录
cd /tmp/house-quest

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

---

## 📝 后续优化建议

### 短期 (MVP 完善)
- [ ] 添加任务分类标签（清洁、整理、烹饪等）
- [ ] 任务详情编辑功能
- [ ] 积分历史记录
- [ ] 成就分享功能

### 中期
- [ ] Supabase 后端同步
- [ ] 数据导出/导入
- [ ] 更多成就类型
- [ ] 任务模板库

### 长期
- [ ] 推送提醒
- [ ] 家务统计报表
- [ ] 多设备同步
- [ ] 暗黑模式

---

## 🎯 设计理念

> "把家务从被动责任变成共同升级的游戏"

House Quest 不是管理工具，而是让做家务变得有成就感、轻松有趣的系统。拖延不再是负面情绪，而是变成"奖励升级"。

---

部署时间：2026-03-28
部署位置：zeqiang.fun/house-quest/