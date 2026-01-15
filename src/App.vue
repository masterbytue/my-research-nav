<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  Monitor, Document, Collection, EditPen, 
  DataAnalysis, CoffeeCup, Search, 
  UserFilled, Message, ChatDotRound
} from '@element-plus/icons-vue'

const activeMenu = ref('ai-tools')
const searchQuery = ref('')
const activeEngine = ref('bing') 

// --- 时间 ---
const currentTime = ref('')
const currentDate = ref('')
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })
  currentDate.value = now.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })
}
let timer = null

// --- 搜索引擎 ---
const searchEngines = [
  { id: 'bing', name: '必应', url: 'https://cn.bing.com/search?q=', color: '#00809d' },
  { id: 'google-scholar', name: '谷歌学术', url: 'https://scholar.google.com/scholar?hl=zh-CN&q=', color: '#4285F4' },
  { id: 'wanfang', name: '万方', url: 'https://s.wanfangdata.com.cn/paper?q=', color: '#c0392b' },
  { id: 'cnki', name: '知网', url: 'https://kns.cnki.net/kns8/defaultresult/index?kwd=', color: '#1e4fa3' },
  { id: 'sci-hub', name: 'Sci-Hub', url: 'https://sci-hub.se/', color: '#b92b27' }
]

const doSearch = () => {
  if (!searchQuery.value) return
  const current = searchEngines.find(e => e.id === activeEngine.value)
  window.open(current.url + encodeURIComponent(searchQuery.value), '_blank')
}

// --- Logo 获取逻辑 ---
const getLogo = (item) => {
  if (item.customIcon) return item.customIcon;
  try {
    const domain = new URL(item.url).hostname;
    // 使用 Google T2 接口兜底
    return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${item.url}&size=128`;
  } catch (e) {
    return '';
  }
}

// --- 颜色生成器 ---
const getColor = (name) => {
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/* --- 图标 Base64 硬编码 (彻底解决崩图问题) ---
*/
// Gemini 星光图标
const iconGemini = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0idXJsKCNhKSIgZD0iTTIyLjcgMTEuM2wtOS4xLTkuMWEuNi42IDAgMCAwLS41IDBMNCAxMS4zYS42LjYgMCAwIDAgMCAuOWw5LjEgOS4xYS42LjYgMCAwIDAgLjUgMGw5LjEtOS4xYS42LjYgMCAwIDAgMC0uOXoiLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSI0IiB5MT0iNCIgeDI9IjIwIiB5Mj0iMjAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM0RTg4RjkiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGNDY4MzEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4='

// 通义千问 (紫色漩涡)
const iconTongyi = 'https://img.alicdn.com/imgextra/i4/O1CN01Z5paLz1O0ZuCC7osS_!!6000000001644-55-tps-228-59.svg'

// --- 导航数据 ---
const navData = ref([
  {
    id: 'ai-tools', title: 'AI 助手', icon: 'Monitor',
    items: [
      { name: 'DeepSeek', desc: '深度推理，国产之光', url: 'https://chat.deepseek.com', customIcon: 'https://www.deepseek.com/favicon.ico' },
      { name: 'ChatGPT', desc: 'OpenAI 官方对话', url: 'https://chat.openai.com', customIcon: 'https://cdn.oaistatic.com/_next/static/media/favicon-32x32.be48395e.png' },
      // 使用 Base64
      { name: 'Gemini', desc: 'Google 最强多模态', url: 'https://gemini.google.com', customIcon: iconGemini },
      // 阿里云官方 SVG
      { name: '通义千问', desc: '阿里出品，长文档解析', url: 'https://tongyi.aliyun.com', customIcon: iconTongyi },
      { name: '智谱清言', desc: '清华系，超强中文理解', url: 'https://chatglm.cn', customIcon: 'https://chatglm.cn/img/icons/favicon-32x32.png' }
    ]
  },
  {
    id: 'cn-lit', title: '中文文献', icon: 'Document',
    items: [
      { name: '中国知网', desc: 'CNKI 总库', url: 'https://www.cnki.net', customIcon: 'https://piccache.cnki.net/kdn/index/kns8/nimages/favicon.ico' },
      { name: '万方数据', desc: '学位论文 & 期刊', url: 'https://www.wanfangdata.com.cn', customIcon: 'https://www.wanfangdata.com.cn/favicon.ico' },
      { name: '维普网', desc: '中文科技期刊', url: 'http://www.cqvip.com', customIcon: 'http://www.cqvip.com/favicon.ico' }
    ]
  },
  {
    id: 'en-lit', title: '外文 & 顶刊', icon: 'Collection',
    items: [
      { name: 'Web of Science', desc: 'SCI 核心引文索引', url: 'https://www.webofscience.com', customIcon: 'https://www.webofscience.com/favicon.ico' },
      { name: 'Google Scholar', desc: '学术搜索镜像', url: 'https://scholar.google.com', customIcon: 'https://scholar.google.com/favicon.ico' },
      { name: 'Sci-Hub', desc: '文献下载神器', url: 'https://sci-hub.se', customIcon: 'https://sci-hub.se/favicon.ico' },
      { name: 'Elsevier', desc: '爱思唯尔', url: 'https://www.elsevier.com', customIcon: 'https://www.elsevier.com/favicon.ico' },
      { name: 'Springer', desc: '施普林格', url: 'https://link.springer.com', customIcon: 'https://link.springer.com/favicon.ico' }
    ]
  },
  {
    id: 'tools', title: '科研工具', icon: 'DataAnalysis',
    items: [
      { name: 'OriginLab', desc: '专业绘图软件', url: 'https://www.originlab.com', customIcon: 'https://www.originlab.com/favicon.ico' },
      { name: 'Zotero', desc: '开源文献管理', url: 'https://www.zotero.org', customIcon: 'https://www.zotero.org/favicon.ico' },
      { name: 'DeepL', desc: '学术精准翻译', url: 'https://www.deepl.com', customIcon: 'https://static.deepl.com/img/logo/deepl-logo-blue.svg' },
      { name: 'LetPub', desc: '选刊 & 分区查询', url: 'https://www.letpub.com.cn', customIcon: 'https://www.letpub.com.cn/favicon.ico' },
      { name: 'Google Patents', desc: '全球专利检索', url: 'https://patents.google.com', customIcon: 'https://www.gstatic.com/images/branding/product/2x/google_patents_96dp.png' },
      { name: 'SooPAT', desc: '国产专利搜索', url: 'http://www.soopat.com', customIcon: 'http://www.soopat.com/favicon.ico' },
      { name: 'Espacenet', desc: '世界专利数据库', url: 'https://worldwide.espacenet.com', customIcon: 'https://worldwide.espacenet.com/favicon.ico' },
      { name: 'Innojoy', desc: '大为专利检索', url: 'https://www.innojoy.com', customIcon: 'https://www.innojoy.com/favicon.ico' }
    ]
  },
  {
    id: 'relax', title: '摸鱼充电', icon: 'CoffeeCup',
    items: [
      { name: 'Bilibili', desc: '知识学习网站', url: 'https://www.bilibili.com', customIcon: 'https://www.bilibili.com/favicon.ico' },
      { name: '小木虫', desc: '学术互动社区', url: 'http://muchong.com', customIcon: 'http://muchong.com/favicon.ico' }
    ]
  },
  // --- 关于我 ---
  {
    id: 'about', title: '关于我', icon: 'UserFilled', items: []
  }
])

// --- 逻辑处理 ---
const filteredNav = computed(() => {
  if (!searchQuery.value) return navData.value
  const query = searchQuery.value.toLowerCase()
  return navData.value.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.desc.toLowerCase().includes(query)
    )
  })).filter(cat => cat.items.length > 0)
})

const handleMenuClick = (id) => {
  activeMenu.value = id
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" })
}

const onScroll = () => {
  const sections = navData.value.map(cat => document.getElementById(cat.id))
  for (const section of sections) {
    if (section && window.scrollY >= section.offsetTop - 150) {
      activeMenu.value = section.getAttribute('id')
    }
  }
}

const onImgError = (e) => {
  e.target.style.display = 'none' 
}

onMounted(() => { 
  window.addEventListener('scroll', onScroll) 
  updateTime()
  timer = setInterval(updateTime, 1000)
})
onUnmounted(() => { 
  window.removeEventListener('scroll', onScroll) 
  clearInterval(timer)
})
</script>

<template>
  <div class="app-container">
    
    <nav class="sidebar">
      <div class="logo-area">🎓</div>
      <ul class="nav-list">
        <li v-for="cat in navData" :key="cat.id" 
            :class="{ active: activeMenu === cat.id }"
            @click="handleMenuClick(cat.id)">
          <el-icon class="nav-icon"><component :is="cat.icon" /></el-icon>
          <span class="nav-text">{{ cat.title }}</span>
        </li>
      </ul>
    </nav>

    <main class="main-content">
      
      <header class="hero-header">
        
        <div class="top-status">
          <div class="time-capsule">
            <span class="time-text">{{ currentTime }}</span>
            <span class="divider">|</span>
            <span class="date-text">{{ currentDate }}</span>
          </div>

          <div class="top-links">
            <a href="https://space.bilibili.com" target="_blank">科研视频</a>
            <a href="https://www.keyanmate.com" target="_blank">科研Mate</a>
          </div>
        </div>

        <div class="hero-body">
          <h1 class="hero-title">科研导航</h1>
          <p class="hero-subtitle">学术资源 · 效率工具 · AI 助手</p>
          
          <div class="minimal-search">
            <div class="engine-select">
              <select v-model="activeEngine">
                <option v-for="e in searchEngines" :key="e.id" :value="e.id">{{ e.name }}</option>
              </select>
            </div>
            <input 
              v-model="searchQuery" 
              class="search-input" 
              placeholder="搜索文献、AI 或工具..." 
              @keyup.enter="doSearch"
            />
            
            <button class="search-btn" @click="doSearch">
              <span>
                <el-icon style="vertical-align: middle; margin-right: 4px;"><Search /></el-icon>
                搜索
              </span>
            </button>
          </div>
        </div>
        
        <div class="hero-bg"></div>
      </header>

      <div class="cards-container">
        <section v-for="cat in filteredNav" :key="cat.id" :id="cat.id" class="group-section">
          <div class="section-header">
            <el-icon><component :is="cat.icon" /></el-icon>
            <h2>{{ cat.title }}</h2>
          </div>
          
          <div v-if="cat.id === 'about'" class="about-container">
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <div class="front-content-simple">
                    <el-icon class="avatar-simple"><UserFilled /></el-icon>
                    <div class="text-group">
                      <h3 class="en-name">ZHENXIANG XIA</h3>
                      <p class="en-email">946883902@qq.com</p>
                    </div>
                  </div>
                </div>
                <div class="flip-card-back">
                  <div class="back-content">
                    <el-icon class="quote-icon"><ChatDotRound /></el-icon>
                    <p class="back-text">
                      师弟师妹们有问题可反馈<br>
                      我一定听取意见<br>
                      大家都可以的！💪
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="grid-box">
            <a v-for="item in cat.items" :key="item.name" :href="item.url" target="_blank" class="card">
              <div class="card-icon-area">
                <div class="icon-fallback" :style="{ background: getColor(item.name) }">
                  {{ item.name.charAt(0).toUpperCase() }}
                </div>
                <img 
                  :src="getLogo(item)" 
                  referrerpolicy="no-referrer" 
                  loading="lazy" 
                  @error="onImgError" 
                  alt="" 
                />
              </div>
              <div class="card-info">
                <div class="card-title">{{ item.name }}</div>
                <div class="card-desc">{{ item.desc }}</div>
              </div>
            </a>
          </div>

        </section>
      </div>

    </main>
  </div>
</template>

<style>
/* 1. 基础重置 */
:root {
  --bg-body: #f5f7fa;
  --bg-card: #ffffff;
  --text-primary: #1d1d1f;
  --text-secondary: #86868b;
  --accent: #0071e3;
  --border: #d2d2d7;
  --radius: 12px;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  background-color: var(--bg-body);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
}
::-webkit-scrollbar { display: none; }
ul { list-style: none; padding: 0; margin: 0; }
a { text-decoration: none; color: inherit; }

/* 2. 布局 */
.app-container { display: flex; min-height: 100vh; }

/* 3. 侧边栏 */
.sidebar {
  width: 70px; height: 100vh; position: fixed; left: 0; top: 0;
  background: var(--bg-card); border-right: 1px solid rgba(0,0,0,0.05);
  display: flex; flex-direction: column; align-items: center; padding-top: 20px; z-index: 100;
}
.logo-area { font-size: 24px; margin-bottom: 30px; cursor: default; }
.nav-list { width: 100%; display: flex; flex-direction: column; gap: 10px; align-items: center; }
.nav-list li {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; justify-content: center; align-items: center;
  cursor: pointer; color: var(--text-secondary); transition: all 0.2s; position: relative;
}
.nav-list li:hover, .nav-list li.active { background: var(--accent); color: white; box-shadow: 0 4px 10px rgba(0,113,227,0.3); }
.nav-icon { font-size: 20px; }
.nav-text {
  position: absolute; left: 60px; background: rgba(0,0,0,0.8); color: white;
  padding: 4px 10px; border-radius: 6px; font-size: 12px;
  opacity: 0; pointer-events: none; transition: opacity 0.2s; white-space: nowrap;
}
.nav-list li:hover .nav-text { opacity: 1; }

/* 4. 主内容区 */
.main-content { flex: 1; margin-left: 70px; width: calc(100% - 70px); }

/* 5. Header */
.hero-header {
  height: 320px;
  position: relative;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  overflow: hidden; border-bottom: 1px solid var(--border);
}
.hero-bg {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop') center/cover no-repeat;
  filter: brightness(0.9); z-index: -1;
}

/* 顶部状态栏 */
.top-status {
  position: absolute; top: 0; width: 100%;
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 40px;
  z-index: 2;
}

/* 时间胶囊 */
.time-capsule {
  display: flex; align-items: center; gap: 12px;
  background: rgba(0, 0, 0, 0.4); 
  backdrop-filter: blur(12px); 
  padding: 10px 20px;
  border-radius: 99px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}
.time-text, .date-text {
  font-family: "Times New Roman", "SimSun", serif; 
  font-weight: 700; 
  letter-spacing: 0.5px;
}
.time-text { font-size: 20px; }
.date-text { font-size: 16px; opacity: 0.9; }
.divider { opacity: 0.5; font-family: "Times New Roman", serif; font-size: 16px; }

/* 顶部链接 */
.top-links a { 
  margin-left: 20px; color: rgba(255,255,255,0.9); text-decoration: none; font-size: 14px; font-weight: 500;
  transition: all 0.2s; text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}
.top-links a:hover { color: white; text-shadow: 0 0 8px rgba(255,255,255,0.6); }

.hero-body { text-align: center; color: white; z-index: 1; margin-top: 10px; }
.hero-title { font-size: 48px; font-weight: 700; margin: 0; letter-spacing: 2px; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
.hero-subtitle { font-size: 16px; opacity: 0.95; margin: 10px 0 30px; font-weight: 400; letter-spacing: 1px; text-shadow: 0 1px 3px rgba(0,0,0,0.2); }

/* 搜索框 */
.minimal-search {
  display: flex; align-items: center;
  background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(20px);
  padding: 6px; border-radius: 99px; width: 500px; max-width: 90vw;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2); transition: transform 0.2s;
}
.minimal-search:focus-within { transform: scale(1.02); }
.engine-select select { border: none; background: transparent; padding: 0 10px; font-size: 14px; color: #333; outline: none; font-weight: 600; cursor: pointer; }
.search-input { flex: 1; border: none; background: transparent; padding: 10px; font-size: 16px; outline: none; }

/* 酷炫按钮 */
.search-btn {
  position: relative; text-decoration: none; color: #fff; margin-left: 10px; 
  background: linear-gradient(45deg, #0ce39a, #69007f, #fc0987);
  padding: 10px 20px; border-radius: 20px; font-size: 14px; cursor: pointer; border: none; 
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.search-btn span { position: relative; z-index: 1; display: flex; align-items: center; font-weight: bold; }
.search-btn::before { content: ""; position: absolute; inset: 1px; background: #272727; border-radius: 19px; transition: 0.5s; }
.search-btn:hover::before { opacity: 0.7; }
.search-btn::after { content: ""; position: absolute; inset: 0px; background: linear-gradient(45deg, #0ce39a, #69007f, #fc0987); border-radius: 19px; transition: 0.5s; opacity: 0; filter: blur(20px); }
.search-btn:hover:after { opacity: 1; }

/* 6. 卡片区域 */
.cards-container { padding: 40px 60px; max-width: 1200px; margin: 0 auto; }
.group-section { margin-bottom: 50px; }
.section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; color: var(--text-primary); }
.section-header h2 { font-size: 20px; font-weight: 600; margin: 0; }
.grid-box { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }

.card {
  background: var(--bg-card); border: 1px solid rgba(0,0,0,0.04); border-radius: 10px; padding: 16px;
  display: flex; align-items: center; transition: all 0.2s ease; cursor: pointer;
}
.card:hover { transform: translateY(-2px); border-color: var(--accent); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

.card-icon-area {
  width: 40px; height: 40px; border-radius: 10px; margin-right: 12px; position: relative; overflow: hidden; flex-shrink: 0; 
}
.icon-fallback { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white; font-weight: 700; font-size: 18px; }
.card-icon-area img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; padding: 2px; box-sizing: border-box; background: white; transition: opacity 0.2s; }
.load-error img { opacity: 0; }

.card-info { flex: 1; overflow: hidden; }
.card-title { font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px; }
.card-desc { font-size: 12px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* --- 3D 翻转卡片 (Clean English Version) --- */
.about-container { display: flex; justify-content: center; padding: 40px 0; }
.flip-card { width: 320px; height: 200px; perspective: 1000px; }
.flip-card-inner { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 0.8s; }
.flip-card:hover .flip-card-inner { transform: rotateY(180deg); }

.flip-card-front, .flip-card-back {
  position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 16px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: #fff; box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

/* 正面：利落英文 */
.flip-card-front {
  background: linear-gradient(135deg, #6A2C70, #9D50BB);
  border: 4px solid #fff;
}
.front-content-simple { text-align: center; }
.avatar-simple { font-size: 56px; margin-bottom: 12px; opacity: 0.95; }
.text-group { display: flex; flex-direction: column; gap: 4px; }
.en-name { font-size: 26px; margin: 0; font-weight: 800; letter-spacing: 3px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-transform: uppercase; }
.en-email { font-size: 14px; margin: 0; font-family: "SF Mono", "Menlo", monospace; opacity: 0.85; letter-spacing: 1px; }

/* 反面：温情中文 */
.flip-card-back {
  background: linear-gradient(135deg, #F08A5D, #FF6B6B);
  border: 4px solid #fff;
  transform: rotateY(180deg);
}
.back-content { padding: 20px; text-align: center; }
.quote-icon { font-size: 32px; margin-bottom: 10px; opacity: 0.8; }
.back-text { font-size: 15px; line-height: 1.8; margin: 0; font-weight: 500; font-family: "PingFang SC", sans-serif; }

@media (max-width: 768px) {
  .sidebar { width: 0; overflow: hidden; }
  .main-content { margin-left: 0; width: 100%; }
  .cards-container { padding: 20px; }
  .minimal-search { width: 90%; }
  .hero-title { font-size: 32px; }
  .top-status { padding: 20px; }
  .time-capsule { padding: 6px 12px; }
  .time-text { font-size: 16px; }
}
</style>